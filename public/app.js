const select = document.getElementById("episode-select");
const player = document.getElementById("player");
const loopToggle = document.getElementById("loop-toggle");
const nowPlaying = document.getElementById("now-playing");
const episodeTitle = document.getElementById("episode-title");
const episodeDate = document.getElementById("episode-date");
const episodeLink = document.getElementById("episode-link");
const statusEl = document.getElementById("status");
const manualUrlInput = document.getElementById("manual-url");
const manualLoadButton = document.getElementById("manual-load");

let episodes = [];

function setStatus(message) {
  statusEl.textContent = message;
}

function formatDate(pubDate) {
  const d = new Date(pubDate);
  return isNaN(d.getTime()) ? pubDate : d.toLocaleString("ja-JP");
}

function playAudioUrl(url) {
  player.src = url;
  player.loop = loopToggle.checked;
  player.load();
  player.play().catch(() => {
    // Autoplay can be blocked by the browser; the user can press play manually.
    setStatus("再生ボタンを押して再生を開始してください。");
  });
}

function selectEpisode(index) {
  const episode = episodes[index];
  if (!episode) return;

  nowPlaying.hidden = false;
  episodeTitle.textContent = episode.title;
  episodeDate.textContent = formatDate(episode.pubDate);
  episodeLink.href = episode.link || "#";

  playAudioUrl(episode.audioUrl);
  setStatus("");
}

async function loadEpisodes() {
  try {
    const res = await fetch("/api/episodes");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    episodes = await res.json();

    select.innerHTML = "";

    if (episodes.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "エピソードがまだありません（Step 1/2を先に実行してください）";
      select.appendChild(opt);
      setStatus(
        "data/transcripts/ にエピソードJSONが見つかりません。npm run check を実行してください。"
      );
      return;
    }

    episodes.forEach((ep, i) => {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = `${formatDate(ep.pubDate)} - ${ep.title}`;
      select.appendChild(opt);
    });

    selectEpisode(0);
  } catch (err) {
    setStatus(`エピソード一覧の取得に失敗しました: ${err.message}`);
  }
}

select.addEventListener("change", () => selectEpisode(Number(select.value)));

loopToggle.addEventListener("change", () => {
  player.loop = loopToggle.checked;
});

manualLoadButton.addEventListener("click", () => {
  const url = manualUrlInput.value.trim();
  if (!url) return;
  nowPlaying.hidden = true;
  playAudioUrl(url);
  setStatus("");
});

loadEpisodes();
