import fs from "fs";
import path from "path";
import { AppState } from "./types";
import { config } from "./config";

const DEFAULT_STATE: AppState = {
  lastEpisodeGuid: null,
  lastCheckedAt: null,
};

export function loadState(): AppState {
  try {
    const raw = fs.readFileSync(config.stateFilePath, "utf-8");
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return { ...DEFAULT_STATE };
    }
    throw err;
  }
}

export function saveState(state: AppState): void {
  fs.mkdirSync(path.dirname(config.stateFilePath), { recursive: true });
  fs.writeFileSync(config.stateFilePath, JSON.stringify(state, null, 2));
}
