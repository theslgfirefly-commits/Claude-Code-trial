import { google } from "googleapis";
import { config } from "./config";
import { EpisodeWithTranscript } from "./types";

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

/** RFC 2047 "encoded word" so a Japanese subject line survives as an email header. */
function encodeHeaderUtf8(text: string): string {
  return `=?UTF-8?B?${Buffer.from(text, "utf-8").toString("base64")}?=`;
}

function buildRawMessage(params: {
  to: string;
  from: string;
  subject: string;
  body: string;
}): string {
  const { to, from, subject, body } = params;

  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeHeaderUtf8(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(body, "utf-8").toString("base64"),
  ].join("\r\n");

  // Gmail API expects the raw RFC 2822 message, base64url-encoded.
  return Buffer.from(message, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildEmailBody(episode: EpisodeWithTranscript): string {
  return [
    `番組: WSJ Tech News Briefing`,
    `タイトル: ${episode.title}`,
    `配信日: ${episode.pubDate}`,
    `エピソードページ: ${episode.link}`,
    `音声URL: ${episode.audioUrl}`,
    "",
    "===== 日本語訳 =====",
    episode.translatedTranscript ?? "(翻訳なし)",
    "",
    "===== 原文 (English transcript) =====",
    episode.transcript,
  ].join("\n");
}

/** Sends the translated transcript for one episode via the Gmail API. */
export async function sendTranscriptEmail(
  episode: EpisodeWithTranscript
): Promise<void> {
  assertGmailConfigured();

  const auth = getOAuth2Client();
  const gmail = google.gmail({ version: "v1", auth });

  const raw = buildRawMessage({
    to: config.mailTo,
    from: config.gmailSender,
    subject: `[WSJ Tech News Briefing] ${episode.title} (日本語訳)`,
    body: buildEmailBody(episode),
  });

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}
