import fs from "fs/promises";
import { createCanvas, registerFont } from "canvas";

const FONT_FAMILY = "Departure Mono";
const FONT_SIZE = 22;

const CHARLIST_PATH = "./scripts/charlist.txt";
const CHARMAP_PATH = "./src/lib/charmap.json";

const OTF_FONT_PATH = "./public/assets/DepartureMono-Regular.otf";
const PNG_PATH_PREFIX = "./public/assets/DepartureMono-Regular";
const PNG_SPRITE_SHEET_PATH = `${PNG_PATH_PREFIX}.png`;

const DEFAULT_RENDER_OPTIONS: RenderOptions = {
  columns: 64,
  fontSize: FONT_SIZE,
};

type CharEntry = {
  code: number;
  feat?: string[];
};

type CharMap = Record<string, CharEntry[]>;

type RenderOptions = {
  columns: number;
  fontSize: number;
};

type Atlas = Map<number, Set<number>>;

(async function main() {
  const charmap = await buildCharMap(CHARLIST_PATH);
  await fs.writeFile(CHARMAP_PATH, JSON.stringify(charmap, null, 2));

  const buf = generateSpriteSheet(OTF_FONT_PATH, charmap);
  await fs.writeFile(PNG_SPRITE_SHEET_PATH, buf);

  const atlas = createAtlas(charmap);
  for (const [plane, chars] of Array.from(atlas.entries())) {
    const path = getPlanePath(plane);
    const buf = generatePlane(plane, chars);
    await fs.writeFile(path, buf);
  }
})();

function measureFont(inputPath: string, options?: RenderOptions) {
  const opts: RenderOptions = {
    ...DEFAULT_RENDER_OPTIONS,
    ...options,
  };

  registerFont(inputPath, { family: FONT_FAMILY });

  const canvas = createCanvas(1, 1);
  const ctx = canvas.getContext("2d");
  ctx.font = `${opts.fontSize}px "${FONT_FAMILY}"`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const metrics = ctx.measureText("█");
  const cellWidth = Math.ceil(metrics.width);
  const baselineOffset =
    metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
  const cellHeight = Math.ceil(
    baselineOffset +
      (metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent),
  );
  return { cellWidth, cellHeight, baselineOffset };
}

async function buildCharMap(charlistPath: string): Promise<CharMap> {
  const charlist = await fs.readFile(charlistPath, "utf-8");

  return charlist.split(/\n\n+/).reduce<CharMap>((acc, section) => {
    const [name, ...chars] = section.split(/\n/).map((line) => line.trim());
    acc[name] = chars.filter(Boolean).map(parseCharWithOptionalFeatures);
    return acc;
  }, {});
}

function parseCharWithOptionalFeatures(line: string): CharEntry {
  const parts = line.split(".");
  const code = parseInt(parts[0], 16);
  if (isNaN(code)) {
    throw new Error(`Invalid code point in entry: ${line}`);
  }

  const entry: CharEntry = { code };
  if (parts.length > 1) {
    entry.feat = parts.slice(1).map((f) => f.trim());
  }

  return entry;
}

function charCodeToPlane(code: number): number {
  return Math.floor(code / 0xffff);
}

function getPlanePath(plane: number) {
  if (plane < 0 || plane > 16 || !Number.isInteger(plane)) {
    throw new Error(`invalid plane number ${plane}`);
  }
  return `${PNG_PATH_PREFIX}-plane${plane}.png`;
}

function createAtlas(charmap: CharMap): Atlas {
  const atlas = new Map<number, Set<number>>();
  // TODO: implement seperate plane images per font feature
  const glyphs = Object.values(charmap).flat();

  for (const glyph of glyphs) {
    const plane = charCodeToPlane(glyph.code);
    if (!atlas.has(plane)) {
      atlas.set(plane, new Set<number>());
    }
    const planeMap = atlas.get(plane)!;
    planeMap.add(glyph.code);
  }

  return atlas;
}

function generatePlane(
  plane: number,
  chars: Set<number>,
  options?: RenderOptions,
): Buffer {
  // NOTE: this allows atlas lookup to be done by getting the cell from codepoint
  //       (<low-byte> * cellWidth, <high-byte> * cellHeight)
  const ROWS = 0x100;
  const COLUMNS = 0x100;

  const base = 0x10000 * plane;
  const opts = {
    ...DEFAULT_RENDER_OPTIONS,
    ...options,
  };
  registerFont(OTF_FONT_PATH, { family: FONT_FAMILY });
  const { cellWidth, cellHeight } = measureFont(OTF_FONT_PATH, opts);

  const canvas = createCanvas(COLUMNS * cellWidth, ROWS * cellHeight);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.font = `${opts.fontSize}px "${FONT_FAMILY}"`;
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";

  for (let i = 0; i <= 0xffff; i++) {
    const x = (i & 0x00ff) * cellWidth;
    const y = (((i & 0xff00) >> 8) + 1) * cellHeight;
    const code = i + base;

    if (chars.has(code)) {
      ctx.fillText(String.fromCodePoint(code), x, y);
    } else {
      // TODO: draw tofu glyph
    }
  }

  return canvas.toBuffer("image/png", { compressionLevel: 9 });
}

function generateSpriteSheet(
  inputPath: string,
  charmap: CharMap,
  options?: RenderOptions,
): Buffer {
  const opts = {
    ...DEFAULT_RENDER_OPTIONS,
    ...options,
  };
  const glyphs = Object.values(charmap).flat();
  const rows = Math.ceil(glyphs.length / opts.columns);

  registerFont(inputPath, { family: FONT_FAMILY });
  const { cellWidth, cellHeight, baselineOffset } = measureFont(
    inputPath,
    opts,
  );

  const canvas = createCanvas(opts.columns * cellWidth, rows * cellHeight);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = `${opts.fontSize}px "${FONT_FAMILY}"`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  glyphs.forEach((glyph, i) => {
    const x = (i % opts.columns) * cellWidth;
    const y = Math.floor(i / opts.columns) * cellHeight + baselineOffset;

    ctx.fillText(String.fromCodePoint(glyph.code), x, y);
  });

  return canvas.toBuffer("image/png", { compressionLevel: 9 });
}
