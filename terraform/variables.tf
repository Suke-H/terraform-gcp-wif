variable "project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "region" {
  type        = string
  description = "GCP Region"
  default     = "asia-northeast1"
}

variable "service_account_name" {
  type        = string
  description = "Service Account name"
  default     = "github-actions-sa"
}

variable "workload_identity_pool_name" {
  type        = string
  description = "Workload Identity Pool name"
  default     = "github-actions-pool"
}

variable "workload_identity_provider_name" {
  type        = string
  description = "Workload Identity Provider name"
  default     = "github-provider"
}

variable "github_repo" {
  type        = string
  description = "GitHub repository in format owner/repository"
}