# WSJ Tech News Briefing 通知 & プレイヤー

WSJ Podcast「Tech News Briefing」の新着エピソードを検知し、トランスクリプトを翻訳してメール通知、
さらにリピート再生できる音声プレイヤーを提供するアプリケーション。

段階的に実装しました。現在 **Step 1〜3すべて** が完了しています。

## 技術スタック

- バックエンド: Node.js + TypeScript
- HTTPクライアント: axios
- RSS解析: rss-parser
- HTMLスクレイピング: cheerio
- 翻訳: DeepL API
- メール送信: Gmail API (googleapis, OAuth2)
- Webサーバー: Node.js標準 `http` モジュール(軽量API + 静的配信)
- フロントエンド: HTML / Vanilla JS (`<audio loop>`)

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

## Step 2: 翻訳とGmail通知

### やっていること

1. `src/translator.ts` — DeepL API (`v2/translate`) を使い、英語トランスクリプトを日本語に翻訳する。
   DeepLの1リクエストあたりの上限に収まるよう、段落単位で分割・バッチ化してから送信し、
   結果を元の順序で結合する（`DEEPL_API_KEY` が `:fx` サフィックス付きならFreeエンドポイント、
   それ以外はProエンドポイントを自動選択。`DEEPL_API_URL` で上書き可）。
2. `src/gmail.ts` — Gmail API (`users.messages.send`) を使い、翻訳結果（+原文）を指定アドレスへ送信する。
   OAuth2の `refresh_token` を使ってアクセストークンを都度取得するため、APIキーではなくOAuthクライアント
   (Desktop app) が必要。件名の日本語はRFC 2047 (`=?UTF-8?B?...?=`) でエンコードして送信する。
3. `src/getGmailRefreshToken.ts` — 初回のみ実行するセットアップ用スクリプト。ブラウザでOAuth同意画面を
   開いてもらい、ローカルにHTTPサーバーを一時起動してリダイレクトの認可コードを受け取り、
   `refresh_token` を発行・表示する。
4. `src/index.ts` の `processEpisode` に翻訳 → メール送信を追加。各ステップの結果は
   `data/transcripts/*.json` に随時追記保存され（`translatedTranscript` / `emailSentAt` など）、
   どこまで成功したかを後から確認できる。翻訳やメール送信が失敗しても、取得済みのトランスクリプトは
   保存済みなので次回以降にリトライしやすい。

### セットアップ

**DeepL API**
1. https://www.deepl.com/pro-api で無料/有料プランのAPIキーを取得。
2. `.env` の `DEEPL_API_KEY` に設定（Freeキーは末尾が `:fx`）。

**Gmail API**
1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成し、「Gmail API」を有効化。
2. 「APIとサービス」→「認証情報」で OAuthクライアントID（種類: **デスクトップアプリ**）を作成。
3. 発行された client id / secret を `.env` の `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET` に設定。
4. `GMAIL_SENDER`（送信元にするGmailアドレス）と `MAIL_TO`（送信先。カンマ区切りで複数可）を設定。
5. 以下を実行し、表示されたURLをブラウザで開いて送信元にしたいGmailアカウントで認可する。

   ```bash
   npm run gmail:auth
   ```

   認可が完了すると `refresh_token` がターミナルに表示されるので、`.env` の `GMAIL_REFRESH_TOKEN` に貼り付ける。

### 実行方法

`npm run check` / `npm run watch` を実行すると、Step 1（新着検知・トランスクリプト取得）に続けて
Step 2（翻訳・メール送信）まで自動的に走る。

### 既知の注意点

- このサンドボックス環境は `deepl.com` や `googleapis.com` を含む外部ドメインへの送信も制限されているため、
  DeepL翻訳・Gmail送信の実通信はこの環境からは検証できていません。型チェック (`npx tsc --noEmit`) は通過済みです。
  実際のAPIキー・OAuth認可情報を設定のうえ、通常のネットワーク環境で動作確認してください。
