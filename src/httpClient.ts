import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { config } from "./config";

/**
 * A reasonably complete set of headers matching what a real Chrome browser
 * sends on a normal page navigation (not just User-Agent), since some sites'
 * bot-detection checks for the full, internally-consistent header set rather
 * than just one field.
 */
const BROWSER_HEADERS = {
  "User-Agent": config.userAgent,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-User": "?1",
  "sec-ch-ua":
    '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
};

/**
 * Fetches a URL the way a real first-time visitor's browser would: a
 * "warm-up" GET to the site's origin first (so any bot-detection cookies
 * get set), then the real request against the target URL carrying those
 * cookies plus a same-origin Referer. Never throws on 4xx/5xx — callers
 * inspect `status` themselves so they can give a specific error message.
 */
export async function fetchLikeBrowser(
  url: string
): Promise<{ status: number; data: string }> {
  const jar = new CookieJar();
  const client = wrapper(
    axios.create({
      timeout: config.httpTimeoutMs,
      headers: BROWSER_HEADERS,
      jar,
      withCredentials: true,
      validateStatus: () => true,
    })
  );

  const origin = new URL(url).origin;

  try {
    await client.get(origin, { headers: { "Sec-Fetch-Site": "none" } });
  } catch {
    // A failed warm-up isn't fatal — fall through and try the real request.
  }

  const res = await client.get<string>(url, {
    headers: { Referer: `${origin}/`, "Sec-Fetch-Site": "same-origin" },
  });

  return { status: res.status, data: res.data };
}
