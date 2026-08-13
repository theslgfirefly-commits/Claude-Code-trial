import fs from "fs";
import path from "path";
import { config } from "./config";
import { loadState, saveState } from "./state";
import { fetchEpisodes, findNewEpisodes } from "./rssFeed";
import { fetchTranscript } from "./scraper";
import { EpisodeMeta, EpisodeWithTranscript } from "./types";

function slugify(title: string, pubDate: string): string {
  const datePart = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : "unknown-date";
  const titlePart = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${datePart}_${titlePart || "episode"}`;
}

function saveTranscript(episode: EpisodeWithTranscript): string {
  fs.mkdirSync(config.transcriptsDir, { recursive: true });
  const filePath = path.join(
    config.transcriptsDir,
    `${slugify(episode.title, episode.pubDate)}.json`
  );
  fs.writeFileSync(filePath, JSON.stringify(episode, null, 2), "utf-8");
  return filePath;
}

async function processEpisode(episode: EpisodeMeta): Promise<void> {
  console.log(`[new episode] ${episode.title} (${episode.pubDate})`);
  console.log(`  page: ${episode.link}`);
  console.log(`  audio: ${episode.audioUrl}`);

  try {
    const transcript = await fetchTranscript(episode.link);
    const withTranscript: EpisodeWithTranscript = {
      ...episode,
      transcript,
      transcriptFetchedAt: new Date().toISOString(),
    };
    const filePath = saveTranscript(withTranscript);
    console.log(
      `  transcript saved (${transcript.length} chars) -> ${filePath}`
    );
  } catch (err) {
    console.error(
      `  failed to fetch transcript: ${(err as Error).message}`
    );
  }
}

export async function checkOnce(): Promise<void> {
  console.log(`[${new Date().toISOString()}] checking feed: ${config.rssFeedUrl}`);

  const episodes = await fetchEpisodes();
  console.log(`  fetched ${episodes.length} episode(s) from feed`);

  const state = loadState();
  const newEpisodes = findNewEpisodes(episodes, state.lastEpisodeGuid);

  if (newEpisodes.length === 0) {
    console.log("  no new episodes");
  } else {
    console.log(`  ${newEpisodes.length} new episode(s) found`);
    for (const episode of newEpisodes) {
      await processEpisode(episode);
      // Persist progress after each episode so a crash mid-batch doesn't
      // re-process already-handled episodes on the next run.
      saveState({
        lastEpisodeGuid: episode.guid,
        lastCheckedAt: new Date().toISOString(),
      });
    }
  }

  saveState({
    lastEpisodeGuid: episodes[0]?.guid ?? state.lastEpisodeGuid,
    lastCheckedAt: new Date().toISOString(),
  });
}

async function main(): Promise<void> {
  const watch = process.argv.includes("--watch");

  await checkOnce().catch((err) => {
    console.error("check failed:", err);
  });

  if (watch) {
    const intervalMs = config.pollIntervalMinutes * 60 * 1000;
    console.log(
      `watching for new episodes every ${config.pollIntervalMinutes} minute(s)...`
    );
    setInterval(() => {
      checkOnce().catch((err) => {
        console.error("check failed:", err);
      });
    }, intervalMs);
  }
}

if (require.main === module) {
  main();
}
