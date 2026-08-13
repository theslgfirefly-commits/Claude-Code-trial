# WSJ Tech News Briefing 通知 & プレイヤー

WSJ Podcast「Tech News Briefing」の新着エピソードを検知し、トランスクリプトを翻訳してメール通知、
さらにリピート再生できる音声プレイヤーを提供するアプリケーション。

段階的に実装します。現在完了しているのは **Step 1** です。

## 技術スタック

- バックエンド: Node.js + TypeScript
- HTTPクライアント: axios
- RSS解析: rss-parser
- HTMLスクレイピング: cheerio
- フロントエンド (Step 3で追加予定): HTML / Vanilla JS

## セットアップ

```bash
npm install
cp .env.example .env
# 必要に応じて .env を編集（下記「既知の注意点」を参照）
```

## Step 1: 新着エピソードの検知とスクリプト取得

### やっていること

1. `src/rssFeed.ts` — WSJ Tech News Briefing の RSS フィードを取得・パースし、
   エピソード一覧（タイトル、エピソードページURL、音声URL、公開日、guid）を正規化して返す。
2. `src/state.ts` — 前回チェック時点の最新エピソード guid を `data/state.json` に保存し、
   次回実行時に新着判定できるようにする（初回実行時は最新1件のみを「新着」として扱い、
   バックカタログを一気に処理しないようにしている）。
3. `src/scraper.ts` — 新着エピソードのページを取得し、「Read transcript」に相当する
   トランスクリプト本文をHTMLから抽出する。
4. `src/index.ts` — 上記を組み合わせたエントリーポイント。新着エピソードごとに
   トランスクリプトを取得し `data/transcripts/*.json` に保存する。

### 実行方法

```bash
npm run check   # 1回だけチェックして終了
npm run watch   # .env の POLL_INTERVAL_MINUTES 間隔で継続的にチェック
npm run dev      # ソース変更を監視しつつ1回チェック（開発用）
```

### 既知の注意点（重要）

- **RSSフィードURL**: `.env.example` の `RSS_FEED_URL` はWeb検索で発見した
  `https://feeds.megaphone.fm/WSJ8523681216` を既定値にしていますが、この開発サンドボックスは
  外部ネットワークへの送信が制限されており、`wsj.com` や `feeds.megaphone.fm` へのリクエストが
  プロキシ側で `403` になるため、このURLが実際に有効かをこの環境からは確認できていません。
  通常のインターネットアクセスがある環境で一度動作確認し、もし無効であればポッドキャストアプリの
  「RSSリンクをコピー」機能等で正しいURLを取得して `.env` を更新してください。
- **トランスクリプトのDOM構造**: wsj.comはJSレンダリング主体かつ購読者限定コンテンツを含むサイトのため、
  「Read transcript」を展開した際の実際のHTML構造も同様にこの環境からは検証できていません。
  `src/scraper.ts` の `TRANSCRIPT_CONTAINER_SELECTORS` に複数のセレクタ候補を用意し、
  見つからない場合は分かりやすいエラーメッセージを出すようにしています。実際のページをブラウザで
  開いて構造を確認し、必要に応じてセレクタを調整してください。
- もしトランスクリプトが完全にクライアントサイドJSで描画される、またはログイン（WSJ購読）が
  必要な場合は、axios + cheerio による静的HTML取得では対応できません。その場合は Playwright 等の
  ヘッドレスブラウザへの切り替えが次善策になります。

### 動作確認

- `npx tsc --noEmit` で型チェック済み。
- `npm run check` を実行し、RSS取得 → エラーハンドリング → `data/state.json` 未作成時のデフォルト動作までは
  ロジックとして確認済み（実際のネットワーク到達性はこのサンドボックスでは検証不可、上記参照）。

## 今後の予定

- **Step 2**: 取得したトランスクリプトをDeepL API（またはOpenAI API）で日本語に翻訳し、
  Gmail API / Nodemailer で指定アドレスへメール送信。
- **Step 3**: `audioUrl` を使い、`<audio loop>` によるリピート再生Webページ（`public/`配下）を作成。
