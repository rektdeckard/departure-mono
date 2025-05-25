import {
  createResource,
  createSignal,
  createMemo,
  For,
  createEffect,
} from "solid-js";
import { TTF } from "fonteditor-core";

import cm from "../lib/charmap.json";
import { font, charDb } from "../lib/font";
import "./tester.css";

type CharEntry = {
  code: number;
  feat?: string[];
}

type GlyphEntry = CharEntry & {
  glyf: TTF.Glyph;
};

enum Segment {
  BASIC_LATIN = "Basic Latin",
  EXTENDED_LATIN = "Extended Latin",
  CYRILLIC = "Cyrillic",
  GREEK_AND_COPTIC = "Greek",
  PUNCTUATION = "Punctuation, Symbols",
  NUMERALS = "Numerals, Math, Currency",
  GRAPHICAL = "Graphical",
}

const FONT_FEATURE_MAP = {
  sc: "small caps",
  osf: "old style figures",
  numr: "numerator",
  dnom: "denominator",
  loclNLD: "dutch localization",
} as const;

export function Tester() {
  const [fk] = createResource(font());
  const [cdb] = createResource(charDb());
  const gs = createMemo<Record<string, GlyphEntry[]>>(() => {
    const f = fk()?.get();
    if (!f) return {};
    return Object.entries(cm as Record<Segment, CharEntry[]>).reduce<Record<string, GlyphEntry[]>>(
      (acc, [segment, chars]) => {
        const entries = chars
          .map((entry) => ({ ...entry, glyf: f.glyf[f.cmap[entry.code.toString()]] }))
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

  const [glyf, setGlyf] = createSignal<GlyphEntry | null>(null);
  createEffect(() => {
    if (fk.state === "ready") {
      const ge = gs()[Segment.BASIC_LATIN]?.find((e) => e.code === 0x51)!;
      setGlyf(ge);
    }
  });

  function selectGlyph(ge: GlyphEntry) {
    setGlyf(ge);
    window.gtag("event", "specimen_select_glyph", {
      name: cdb()?.get(ge.code) ?? ge.glyf.name,
      unicode: ge.code,
      features: ge.feat,
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
                {cdb()?.get(glyf()?.code!)}
              </span>
              <span>{glyf()?.feat?.map((ft) => FONT_FEATURE_MAP[ft as keyof typeof FONT_FEATURE_MAP]).filter(Boolean).join(", ").toUpperCase()}</span>
            </div>
            <span>
              U+
              {glyf()?.code.toString(16).padStart(4, "0").toUpperCase() ??
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
          <span id="big" class={glyf()?.feat?.join(" ")}>
            {String.fromCodePoint(glyf()?.code ?? 0)}
          </span>
        </div>
        <div id="glyph-list">
          <For each={Object.entries(gs())}>
            {([segment, entries]) => (
              <>
                <div class="segment-header">{segment}</div>
                <For each={entries}>
                  {(ge, _idx) => (
                    <GlyphItem
                      {...ge}
                      selected={ge === glyf()}
                      onClick={() => selectGlyph(ge)}
                    />
                  )}
                </For>
              </>
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
  const content = () => String.fromCodePoint(props.code);

  return (
    <div
      class={`glyph-item ${props.className ?? ""} ${props.feat?.join(" ") ?? ""}`}
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
