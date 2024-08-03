import {
  createResource,
  createSignal,
  createMemo,
  For,
  createEffect,
} from "solid-js";
import { TTF } from "fonteditor-core";
import { cva, VariantProps } from "cva";

import { font, charMap } from "../font";
import "./tester.css";

type GlyphEntry = {
  code: number;
  glyf: TTF.Glyph;
};

enum Segment {
  BASIC_LATIN = "BASIC LATIN",
  EXTENDED_LATIN = "EXTENDED LATIN",
  GREEK_AND_COPTIC = "GREEK AND COPTIC",
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

const CHAR_GROUPINGS: Record<Segment, (c: number) => boolean> = {
  [Segment.BASIC_LATIN]: (c) =>
    (c >= 0x0041 && c <= 0x005a) || (c >= 0x0061 && c <= 0x007a),
  [Segment.EXTENDED_LATIN]: (c) =>
    (c >= 0x00c0 && c <= 0x00d6)
    || (c >= 0x00d8 && c <= 0x00f6)
    || (c >= 0x00f8 && c <= 0x02af)
    || (c >= 0x1e00 && c <= 0x1eff),
  [Segment.GREEK_AND_COPTIC]: (c) => c >= 0x0370 && c <= 0x03ff,
  [Segment.PUNCTUATION]: (c) =>
    (c >= 0x0021 && c <= 0x002f) ||
    (c >= 0x003a && c <= 0x003f) ||
    (c >= 0x005b && c <= 0x0060) ||
    (c >= 0x007b && c <= 0x007e) ||
    (c >= 0x00ae && c <= 0x00b1) ||
    (c >= 0x00b4 && c <= 0x00b8) ||
    (c >= 0x2013 && c <= 0x203a) ||
    [
      0x003f, 0x0040, 0x00a1, 0x00bb, 0x00a6, 0x00a7, 0x00a9, 0x2122, 0x2318, 0x2325,
    ].includes(c),
  [Segment.DIGITS]: (c) => (c >= 0x0030 && c <= 0x0039),
  [Segment.NUMERALS]: (c) =>
    (c >= 0x003c && c <= 0x003e) ||
    (c >= 0x00a2 && c <= 0x00a5) ||
    (c >= 0x00b2 && c <= 0x00b3) ||
    (c >= 0x00b9 && c <= 0x00ba) ||
    (c >= 0x00bc && c <= 0x00be) ||
    (c >= 0x2070 && c <= 0x20bd) ||
    (c >= 0x2126 && c <= 0x215e) ||
    (c >= 0x2202 && c <= 0x2265) ||
    [
      0x0024, 0x0025, 0x002b, 0x005e, 0x007e, 0x00b5, 0x00b9, 0x00d7, 0x00f7,
      0x0192, 0x0e3f, 0x2030, 0x2044,
    ].includes(c),
  [Segment.GRAPHICAL]: (c) =>
    (c >= 0x2190 && c <= 0x2199) || (c >= 0x2500 && c <= 0x25ca),
} as const;

export function Tester() {
  const [fk] = createResource(font());
  const [cm] = createResource(charMap());
  const gs = createMemo<Record<string, GlyphEntry[]>>(() => {
    const f = fk()?.get();
    if (!f) return {};
    return Object.entries(f.cmap).reduce<Record<string, GlyphEntry[]>>(
      (acc, [code, idx]) => {
        const cdpt = parseInt(code);
        const glyf = f.glyf[idx];

        const [segment] =
          Object.entries(CHAR_GROUPINGS).find(([_, test]) => test(cdpt)) ?? [];
        if (segment) {
          if (!acc[segment]) acc[segment] = [];
          acc[segment].push({ code: cdpt, glyf });
        }

        return acc;
      },
      {},
    );
  });

  const basicLatin = () => gs()[Segment.BASIC_LATIN];
  const lower = () => gs()[Segment.BASIC_LATIN]?.filter(
    (glyf) => glyf.code >= 0x61 && glyf.code <= 0x7A);
  const extendedLatin = () => gs()[Segment.EXTENDED_LATIN];
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
  }

  return (
    <div id="tester" class="maxwidth">
      <pre id="apollo1" class="diagram">
        {apollo}
      </pre>
      <div class="split">
        <div id="glyph-specimen">
          <div class="specimen-details">
            <span class="specimen-name">
              {cm()?.get(glyf()?.unicode[0]!)}
            </span>
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
              <span>
                U+
                {glyf()?.unicode[0].toString(16).padStart(4, "0").toUpperCase() ??
                  "0000"}
              </span>
              <span>{feature()?.toUpperCase()}</span>
            </div>
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
          <span id="big" class={fontStyle({ feature: feature() })}>{String.fromCharCode(glyf()?.unicode[0] ?? 0)}</span>
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
      title={`U+${props.glyf.unicode[0]}`}
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

