import axios from "axios";
import { config } from "./config";

// Gemini handles far more context per request than DeepL's free-tier text
// limits did, but transcripts are still chunked defensively so one huge
// request can't blow past the model's output limit or a single timeout.
const MAX_CHUNK_CHARS = 12000;

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
}

function assertGeminiConfigured(): void {
  if (!config.geminiApiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to .env (see .env.example) — " +
        "get a free key at https://aistudio.google.com/apikey (no billing/address required)."
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

function buildPrompt(text: string): string {
  return (
    "You are a professional English-to-Japanese translator. Translate the " +
    "following podcast transcript excerpt into natural, fluent Japanese. " +
    "Preserve the original meaning and paragraph breaks. Output ONLY the " +
    "Japanese translation — no preface, no notes, no quotation marks " +
    "around it.\n\n---\n\n" +
    text
  );
}

async function translateChunk(text: string): Promise<string> {
  const url = `${config.geminiApiUrl}/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;

  const res = await axios.post<GeminiGenerateContentResponse>(
    url,
    {
      contents: [{ parts: [{ text: buildPrompt(text) }] }],
      generationConfig: { temperature: 0.2 },
    },
    {
      timeout: config.httpTimeoutMs,
      headers: { "Content-Type": "application/json" },
    }
  );

  const candidate = res.data.candidates?.[0];
  const translated = candidate?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();

  if (!translated) {
    throw new Error(
      `Gemini returned no translation (finishReason: ${
        candidate?.finishReason ?? "unknown"
      })`
    );
  }

  return translated;
}

/**
 * Translates English text to Japanese via the Gemini API, chunking long
 * transcripts across multiple requests as needed. Chunk order is preserved
 * so the returned string reads the same as the source.
 */
export async function translateToJapanese(text: string): Promise<string> {
  assertGeminiConfigured();

  const chunks = splitIntoChunks(text);
  if (chunks.length === 0) return "";

  const translated: string[] = [];
  for (const chunk of chunks) {
    translated.push(await translateChunk(chunk));
  }

  return translated.join("\n\n");
}
