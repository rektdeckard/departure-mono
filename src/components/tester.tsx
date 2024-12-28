import {
  createResource,
  createSignal,
  createMemo,
  For,
  createEffect,
} from "solid-js";
import { TTF } from "fonteditor-core";
import { cva, VariantProps } from "cva";
import { Range } from "kdim";

import { font, charMap } from "../font";
import "./tester.css";

type GlyphEntry = {
  code: number;
  glyf: TTF.Glyph;
};

enum Segment {
  BASIC_LATIN = "BASIC LATIN",
  EXTENDED_LATIN = "EXTENDED LATIN",
  CYRILLIC = "CYRILLIC",
  GREEK_AND_COPTIC = "BASIC GREEK",
  PUNCTUATION = "PUNCTUATION",
  DIGITS = "DIGITS",
  NUMERALS = "NUMERALS, MATH, CURRENCY",
  GRAPHICAL = "GRAPHICAL",
}

const fontStyle = cva([], {
  variants: {
    feature: {
      "small-caps": ["small-caps"],
      "oldstyle-nums": ["old-numbers"],
    },
  },
});

type Feature = VariantProps<typeof fontStyle>["feature"];

const CHARS: Record<Segment, number[]> = {
  [Segment.BASIC_LATIN]: [
    ...Range.of({ from: 0x41, to: 0x5a }),
    ...Range.of({ from: 0x61, to: 0x7a }),
  ],
  [Segment.EXTENDED_LATIN]: [
    // Uppercase Accents
    0x00c1, 0x0102, 0x01cd, 0x00c2, 0x00c4, 0x1ea0, 0x00c0, 0x0100, 0x0104,
    0x00c5, 0x01fa, 0x00c3, 0x00c6, 0x01fc, 0x1e02, 0x0181, 0x0106, 0x010c,
    0x00c7, 0x0108, 0x010a, 0x010e, 0x1e10, 0x0110, 0x1e0a, 0x1e0c, 0x018a,
    0x0189, 0x00d0, 0x00c9, 0x0114, 0x011a, 0x00ca, 0x00cb, 0x0116, 0x1eb8,
    0x00c8, 0x0112, 0x0118, 0x0190, 0x1ebc, 0x018e, 0x018f, 0x1e1e, 0x0191,
    0x011e, 0x01e6, 0x011c, 0x0122, 0x0120, 0x0193, 0x1e20, 0x0126, 0x1e2a,
    0x021e, 0x0124, 0x1e24, 0x0132, 0x00cd, 0x012c, 0x01cf, 0x00ce, 0x00cf,
    0x0130, 0x1eca, 0x00cc, 0x012a, 0x012e, 0x0197, 0x0128, 0x0134, 0x0136,
    0x1e32, 0x0198, 0x0139, 0x013d, 0x013b, 0x013f, 0x1e36, 0x0141, 0x1e3e,
    0x1e40, 0x0143, 0x0147, 0x0145, 0x1e44, 0x01f8, 0x019d, 0x00d1, 0x014a,
    0x00d3, 0x014e, 0x01d1, 0x00d4, 0x00d6, 0x1ecc, 0x00d2, 0x0150, 0x014c,
    0x01ea, 0x0186, 0x00d8, 0x01fe, 0x00d5, 0x0152, 0x1e56, 0x00de, 0x0154,
    0x0158, 0x0156, 0x1e5a, 0x015a, 0x0160, 0x015e, 0x015c, 0x0218, 0x1e60,
    0x1e62, 0x1e9e, 0x0166, 0x0164, 0x0162, 0x021a, 0x1e6a, 0x1e6c, 0x00da,
    0x0244, 0x016c, 0x01d3, 0x00db, 0x00dc, 0x1ee4, 0x00d9, 0x01af, 0x0170,
    0x016a, 0x0172, 0x016e, 0x0168, 0x0194, 0x01b2, 0x1e7c, 0x1e82, 0x0174,
    0x1e84, 0x1e80, 0x00dd, 0x0176, 0x0178, 0x1e8e, 0x1ef2, 0x01b3, 0x0232,
    0x1ef8, 0x0179, 0x017d, 0x017b, 0x1e92,
    // Lowercase Accents
    0x00e1, 0x0103, 0x01ce, 0x00e2, 0x00e4, 0x1ea1, 0x00e0, 0x0101, 0x0105,
    0x00e5, 0x01fb, 0x00e3, 0x00e6, 0x01fd, 0x1e03, 0x0253, 0x0107, 0x010d,
    0x00e7, 0x0109, 0x010b, 0x010f, 0x1e11, 0x0111, 0x1e0b, 0x1e0d, 0x0257,
    0x0256, 0x00f0, 0x00e9, 0x0115, 0x011b, 0x00ea, 0x00eb, 0x0117, 0x1eb9,
    0x00e8, 0x0113, 0x0119, 0x025b, 0x1ebd, 0x01dd, 0x0259, 0x1e1f, 0x0263,
    0x011f, 0x01e7, 0x011d, 0x0123, 0x0121, 0x0260, 0x0294, 0x1e21, 0x0127,
    0x1e2b, 0x021f, 0x0125, 0x1e25, 0x0131, 0x00ed, 0x012d, 0x01d0, 0x00ee,
    0x00ef, 0x1ecb, 0x00ec, 0x012b, 0x012f, 0x0268, 0x0129, 0x0133, 0x0237,
    0x0135, 0x0137, 0x1e33, 0x0138, 0x0199, 0x013a, 0x013e, 0x013c, 0x0140,
    0x1e37, 0x1e9b, 0x0142, 0x1e3f, 0x1e41, 0x0144, 0x0149, 0x0148, 0x0146,
    0x1e45, 0x01f9, 0x0272, 0x00f1, 0x014b, 0x00f3, 0x014f, 0x01d2, 0x00f4,
    0x00f6, 0x1ecd, 0x00f2, 0x0151, 0x014d, 0x01eb, 0x0254, 0x00f8, 0x01ff,
    0x00f5, 0x0153, 0x1e57, 0x00fe, 0x0155, 0x0159, 0x0157, 0x1e5b, 0x027c,
    0x015b, 0x0161, 0x015f, 0x015d, 0x0219, 0x1e61, 0x1e63, 0x00df, 0x017f,
    0x0167, 0x0165, 0x0163, 0x021b, 0x1e6b, 0x1e6d, 0x00fa, 0x0289, 0x016d,
    0x01d4, 0x00fb, 0x00fc, 0x1ee5, 0x00f9, 0x01b0, 0x0171, 0x016b, 0x0173,
    0x016f, 0x0169, 0x028b, 0x1e7d, 0x1e83, 0x0175, 0x1e85, 0x1e81, 0x00fd,
    0x0177, 0x00ff, 0x1e8f, 0x1ef3, 0x01b4, 0x0233, 0x1ef9, 0x017a, 0x017e,
    0x017c, 0x1e93,
  ],
  [Segment.CYRILLIC]: [
    // Uppercase
    ...Range.of({ from: 0x0410, to: 0x0413 }),
    0x0403, 0x0490, 0x04f6, 0x0492, 0x0494, 0x0414, 0x0415, 0x0400, 0x0401,
    ...Range.of({ from: 0x0416, to: 0x0419 }),
    0x040d, 0x048a, 0x041a, 0x040c, ...Range.of({ from: 0x041b, to: 0x0423 }),
    0x040e, ...Range.of({ from: 0x0424, to: 0x0429 }),
    0x040f, 0x042c, 0x042b, 0x042a, 0x0409, 0x040a, 0x0405, 0x0404, 0x042d,
    0x0406, 0x0407, 0x0408, 0x040b, 0x042e, 0x042f, 0x0402, 0x0462, 0x0474,
    0x0496, 0x0498, 0x049a, 0x049e, 0x04a0, 0x04a2, 0x04a4, 0x04a6, 0x0524,
    0x04a8, 0x04aa, 0x04ac, 0x04ae, 0x04b0, 0x04b2, 0x04b4, 0x04b6, 0x04ba,
    0x0526, 0x04bc, 0x04be, 0x04c0, 0x04c1, 0x04c3, 0x04c5, 0x04c7, 0x04c9,
    0x04cb, 0x04cd, 0x04d0, 0x04d2, 0x04d4, 0x04d6, 0x04dc, 0x04de, 0x04e0,
    0x04e2, 0x04e4, 0x04e6, 0x04e8, 0x04ea, 0x04ec, 0x04ee, 0x04f0, 0x04f2,
    0x04f4, 0x04f8, 0x04fc, 0x0510, 0x0512, 0x051c, 0x048c, 0x048e,
    // Lowercase
    ...Range.of({ from: 0x0430, to: 0x0433 }), 0x0453, 0x0491, 0x04f7, 0x0493,
    0x0495, 0x0434, 0x0435, 0x0450, 0x0451, ...Range.of({ from: 0x0436, to: 0x0439 }),
    0x045d, 0x048b, 0x043a, 0x045c, ...Range.of({ from: 0x043b, to: 0x0443 }),
    0x045e, ...Range.of({ from: 0x0444, to: 0x0449 }), 0x045f, 0x044c, 0x044b,
    0x044a, 0x0459, 0x045a, 0x0455, 0x0454, 0x044d, 0x0456, 0x0457, 0x0458,
    0x045b, 0x044e, 0x044f, 0x0452, 0x0463, 0x0475, 0x0497, 0x0499, 0x049b, 0x049f,
    0x04a1, 0x04a3, 0x04a5, 0x04a7, 0x0525, 0x04a9, 0x04ab, 0x04ad, 0x04af,
    0x04b1, 0x04b3, 0x04b5, 0x04b7, 0x04bb, 0x0527, 0x04bd, 0x04bf, 0x04cf,
    0x04c2, 0x04c4, 0x04c6, 0x04c8, 0x04ca, 0x04cc, 0x04ce, 0x04d1, 0x04d3,
    0x04d5, 0x04d7, 0x04dd, 0x04df, 0x04e1, 0x04e3, 0x04e5, 0x04e7, 0x04e9,
    0x04eb, 0x04ed, 0x04ef, 0x04f1, 0x04f3, 0x04f5, 0x04f9, 0x04fd, 0x0511,
    0x0513, 0x051d, 0x048d, 0x048f,
  ],
  [Segment.GREEK_AND_COPTIC]: [
    // Uppercase alpha-omega
    ...Range.of({ from: 0x0391, to: 0x03a1 }),
    ...Range.of({ from: 0x03a3, to: 0x03a9 }),
    0x0386, 0x0388, 0x0389, 0x038a, 0x038c, 0x038e, 0x038f, 0x03aa, 0x03ab,
    // Lowercase alpha-omega
    ...Range.of({ from: 0x03b1, to: 0x03c9 }),
    0x03af, 0x03ca, 0x0390, 0x03cd, 0x03cb, 0x03b0, 0x03cc, 0x03ce, 0x03ac,
    0x03ad, 0x03ae,
  ],
  [Segment.PUNCTUATION]: [
    0x0040, 0x0026, 0x002e, 0x002c, 0x003a, 0x003b, 0x2026, 0x0021, 0x00a1,
    0x003f, 0x00bf, 0x00b7, 0x2022, 0x002a, 0x204a, 0x2027, 0x0023, 0x002f,
    0x005c, 0x002d, 0x2013, 0x2014, 0x2e17, 0x005f, 0x0028, 0x0029, 0x007b,
    0x007d, 0x005b, 0x005d, 0x201a, 0x201e, 0x201c, 0x201d, 0x2018, 0x2019,
    0x00ab, 0x00bb, 0x2039, 0x203a, 0x0022, 0x0027, 0x27e8, 0x27e9, 0x00aa,
    0x00ba, 0x01c2, 0x01c0, 0x01c1, 0x01c3, 0x00b6, 0x00a7, 0x00a9, 0x00ae,
    0x2122, 0x00b0, 0x2032, 0x2033, 0x007c, 0x00a6, 0x2020, 0x2021, 0x2325,
    0x2318, 0x2116,
  ],
  [Segment.DIGITS]: Range.of({ from: 0x30, to: 0x39 }),
  [Segment.NUMERALS]: [
    // Superscript
    0x2070,
    0x00b9,
    0x00b2,
    0x00b3,
    ...Range.of({ from: 0x2074, to: 0x2079 }),
    // Subscript
    ...Range.of({ from: 0x2080, to: 0x2089 }),
    // Currencies
    0x0192,
    0x0e3f,
    0x20bf,
    0x00a2,
    0x00a4,
    0x0024,
    0x20ac,
    0x20a3,
    0x20b4,
    0x20ba,
    0x20bd,
    0x20b9,
    0x20aa,
    0x00a3,
    0x20b8,
    0x20ae,
    0x20a9,
    0x00a5,
    // Math
    0x002b,
    0x2212,
    0x00d7,
    0x00f7,
    0x003d,
    0x2260,
    0x003e,
    0x003c,
    0x2265,
    0x2264,
    0x00b1,
    0x2248,
    0x007e,
    0x00ac,
    0x005e,
    0x221e,
    0x222b,
    0x2126,
    0x2206,
    0x220f,
    0x2211,
    0x221a,
    0x2202,
    0x00b5,
    0x0025,
    0x2030,
    0x2052,
    0x2219,
    // Fractions
    0x2044, 0x00bd, 0x00bc, 0x00be, 0x215b, 0x215c, 0x215d, 0x215e,
    0x2189, 0x2153, 0x2154, 0x2155, 0x2156, 0x2157, 0x2158, 0x2159,
    0x215A, 0x2150, 0x2151,
    // Units
    0x2113,
    0x212e,
  ],
  [Segment.GRAPHICAL]: [
    // Arrows
    0x2191,
    0x2197,
    0x2192,
    0x2198,
    0x2193,
    0x2199,
    0x2190,
    0x2196,
    0x2195,
    ...Range.of({ from: 0x21b0, to: 0x21b5 }),
    0x25b2,
    0x25bc,
    0x25ba,
    0x25c4,
    0x25b3,
    0x25bd,
    0x25b7,
    0x25c1,
    // Lozenge
    0x25ca,
    // Music and suits
    0x2669,
    ...Range.of({ from: 0x266a, to: 0x266c }),
    0x2660,
    0x2663,
    0x2665,
    0x2666,
    // Stars
    0x2605,
    0x2606,
    0x2726,
    0x2727,
    // Shading
    0x2584,
    0x2588,
    0x2580,
    ...Range.of({ from: 0x2591, to: 0x2593 }),
    // Box drawing
    0x252c,
    0x2510,
    0x250c,
    0x2500,
    0x2534,
    0x2518,
    0x2514,
    0x2502,
    0x253c,
    0x2524,
    0x251c,
    0x2566,
    0x2557,
    0x2554,
    0x2550,
    0x2569,
    0x255d,
    0x255a,
    0x2551,
    0x256c,
    0x2563,
    0x2560,
  ],
} as const;

