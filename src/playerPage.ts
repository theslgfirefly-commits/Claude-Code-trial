import { EpisodeWithTranscript } from "./types";
import { escapeHtml } from "./util";

/**
 * Builds a single self-contained HTML file (no external CSS/JS/fonts) with
 * an `<audio loop>` player for one episode, meant to be emailed as an
 * attachment. Opening the attachment (e.g. from the Gmail app on iPhone)
 * renders this as a page directly — no server required, so it works
 * anywhere there's a data connection to stream the audio itself.
 */
export function buildPlayerHtml(episode: EpisodeWithTranscript): string {
  const title = escapeHtml(episode.title);
  const pubDate = episode.pubDate
    ? new Date(episode.pubDate).toLocaleString("ja-JP")
    : "";
  const audioUrl = escapeHtml(episode.audioUrl);
  const link = escapeHtml(episode.link);
  const translated = episode.translatedTranscript
    ? escapeHtml(episode.translatedTranscript).replace(/\n/g, "<br>")
    : "(翻訳なし)";

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  body {
    font-family: -apple-system, "Hiragino Sans", system-ui, sans-serif;
    margin: 0;
    padding: 1.5rem 1.25rem 3rem;
    background: #fafafa;
    color: #1a1a1a;
  }
  h1 { font-size: 1.15rem; margin: 0 0 0.25rem; }
  .date { color: #888; margin: 0 0 1rem; font-size: 0.85rem; }
  audio { width: 100%; margin: 0.75rem 0 0.6rem; }
  label { display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; color: #444; }
  a.episode-link { display: inline-block; margin-top: 0.9rem; font-size: 0.85rem; color: #0b5fff; }
  .transcript {
    margin-top: 2rem;
    line-height: 1.8;
    font-size: 0.95rem;
    border-top: 1px solid #ddd;
    padding-top: 1.25rem;
  }
  .transcript h2 { font-size: 1rem; margin: 0 0 0.75rem; }
</style>
</head>
<body>
  <h1>${title}</h1>
  <p class="date">${pubDate}</p>

  <audio id="player" controls loop src="${audioUrl}"></audio>
  <label>
    <input type="checkbox" id="loop-toggle" checked
      onchange="document.getElementById('player').loop = this.checked;">
    リピート再生 (loop)
  </label>

  <a class="episode-link" href="${link}">エピソードページを開く</a>

  <div class="transcript">
    <h2>日本語訳</h2>
    <p>${translated}</p>
  </div>
</body>
</html>
`;
}
