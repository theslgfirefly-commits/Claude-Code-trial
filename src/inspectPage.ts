/**
 * Diagnostic helper: fetches a URL with the same browser-like headers/cookie
 * handling as scraper.ts, and prints the HTTP status plus a preview of the
 * response body. Useful for checking whether a fetch is being blocked
 * (bot-detection, login wall, etc.) without running the full pipeline.
 * Run: npm run inspect:page [url]   (defaults to the show page URL)
 */
import { fetchLikeBrowser } from "./httpClient";
import { config } from "./config";

async function main(): Promise<void> {
  const url = process.argv[2] ?? config.showPageUrl;
  console.log(`fetching: ${url}`);

  const { status, data } = await fetchLikeBrowser(url);

  console.log(`status: ${status}`);
  console.log(`body length: ${data.length} chars`);
  console.log(
    `contains "transcript" (case-insensitive): ${/transcript/i.test(data)}`
  );
  console.log("--- first 1500 chars of body ---");
  console.log(data.slice(0, 1500));
}

main().catch((err) => {
  console.error("inspect:page failed:", err);
  process.exit(1);
});
