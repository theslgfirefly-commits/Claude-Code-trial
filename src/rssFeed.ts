import Parser from "rss-parser";
import { config } from "./config";
import { EpisodeMeta } from "./types";

const parser = new Parser({
  timeout: config.httpTimeoutMs,
  headers: { "User-Agent": config.userAgent },
});

/**
 * Fetches the podcast RSS feed and returns episodes newest-first.
 */
export async function fetchEpisodes(): Promise<EpisodeMeta[]> {
  const feed = await parser.parseURL(config.rssFeedUrl);

  const episodes: EpisodeMeta[] = (feed.items ?? []).map((item) => ({
    guid: item.guid ?? item.link ?? item.title ?? "",
    title: item.title ?? "(no title)",
    link: item.link ?? "",
    audioUrl: item.enclosure?.url ?? "",
    pubDate: item.pubDate ?? item.isoDate ?? "",
    description: item.contentSnippet ?? item.content,
  }));

  // Feeds are normally already newest-first, but sort defensively.
  episodes.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return episodes;
}

/**
 * Given all episodes (newest-first) and the last-seen guid, returns the
 * episodes that are new, oldest-first (so callers can process/notify in
 * chronological order).
 *
 * - If lastGuid is null (first run), only the single latest episode is
 *   returned so we don't flood the pipeline with the entire back catalog.
 * - If lastGuid is not found in the feed (e.g. very old / feed pruned),
 *   we conservatively treat only the latest episode as new.
 */
export function findNewEpisodes(
  episodes: EpisodeMeta[],
  lastGuid: string | null
): EpisodeMeta[] {
  if (episodes.length === 0) return [];

  if (lastGuid === null) {
    return [episodes[0]];
  }

  const lastIndex = episodes.findIndex((ep) => ep.guid === lastGuid);

  if (lastIndex === -1) {
    return [episodes[0]];
  }

  if (lastIndex === 0) {
    return [];
  }

  return episodes.slice(0, lastIndex).reverse();
}
