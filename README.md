# Cloud Run自動デプロイ テストサンプル

TerraformによりGoogle CloudとのGithub ActionsとのWorkload Identity連携を行い、  
Google Cloud Runへ自動デプロイするワークフローを作りました。 

https://gcp-wordle-845651109368.asia-northeast1.run.app/

## イメージ

Workload Identity 連携（Workload Identity Federation, 通称WIF）を用いて、Github Actions内でGoogle Cloudのサービスアカウントを一時的に呼び出し、そのアカウントを使ってデプロイを実行していく流れとなります。  

<img src="https://github.com/user-attachments/assets/b291b112-d1b2-4fde-af11-459dffa79346" alt="image" width="500" />

Workload Identityを経由する方法によりサービスアカウントのキー管理が必要なくなり、かわりにGitHubとGoogle Cloudの間でOpenID Connect（OIDC）認証を使用した安全な認証を行えます。

## 記事

CLIでの実施  
https://zenn.dev/kakuhito/articles/565c5dda9082a3

Terraformによる自動化  
https://zenn.dev/kakuhito/articles/ceee59ae95c8df

## 備考
以下のプロジェクトをそのまま利用しています。  
https://github.com/Suke-H/wordle-sample