export function Tester() {
  const [fk] = createResource(font());
  const [cm] = createResource(charMap());
  const gs = createMemo<Record<string, GlyphEntry[]>>(() => {
    const f = fk()?.get();
    if (!f) return {};
    return Object.entries(CHARS).reduce<Record<string, GlyphEntry[]>>(
      (acc, [segment, codepoints]) => {
        const entries = codepoints
          .map((cp) => ({ code: cp, glyf: f.glyf[f.cmap[cp.toString()]] }))
          .filter((g) => {
            if (import.meta.env.DEV && !g.glyf) {
              console.warn(
                `Missing glyph for 0x${g.code.toString(16).padStart(4, "0")}`,
              );
            }
            return !!g.glyf;
          });
        acc[segment] = entries;
        return acc;
      },
      {},
    );
  });

  const basicLatin = () => gs()[Segment.BASIC_LATIN];
  const lower = () =>
    gs()[Segment.BASIC_LATIN]?.filter(
      (glyf) => glyf.code >= 0x61 && glyf.code <= 0x7a,
    );
  const extendedLatin = () => gs()[Segment.EXTENDED_LATIN];
  const cyrillic = () => gs()[Segment.CYRILLIC];
  const greek = () => gs()[Segment.GREEK_AND_COPTIC];
  const punctuation = () => gs()[Segment.PUNCTUATION];
  const digits = () => gs()[Segment.DIGITS];
  const numerals = () => gs()[Segment.NUMERALS];
  const graphical = () => gs()[Segment.GRAPHICAL];

  const [feature, setFeature] = createSignal<Feature>(null);
  const [glyf, setGlyf] = createSignal<TTF.Glyph | null>(null);
  createEffect(() => {
    if (fk.state === "ready") {
      const amp = fk().find({ unicode: [0x51] })[0];
      setGlyf(amp);
    }
  });

  function selectGlyph(g: TTF.Glyph, variant: Feature = null) {
    setGlyf(g);
    setFeature(variant);
    window.gtag("event", "specimen_select_glyph", {
      name: cm()?.get(g.unicode[0]) ?? g.name,
      unicode: g.unicode[0],
      variant,
    });
  }

  return (
    <div id="tester" class="maxwidth">
      <pre id="apollo1" class="diagram hidden-small">
        {apollo}
      </pre>
      <div class="split">
        <img
          width="100%"
          id="glyph-specimen-static"
          src="/assets/glyph-specimen-static.svg"
        />
        <div id="glyph-specimen">
          <div class="specimen-details">
            <div style="display: flex; flex-direction: column;">
              <span class="specimen-name">
                {cm()?.get(glyf()?.unicode[0]!)}
              </span>
              <span>{feature()?.toUpperCase()}</span>
            </div>
            <span>
              U+
              {glyf()?.unicode[0].toString(16).padStart(4, "0").toUpperCase() ??
                "0000"}
            </span>
          </div>
          <div class="anatomy">
            <span>
              ASCENDER / <br />
              CAP HEIGHT
            </span>
            <span>400</span>
          </div>
          <div class="anatomy">
            <span>X-HEIGHT</span>
            <span>300</span>
          </div>
          <div class="anatomy">
            <span>BASELINE</span>
            <span>0</span>
          </div>
          <div class="anatomy">
            <span>DESCENDER</span>
            <span>-100</span>
          </div>
          <span id="big" class={fontStyle({ feature: feature() })}>
            {String.fromCharCode(glyf()?.unicode[0] ?? 0)}
          </span>
        </div>
        <div id="glyph-list">
          <div class="segment-header">{Segment.BASIC_LATIN}</div>
          <For each={basicLatin()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf() && !feature()}
                onClick={() => selectGlyph(ge.glyf)}
              />
            )}
          </For>
          <For each={lower()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                className="small-caps"
                selected={ge.glyf === glyf() && feature() === "small-caps"}
                onClick={() => selectGlyph(ge.glyf, "small-caps")}
              />
            )}
          </For>
          <div class="segment-header">{Segment.EXTENDED_LATIN}</div>
          <For each={extendedLatin()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf()}
                onClick={() => selectGlyph(ge.glyf)}
              />
            )}
          </For>
          <div class="segment-header">{Segment.CYRILLIC}</div>
          <For each={cyrillic()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf() && !feature()}
                onClick={() => selectGlyph(ge.glyf)}
              />
            )}
          </For>
          <div class="segment-header">{Segment.GREEK_AND_COPTIC}</div>
          <For each={greek()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf()}
                onClick={() => selectGlyph(ge.glyf)}
              />
            )}
          </For>
          <div class="segment-header">{Segment.PUNCTUATION}</div>
          <For each={punctuation()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf()}
                onClick={() => selectGlyph(ge.glyf)}
              />
            )}
          </For>
          <div class="segment-header">{Segment.NUMERALS}</div>
          <For each={digits()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf() && !feature()}
                onClick={() => selectGlyph(ge.glyf)}
              />
            )}
          </For>
          <For each={digits()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                className="old-numbers"
                selected={ge.glyf === glyf() && feature() === "oldstyle-nums"}
                onClick={() => selectGlyph(ge.glyf, "oldstyle-nums")}
              />
            )}
          </For>
          <For each={numerals()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf()}
                onClick={() => selectGlyph(ge.glyf)}
              />
            )}
          </For>
          <div class="segment-header">{Segment.GRAPHICAL}</div>
          <For each={graphical()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf()}
                onClick={() => selectGlyph(ge.glyf)}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

