export interface EpisodeMeta {
  /** Stable identifier from the RSS item (guid, falls back to link). */
  guid: string;
  title: string;
  /** Episode page URL on wsj.com (used to scrape the transcript). */
  link: string;
  /** MP3/audio enclosure URL, needed later for the Step 3 player. */
  audioUrl: string;
  pubDate: string;
  description?: string;
}

export interface EpisodeWithTranscript extends EpisodeMeta {
  transcript: string;
  transcriptFetchedAt: string;
}

export interface AppState {
  lastEpisodeGuid: string | null;
  lastCheckedAt: string | null;
}
