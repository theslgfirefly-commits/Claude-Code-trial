import axios from "axios";
import { config } from "./config";

// DeepL request limits (kept conservative vs. the documented ~128KB / 50
// texts per request so a single call never risks a 413).
const MAX_CHUNK_CHARS = 4500;
const MAX_TEXTS_PER_REQUEST = 50;
const MAX_REQUEST_CHARS = 25000;

interface DeepLTranslateResponse {
  translations: Array<{ detected_source_language: string; text: string }>;
}

function assertDeepLConfigured(): void {
  if (!config.deeplApiKey) {
    throw new Error(
      "DEEPL_API_KEY is not set. Add it to .env (see .env.example)."
    );
  }
}

/**
 * Splits text into chunks that respect MAX_CHUNK_CHARS, breaking on
 * paragraph boundaries where possible so sentences aren't split mid-way.
 */
function splitIntoChunks(text: string): string[] {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.length > 0);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;

    if (candidate.length > MAX_CHUNK_CHARS && current) {
      chunks.push(current);
      current = paragraph;
    } else {
      current = candidate;
    }

    // A single paragraph longer than the limit still needs hard-splitting.
    while (current.length > MAX_CHUNK_CHARS) {
      chunks.push(current.slice(0, MAX_CHUNK_CHARS));
      current = current.slice(MAX_CHUNK_CHARS);
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

/** Groups chunks into request batches under the size/count limits. */
function batchChunks(chunks: string[]): string[][] {
  const batches: string[][] = [];
  let batch: string[] = [];
  let batchChars = 0;

  for (const chunk of chunks) {
    const wouldOverflow =
      batch.length >= MAX_TEXTS_PER_REQUEST ||
      batchChars + chunk.length > MAX_REQUEST_CHARS;

    if (wouldOverflow && batch.length > 0) {
      batches.push(batch);
      batch = [];
      batchChars = 0;
    }

    batch.push(chunk);
    batchChars += chunk.length;
  }

  if (batch.length > 0) batches.push(batch);
  return batches;
}

/**
 * Translates English text to Japanese via the DeepL API, chunking long
 * transcripts across multiple requests as needed. Chunk order is preserved
 * so the returned string reads the same as the source.
 */
export async function translateToJapanese(text: string): Promise<string> {
  assertDeepLConfigured();

  const chunks = splitIntoChunks(text);
  if (chunks.length === 0) return "";

  const batches = batchChunks(chunks);
  const translated: string[] = [];

  for (const batch of batches) {
    const params = new URLSearchParams();
    for (const chunk of batch) params.append("text", chunk);
    params.append("source_lang", "EN");
    params.append("target_lang", "JA");
    params.append("preserve_formatting", "1");

    const res = await axios.post<DeepLTranslateResponse>(
      config.deeplApiUrl,
      params,
      {
        timeout: config.httpTimeoutMs,
        headers: {
          Authorization: `DeepL-Auth-Key ${config.deeplApiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    translated.push(...res.data.translations.map((t) => t.text));
  }

  return translated.join("\n\n");
}
