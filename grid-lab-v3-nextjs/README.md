# GRID LAB v3 — Next.js / Vercel プレビュー版

既存のGRID LAB v3の見た目をNext.js App Routerに移植した公開プレビューです。RED/BLUEの計10ステージを切り替えて表示できます。

**重要:** この版はフロントエンドの表示確認専用です。Dockerターミナル、FLAG判定、進捗保存は動きません。FLAGやDockerへのアクセス権をフロントエンドに埋め込まないでください。

## 開発

```bash
npm install
npm run dev
```

`http://localhost:3000` を開きます。

## Vercel公開

このフォルダ内のファイルをGitHubリポジトリのルートにアップロードし、VercelでImportしてください。Framework PresetはNext.js（自動判定）。Build Command、Output Directoryはデフォルトのままにします。

## 将来の本番連携

Raspberry Piの既存Node.jsサーバーはlocalhost限定、単一の共有Dockerコンテナ、Dockerソケット権限依存、メモリ制限未適用の可能性があり、そのまま公開しないでください。認証・認可、セッションごとのコンテナ分離、制限の実効性検証、TLS/WSSとアクセス制御を実装した後でAPI連携します。
