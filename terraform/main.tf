terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Terraformを実行するユーザーのサービスアカウントを作成
resource "google_service_account" "terraform_sa" {
  account_id   = "terraform-sa"
  display_name = "Terraform Service Account"
  project      = var.project_id
}

# Terraformサービスアカウントに必要な権限を付与
resource "google_project_iam_member" "terraform_sa_roles" {
  for_each = toset([
    "roles/iam.serviceAccountAdmin",
    "roles/iam.workloadIdentityPoolAdmin",
    "roles/serviceusage.serviceUsageAdmin"
  ])
  
  project = var.project_id
  role    = each.key
  member  = "serviceAccount:${google_service_account.terraform_sa.email}"
}

# 必要なAPIの有効化
resource "google_project_service" "services" {
  for_each = toset([
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com"
  ])
  
  project = var.project_id
  service = each.key
  disable_on_destroy = false

  lifecycle {
    create_before_destroy = true
  }
}

# Artifact Registryリポジトリの作成
resource "google_artifact_registry_repository" "docker_repo" {
  depends_on = [google_project_service.services]
  
  location      = var.region
  repository_id = "docker-repo"
  description   = "Docker repository for GitHub Actions"
  format        = "DOCKER"
  project       = var.project_id
}

# GitHub Actions用のサービスアカウントの作成
resource "google_service_account" "github_actions" {
  depends_on = [
    google_project_service.services,
    google_project_iam_member.terraform_sa_roles
  ]
  
  account_id   = var.service_account_name
  display_name = "Service Account for GitHub Actions"
  description  = "Used for deploying to Cloud Run from GitHub Actions"
  project      = var.project_id
}

# Workload Identity Poolの作成
resource "google_iam_workload_identity_pool" "github_pool" {
  depends_on = [google_project_service.services]
  
  workload_identity_pool_id = var.workload_identity_pool_name
  project  = var.project_id
  display_name = "GitHub Actions Pool"
  description  = "Workload Identity Pool for GitHub Actions"
}

# Workload Identity Providerの作成
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = var.workload_identity_provider_name
  project                           = var.project_id
  
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
  }
  
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  attribute_condition = "attribute.repository == \"${var.github_repo}\""
}

# GitHub Actions用サービスアカウントへのロールの付与
resource "google_project_iam_member" "service_account_roles" {
  for_each = toset([
    "roles/run.admin",
    "roles/iam.serviceAccountUser",
    "roles/artifactregistry.writer"
  ])
  
  project = var.project_id
  role    = each.key
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Workload Identity Poolとサービスアカウントの紐付け
resource "google_service_account_iam_member" "workload_identity_user" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repo}"
}

# Secretsに必要な情報を出力
output "PROJECT_ID" {
  value       = var.project_id
  description = "GCP Project ID"
}

output "WIF_PROVIDER" {
  value       = "projects/${data.google_project.project.number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.github_pool.workload_identity_pool_id}/providers/${google_iam_workload_identity_pool_provider.github_provider.workload_identity_pool_provider_id}"
  description = "Workload Identity Provider resource name for GitHub Actions"
}

output "SA_EMAIL" {
  value       = google_service_account.github_actions.email
  description = "Service Account email for GitHub Actions"
}

data "google_project" "project" {
  project_id = var.project_id
}