- Gmail APIの `gmail.send` スコープは送信専用（受信トレイの閲覧はできない）ため、比較的安全な権限です。
- `refresh_token` はアクセストークンを無期限に再発行できる機密情報です。`.env` は `.gitignore` 済みですが、
  取り扱いに注意してください。

### モバイル(iPhone等)でのリピート再生

`npm run serve`（Step 3）のWebプレイヤーはPC上のローカルサーバーなので、外出先のiPhoneからは
アクセスできない。サーバーを常時インターネット公開しなくても、以下の仕組みでリピート再生に対応している。

- `src/playerPage.ts` が、外部サーバー・外部JSに依存しない**単体HTMLファイル**を1エピソードごとに生成する。
  `<audio controls loop src="音声URL">` を埋め込んだだけの軽量ページで、日本語訳・エピソードページへの
  リンクも含む。
- `src/gmail.ts` は `nodemailer` の `MailComposer` でMIMEメッセージを組み立て、このHTMLを
  **メールの添付ファイル**として一緒に送信する（本文は従来どおりプレーンテキスト）。
- iPhoneのGmailアプリで届いたメールの添付ファイルをタップすると、その場でこのページが開き
  ループ再生できる。サーバーへの継続的な通信は発生しない（音声本体はWSJ側のURLに直接アクセスする）。
  添付のプレビューで音声コントロールが反応しない場合は、共有ボタンから「Safariで開く」を選ぶと確実。

## Step 3: リピート再生可能な音声プレイヤー

### やっていること

1. `src/server.ts` — フレームワークなしの軽量サーバー(Node標準の`http`のみ使用)。
   - `GET /api/episodes` — `data/transcripts/*.json`（Step 1/2で保存済みのエピソード）を読み込み、
     `audioUrl`を含むものだけを新しい順に並べてJSONで返す。
   - それ以外のパスは `public/` 配下を静的配信する。
2. `public/index.html` + `public/app.js` — Vanilla JSのシンプルなプレイヤー画面。
   - `/api/episodes` を取得してエピソードのドロップダウンを作成し、選択したエピソードの
     `audioUrl` を `<audio>` タグの `src` にセットする。
   - `<audio controls loop>` により、HTML5標準機能でのリピート自動再生に対応
     （チェックボックスでON/OFF切り替えも可能）。
   - `data/transcripts/` にまだエピソードが無い場合や、任意の音声を試したい場合のために、
     URLを直接入力して再生できる欄も用意。

### 実行方法

```bash
npm run serve
# http://localhost:3000 をブラウザで開く
```

`PORT` 環境変数でポート変更可（既定 3000）。事前に `npm run check` を1回実行し、
`data/transcripts/` にエピソードJSONを作っておくと一覧に表示される。

### 動作確認

- ダミーのエピソードJSONを `data/transcripts/` に置いてサーバーを起動し、Playwright(ヘッドレスChromium)
  でページを操作して確認済み:
  - `/api/episodes` がエピソード一覧を正しく返す。
  - ページ読み込み時に最新エピソードが自動選択され、`<audio>` の `src` に `audioUrl` が設定され、
    `loop` 属性が `true` になっていることを確認。
  - 「リピート再生」チェックボックスのON/OFFで `audio.loop` が切り替わることを確認。
  - 「音声URLを直接指定して再生」から任意のURLを読み込めることを確認。
  - スクリーンショットで見た目も確認（自動再生はブラウザのポリシーでブロックされるため、
    その場合は「再生ボタンを押してください」という案内を表示するようにしている）。
- 実際のWSJ音声URLでの再生自体は、このサンドボックスの外部ネットワーク制限により確認できていません
  （プレイヤー側のロジックはダミーURLで検証済み）。

## 今後の予定

現時点でStep 1〜3はすべて実装済み。今後の改善候補（未着手）:

- WSJページの実DOM構造に合わせた `src/scraper.ts` のセレクタ調整（実ネットワーク環境での確認が必要）。
- `npm run watch` の定期実行を systemd/cron 等の外部スケジューラで常駐化。
- プレイヤーページでの複数エピソード再生履歴・検索機能など。