type GlyphItemProps = GlyphEntry & {
  selected: boolean;
  className?: string;
  onClick: (e: Event) => void;
};

function GlyphItem(props: GlyphItemProps) {
  const content = () => String.fromCharCode(props.code);

  return (
    <div
      class={`glyph-item ${props.className ?? ""}`}
      title={`U+${props.glyf.unicode[0].toString(16).padStart(4, "0").toUpperCase()}`}
      tabindex={0}
      data-selected={props.selected}
      onClick={props.onClick}
      onKeyPress={(e) => e.key === "Enter" && props.onClick(e)}
    >
      <span class="glyph-example">{content()}</span>
    </div>
  );
}

export const apollo = `\
   ┌──────────────────┐            ┌──────────────────┐         ┌──────────────────┐                                 
   │      CLOCK       │            │     COUNTER &    │         │         S        │                                 
   ├──────────────────┤     ┌─────►│     INTERRUPT    ├────────►│        ───       │                                 
   │                  │     │      │     PRIORITY     │         │      MEMORY      │                                 
   │  OSCILLATOR AND  │     │  ┌───┤     CIRCUITS     │         │      ADDRESS     │             ───────────────┐    
   │  TIMING PULSES   │     │  │   └──────────────────┘    ┌───►│     REGISTER     │            /              /│    
   │                  │     │  │                           │    ├──────────────────┼──────┐    /              / │◄──┐
   └────────┬─────────┘     │  │                           │    │      MEMORY      │      │   ┌──────────────┐  │   │
            │               │  │   ┌──────────────────┐    │◄──►│       BANK       │      ├──►│     FIXED    │  /   │
            ├────────────┐  │  │   │    ADDRESSABLE   │    │    │     REGISTERS    │      │   │    MEMORY    │ /    │
            │            │  │  │   │      CENTRAL     │    │    └──────────────────┘   ┌──┼───┤++++++++++++++│/     │
            ▼            │  │  │   │     REGISTERS    │◄──►│                           │  │   └──────────────┘      │
   ┌──────────────────┐  │  │  │   │                  │    │                           │  │                         │
   │     SEQUENCE     │  │  │  │   │       A          │    │    ┌──────────────────┐   │  │      ───────────────┐   │
   │    GENERATOR     │◄─┼──┼──┘   │        L   •◄────┼────┼──┐ │         G        │   │  │     /              /│   │
   ├──────────────────┤  │  │      │         Q        │    │  └─┼─►•     ───       │◄──┘  │    /              / │◄──┤
   │                  │  │  │  ┌──►│          Z       │    │    │      MEMORY      │      │   ┌──────────────┐  │   │
   │    INSTRUCTION   │  │  │  │   └──────────────────┘    │◄──►│       LOCAL      │      └──►│   ERASABLE   │  /   │
┌─►│   MICROPROGRAM   │  │  │  │                           │    │     REGISTER     │          │    MEMORY    │ /    │
│  │      PULSES      │  │  │  │                           │  ┌►├──────────────────┤◄────────►│++++++++++++++│/     │
│  │                  │  │  │  │   ┌──────────────────┐    │  │ │      PARITY      │          └──────────────┘      │
│  └────────┬─────────┘  │  │  │   │    ARITHMETIC    │    │  │ └──────────────────┘                                │
│           │            │  │  ├──►│       UNIT       │◄──►│  │                                                     │
│           ├────────────┼──┼──┤   └──────────────────┘    │  └───────────┐                                         │
│           │            │  │  │                           │              │                                         │
│           │            │  │  │                           │    ┌─────────┴────────┐                                │
│  ┌────────┴─────────┐  │  │  │   ┌──────────────────┐    │    │      SPECIAL     │                                │
│  │      MEMORY      │  └──┼──┼──►│                  │    │    │      GATING      │                                │
│  │      TIMING      │     │  │   │                  │    │    └──────────────────┘                                │
│  └─────────────┬────┘     └──┼──►│      INPUT /     │◄──►│              ▲                                         │
│                │             │   │      OUTPUT      │    │              │                                         │
│    INPUTS ─────┼─────────────┼──►│     CHANNELS     │    ├──────────────┘                                         │
│                │             │   │                  │    │                                                        │
│   OUTPUTS ◄────┼─────────────┼───┤                  │    │                                                        │
│                │             │   └──────────────────┘    │                                                        │
│                │             │                           │                                                        │
│                └─────────────┼───────────────────────────┼────────────────────────────────────────────────────────┘
│                              │                           │                                                         
│                              │   ┌──────────────────┐    │                                                         
│                              │   │        SQ        │    │                                                         
│                              └──►│       ────       │◄───┘                                                         
│                                  │    INSTRUCTION   │                                                              
└──────────────────────────────────┤     DECODING     │                                                              
                                   └──────────────────┘                                                              
`;
