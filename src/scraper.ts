import * as cheerio from "cheerio";
import { fetchLikeBrowser } from "./httpClient";

/**
 * CSS selectors tried (in order) to locate the transcript container on a
 * WSJ episode page. wsj.com is a JS-heavy site, so the exact DOM could not
 * be inspected from this sandbox (outbound network access to wsj.com is
 * blocked here). Once you can load a real episode page in a browser, open
 * devtools on the "Read transcript" section and add/adjust selectors here
 * as needed.
 */
const TRANSCRIPT_CONTAINER_SELECTORS = [
  '[data-testid*="transcript" i]',
  '[class*="transcript" i]',
  '[id*="transcript" i]',
  "article",
];

const TRANSCRIPT_HEADING_TEXT = /read transcript|full transcript|transcript/i;

/**
 * Fetches an episode page and extracts the transcript text.
 * Throws an Error (with an explanatory message) if the page couldn't be
 * fetched or no transcript could be located, rather than silently
 * returning an empty string.
 */
export async function fetchTranscript(episodeUrl: string): Promise<string> {
  const { status, data: html } = await fetchLikeBrowser(episodeUrl);

  if (status >= 400) {
    throw new Error(
      `Fetching ${episodeUrl} returned HTTP ${status} even with browser-like ` +
        "headers/cookies. This usually means the site's bot-detection is " +
        "blocking the request — a real (or headless) browser session may be " +
        "required instead of a plain HTTP fetch. Try `npm run inspect:page " +
        `${episodeUrl}\` to see the raw response.`
    );
  }

  const $ = cheerio.load(html);

  const fromContainer = extractFromContainerSelectors($);
  if (fromContainer) return fromContainer;

  const fromHeading = extractFromHeading($);
  if (fromHeading) return fromHeading;

  throw new Error(
    `Fetched ${episodeUrl} (HTTP ${status}) but could not locate a ` +
      "transcript in it. The page may render the transcript via " +
      "client-side JavaScript (needing a headless browser instead of a " +
      "static fetch), or use different markup than " +
      "TRANSCRIPT_CONTAINER_SELECTORS in src/scraper.ts expects. Run " +
      `\`npm run inspect:page ${episodeUrl}\` to inspect the raw HTML and ` +
      "update the selectors there."
  );
}

function extractFromContainerSelectors(
  $: cheerio.CheerioAPI
): string | null {
  for (const selector of TRANSCRIPT_CONTAINER_SELECTORS) {
    const el = $(selector).first();
    if (el.length === 0) continue;

    const text = cleanText(el.text());
    if (text.length > 200) {
      return text;
    }
  }
  return null;
}

/**
 * Fallback: find a heading/button whose visible text says "Read transcript"
 * / "Full Transcript", then collect the text of the paragraphs that follow
 * it in the DOM.
 */
function extractFromHeading($: cheerio.CheerioAPI): string | null {
  const heading = $("h1,h2,h3,h4,button,span,p")
    .filter((_, el) => TRANSCRIPT_HEADING_TEXT.test($(el).text().trim()))
    .first();

  if (heading.length === 0) return null;

  const paragraphs: string[] = [];
  let node = heading.parent().length ? heading.parent() : heading;

  node
    .nextAll("p, div")
    .each((_, el) => {
      const text = cleanText($(el).text());
      if (text) paragraphs.push(text);
    });

  const joined = cleanText(paragraphs.join("\n\n"));
  return joined.length > 200 ? joined : null;
}

function cleanText(raw: string): string {
  return raw
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
