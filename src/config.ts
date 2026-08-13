import path from "path";
import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  rssFeedUrl: required(
    "RSS_FEED_URL",
    "https://feeds.megaphone.fm/WSJ8523681216"
  ),
  showPageUrl: required(
    "WSJ_SHOW_PAGE_URL",
    "https://www.wsj.com/podcasts/tech-news-briefing"
  ),
  stateFilePath: path.resolve(
    process.env.STATE_FILE_PATH ?? "./data/state.json"
  ),
  transcriptsDir: path.resolve(
    process.env.TRANSCRIPTS_DIR ?? "./data/transcripts"
  ),
  httpTimeoutMs: Number(process.env.HTTP_TIMEOUT_MS ?? 15000),
  userAgent:
    process.env.USER_AGENT ??
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  pollIntervalMinutes: Number(process.env.POLL_INTERVAL_MINUTES ?? 30),
};
