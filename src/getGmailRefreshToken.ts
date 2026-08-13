/**
 * One-time setup script: obtains a Gmail API OAuth2 refresh token.
 *
 * Prerequisites (Google Cloud Console):
 *   1. Create/select a project, enable the "Gmail API".
 *   2. Create an OAuth client ID of type "Desktop app".
 *   3. Put its client id / secret into .env as GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET.
 *
 * Run: npm run gmail:auth
 * Then open the printed URL in a browser, sign in with the Gmail account
 * that should send the notification emails, and approve access. This
 * script runs a temporary local server to catch the OAuth redirect and
 * prints the refresh token to paste into .env as GMAIL_REFRESH_TOKEN.
 */
import http from "http";
import { URL } from "url";
import { google } from "googleapis";
import { config } from "./config";

async function main(): Promise<void> {
  if (!config.gmailClientId || !config.gmailClientSecret) {
    console.error(
      "GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET が .env に設定されていません。" +
        "先にGoogle Cloud ConsoleでOAuthクライアント(Desktop app)を作成してください。"
    );
    process.exit(1);
  }

  const redirectUrl = new URL(config.gmailRedirectUri);
  const port = redirectUrl.port ? Number(redirectUrl.port) : 80;

  const oauth2Client = new google.auth.OAuth2(
    config.gmailClientId,
    config.gmailClientSecret,
    config.gmailRedirectUri
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
  });

  console.log("以下のURLをブラウザで開き、送信元にしたいGmailアカウントで認可してください:\n");
  console.log(authUrl);
  console.log(
    `\n認可すると ${config.gmailRedirectUri} にリダイレクトされます。` +
      "このスクリプトがそれを待ち受けます...\n"
  );

  const code = await new Promise<string>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (!req.url) return;

      const url = new URL(req.url, config.gmailRedirectUri);
      const authCode = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        res.end("認可が拒否/失敗しました。ターミナルを確認してください。");
        server.close();
        reject(new Error(`OAuth error: ${error}`));
        return;
      }

      if (authCode) {
        res.end("認可が完了しました。このタブを閉じてターミナルに戻ってください。");
        server.close();
        resolve(authCode);
      }
    });

    server.listen(port, () => {
      console.log(`ローカルサーバー起動: port ${port} でリダイレクト待機中...`);
    });
  });

  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.refresh_token) {
    console.error(
      "\nrefresh_token を取得できませんでした。" +
        "Googleアカウントの「サードパーティアプリのアクセス権」で一度このアプリのアクセスを取り消してから、" +
        "再度実行してください(access_type=offline + prompt=consentでも、既に許可済みだとrefresh_tokenが省略されることがあります)。"
    );
    process.exit(1);
  }

  console.log("\n取得成功。以下を .env の GMAIL_REFRESH_TOKEN に設定してください:\n");
  console.log(tokens.refresh_token);
}

main().catch((err) => {
  console.error("認可処理に失敗しました:", err);
  process.exit(1);
});
