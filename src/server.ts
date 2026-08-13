/**
 * Minimal static file + JSON API server for the Step 3 web player.
 * No framework (Express etc.) needed for something this small — just
 * Node's built-in http module.
 */
import fs from "fs";
import http from "http";
import path from "path";
import { config } from "./config";

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const PORT = Number(process.env.PORT ?? 3000);

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

interface EpisodeSummary {
  guid: string;
  title: string;
  link: string;
  audioUrl: string;
  pubDate: string;
}

function listEpisodes(): EpisodeSummary[] {
  if (!fs.existsSync(config.transcriptsDir)) return [];

  const files = fs
    .readdirSync(config.transcriptsDir)
    .filter((f) => f.endsWith(".json"));

  const episodes: EpisodeSummary[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(
        path.join(config.transcriptsDir, file),
        "utf-8"
      );
      const data = JSON.parse(raw);
      if (data.audioUrl) {
        episodes.push({
          guid: data.guid,
          title: data.title,
          link: data.link,
          audioUrl: data.audioUrl,
          pubDate: data.pubDate,
        });
      }
    } catch {
      // Skip unreadable/partial files rather than failing the whole listing.
    }
  }

  episodes.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
  return episodes;
}

function serveStatic(reqPath: string, res: http.ServerResponse): void {
  const relativePath = reqPath === "/" ? "/index.html" : reqPath;
  const filePath = path.join(PUBLIC_DIR, relativePath);

  // Prevent path traversal outside public/.
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (url.pathname === "/api/episodes") {
    const episodes = listEpisodes();
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(episodes));
    return;
  }

  serveStatic(url.pathname, res);
});

server.listen(PORT, () => {
  console.log(`Web player running at http://localhost:${PORT}`);
});
