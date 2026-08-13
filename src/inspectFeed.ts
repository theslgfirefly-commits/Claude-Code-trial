/**
 * Diagnostic helper: dumps the raw (unmapped) first item of the RSS feed as
 * JSON, so we can see every field the feed actually provides — useful when
 * something like the episode page URL isn't where we expect it.
 * Run: npm run inspect
 */
import Parser from "rss-parser";
import { config } from "./config";

async function main(): Promise<void> {
  const parser = new Parser({
    timeout: config.httpTimeoutMs,
    headers: { "User-Agent": config.userAgent },
  });

  const feed = await parser.parseURL(config.rssFeedUrl);
  console.log(`feed title: ${feed.title}`);
  console.log(`item count: ${feed.items?.length ?? 0}`);
  console.log("--- raw first item ---");
  console.log(JSON.stringify(feed.items?.[0], null, 2));
}

main().catch((err) => {
  console.error("inspect failed:", err);
  process.exit(1);
});
