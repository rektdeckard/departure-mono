import { Font } from "fonteditor-core";
import {
  fetchWithProgress,
  type FetchWithProgressOptions as Opts,
} from "./utils";

export function font(
  onProgress?: Opts<ArrayBuffer>["onProgress"],
  onDone?: Opts<ArrayBuffer>["onDone"],
) {
  return async function () {
    const buf = await fetchWithProgress("/assets/DepartureMono-Regular.otf", {
      responseType: "arraybuffer",
      onProgress,
      onDone,
    });
    return Font.create(buf, { type: "otf" });
  };
}

export function charMap() {
  return async function () {
    const json = await fetchWithProgress<Record<string, string>>(
      "/assets/cm.json",
      {
        responseType: "json",
      },
    );
    return new Map<number, string>(
      Object.entries(json).map(([k, v]) => [parseInt(k, 16), v]),
    );
  };
}
