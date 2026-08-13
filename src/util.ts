/** Filesystem/attachment-safe slug like "2026-08-13_some-episode-title". */
export function slugify(title: string, pubDate: string): string {
  const datePart = pubDate
    ? new Date(pubDate).toISOString().slice(0, 10)
    : "unknown-date";
  const titlePart = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${datePart}_${titlePart || "episode"}`;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
