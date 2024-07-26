import { Font } from "fonteditor-core";
import {
  fetchWithProgress,
  type FetchWithProgressOptions as Opts,
} from "./utils";

export function font(
  onProgress?: Opts<ArrayBuffer>["onProgress"],
  onDone?: Opts<ArrayBuffer>["onDone"],
) {
  return async function() {
    const buf = await fetchWithProgress("/assets/dm.otf", {
      responseType: "arraybuffer",
      onProgress,
      onDone,
    });
    return Font.create(buf, { type: "otf" });
  };
}
