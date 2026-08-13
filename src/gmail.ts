import MailComposer from "nodemailer/lib/mail-composer";
import { google } from "googleapis";
import { config } from "./config";
import { EpisodeWithTranscript } from "./types";
import { buildPlayerHtml } from "./playerPage";
import { slugify } from "./util";

function assertGmailConfigured(): void {
  const missing = [
    ["GMAIL_CLIENT_ID", config.gmailClientId],
    ["GMAIL_CLIENT_SECRET", config.gmailClientSecret],
    ["GMAIL_REFRESH_TOKEN", config.gmailRefreshToken],
    ["GMAIL_SENDER", config.gmailSender],
    ["MAIL_TO", config.mailTo],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Missing Gmail config: ${missing.join(", ")}. Set these in .env ` +
        "(run `npm run gmail:auth` once to obtain GMAIL_REFRESH_TOKEN)."
    );
  }
}

function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    config.gmailClientId,
    config.gmailClientSecret,
    config.gmailRedirectUri
  );
  oauth2Client.setCredentials({ refresh_token: config.gmailRefreshToken });
  return oauth2Client;
}

function buildEmailBody(episode: EpisodeWithTranscript): string {
  return [
    `番組: WSJ Tech News Briefing`,
    `タイトル: ${episode.title}`,
    `配信日: ${episode.pubDate}`,
    `エピソードページ: ${episode.link}`,
    "",
    "▼ リピート再生するには添付のHTMLファイルを開いてください",
    "  (スマホの場合、開いた後に共有→「Safariで開く」を選ぶと確実です)",
    "",
    `音声URL(直接再生する場合): ${episode.audioUrl}`,
    "",
    "===== 日本語訳 =====",
    episode.translatedTranscript ?? "(翻訳なし)",
    "",
    "===== 原文 (English transcript) =====",
    episode.transcript,
  ].join("\n");
}

/**
 * Builds the raw base64url RFC 2822 message the Gmail API expects, via
 * nodemailer's MailComposer (handles MIME multipart/attachments/header
 * encoding for us instead of hand-rolling it).
 */
function buildRawMessage(params: {
  to: string;
  from: string;
  subject: string;
  text: string;
  attachments: { filename: string; content: string; contentType: string }[];
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const mail = new MailComposer(params);
    mail.compile().build((err, message) => {
      if (err) {
        reject(err);
        return;
      }
      const raw = message
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      resolve(raw);
    });
  });
}

/**
 * Sends the translated transcript for one episode via the Gmail API, with a
 * self-contained `<audio loop>` player page attached so repeat playback
 * works without needing to reach any server (e.g. from a phone on the go).
 */
export async function sendTranscriptEmail(
  episode: EpisodeWithTranscript
): Promise<void> {
  assertGmailConfigured();

  const auth = getOAuth2Client();
  const gmail = google.gmail({ version: "v1", auth });

  const raw = await buildRawMessage({
    to: config.mailTo,
    from: config.gmailSender,
    subject: `[WSJ Tech News Briefing] ${episode.title} (日本語訳)`,
    text: buildEmailBody(episode),
    attachments: [
      {
        filename: `${slugify(episode.title, episode.pubDate)}-player.html`,
        content: buildPlayerHtml(episode),
        contentType: "text/html; charset=utf-8",
      },
    ],
  });

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}
