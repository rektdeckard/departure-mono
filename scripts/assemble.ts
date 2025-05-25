import fs from "node:fs";

type CharEntry = {
  code: number;
  feat?: string[];
};

(function main() {
  const charlist = fs.readFileSync("./scripts/charlist.txt", "utf-8");

  const charmap = charlist.split(/\n\n+/).reduce((acc, section) => {
    const [name, ...chars] = section.split(/\n/).map((line) => line.trim());
    acc[name] = chars.filter(Boolean).map(parseCharWithOptionalFeatures);
    return acc;
  }, {});

  fs.writeFileSync("src/lib/charmap.json", JSON.stringify(charmap, null, 2));
})();

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
