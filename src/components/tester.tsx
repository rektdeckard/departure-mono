import { createResource, createSignal, createMemo, For, createEffect } from "solid-js";
import { TTF } from "fonteditor-core";

import { font } from "../font";
import "./tester.css";

type GlyphEntry = {
  code: number;
  glyf: TTF.Glyph;
}

enum Segment {
  BASIC_LATIN = "BASIC LATIN",
  EXTENDED_LATIN = "EXTENDED LATIN",
  GREEK_AND_COPTIC = "GREEK AND COPTIC",
  PUNCTUATION = "PUNCTUATION",
  NUMERALS = "NUMERALS",
  GRAPHICAL = "GRAPHICAL",
}

const CHAR_GROUPINGS: Record<Segment, (c: number) => boolean> = {
  [Segment.BASIC_LATIN]: (c) =>
    (c >= 0x0041 && c <= 0x005A)
    || (c >= 0x0061 && c <= 0x007A),
  [Segment.EXTENDED_LATIN]: (c) =>
    (c >= 0x0C0 && c <= 0x02AF)
    || (c >= 0x1E00 && c <= 0x1EFF),
  [Segment.GREEK_AND_COPTIC]: (c) => c >= 0x0370 && c <= 0x03FF,
  [Segment.PUNCTUATION]: (c) =>
    (c >= 0x0021 && c <= 0x002F)
    || (c >= 0x003A && c <= 0x003F)
    || (c >= 0x005B && c <= 0x0060)
    || (c >= 0x007B && c <= 0x007E)
    || (c >= 0x00AE && c <= 0x00B1)
    || (c >= 0x00B4 && c <= 0x00B8)
    || (c >= 0x2013 && c <= 0x203A)
    || [0x003F, 0x0040, 0x00A1, 0x00BB, 0x00A6, 0x00A7, 0x2122, 0x2318, 0x2325].includes(c),
  [Segment.NUMERALS]: (c) =>
    (c >= 0x0030 && c <= 0x0039)
    || (c >= 0x003C && c <= 0x003E)
    || (c >= 0x00A2 && c <= 0x00A5)
    || (c >= 0x00B2 && c <= 0x00B3)
    || (c >= 0x00B9 && c <= 0x00BA)
    || (c >= 0x00BC && c <= 0x00BE)
    || (c >= 0x2070 && c <= 0x20BD)
    || (c >= 0x2126 && c <= 0x215E)
    || (c >= 0x2202 && c <= 0x2265)
    || [0x0024, 0x0025, 0x002B, 0x005E, 0x007E, 0x00B5, 0x00B9, 0x00D7, 0x00F7, 0x0192, 0x0E3F, 0x2030, 0x2044].includes(c),
  [Segment.GRAPHICAL]: (c) =>
    (c >= 0x2190 && c <= 0x2199)
    || (c >= 0x2500 && c <= 0x25CA),
} as const;

export function Tester() {
  const [fk] = createResource(font());
  const gs = createMemo<Record<string, GlyphEntry[]>>(() => {
    const f = fk()?.get();
    if (!f) return {};
    return Object.entries(f.cmap).reduce<Record<string, GlyphEntry[]>>(
      (acc, [code, idx]) => {
        const cdpt = parseInt(code);
        const glyf = f.glyf[idx];

        const [segment] = Object.entries(CHAR_GROUPINGS).find(([_, test]) => test(cdpt)) ?? [];
        if (segment) {
          if (!acc[segment]) acc[segment] = [];
          acc[segment].push({ code: cdpt, glyf });
        }

        return acc;
      }, {}
    );
  });

  const basicLatin = () => gs()[Segment.BASIC_LATIN];
  const extendedLatin = () => gs()[Segment.EXTENDED_LATIN];
  const greek = () => gs()[Segment.GREEK_AND_COPTIC];
  const punctuation = () => gs()[Segment.PUNCTUATION];
  const numerals = () => gs()[Segment.NUMERALS];
  const graphical = () => gs()[Segment.GRAPHICAL];

  const [glyf, setGlyf] = createSignal<TTF.Glyph | null>(null);
  createEffect(() => {
    if (fk.state === "ready") {
      const amp = fk().find({ unicode: [0x51] })[0];
      setGlyf(amp);
    }
  });

  return (
    <div id="tester" class="maxwidth">
      <pre id="apollo1" class="diagram">
        {apollo}
      </pre>
      <pre id="apollo2" class="diagram">
        {apollo}
      </pre>
      <div class="split">
        <div id="glyph-specimen">
          <div class="specimen-details">
            <span class="specimen-name">
              {glyf()?.name.toUpperCase() ?? "NULL"}
            </span>
            <span>
              U+{glyf()?.unicode[0].toString(16).padStart(4, "0").toUpperCase() ?? "0000"}
            </span>
          </div>
          <div class="anatomy">
            <span>ASCENDER / <br />CAP HEIGHT</span>
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
          <span id="big">{String.fromCharCode(glyf()?.unicode[0] ?? 0)}</span>
        </div>
        <div id="glyph-list">
          <div class="segment-header">{Segment.BASIC_LATIN}</div>
          <For each={basicLatin()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf()}
                onClick={() => setGlyf(ge.glyf)}
              />
            )}
          </For>
          <div class="segment-header">{Segment.EXTENDED_LATIN}</div>
          <For each={extendedLatin()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf()}
                onClick={() => setGlyf(ge.glyf)}
              />
            )}
          </For>
          <div class="segment-header">{Segment.GREEK_AND_COPTIC}</div>
          <For each={greek()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf()}
                onClick={() => setGlyf(ge.glyf)}
              />
            )}
          </For>
          <div class="segment-header">{Segment.PUNCTUATION}</div>
          <For each={punctuation()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf()}
                onClick={() => setGlyf(ge.glyf)}
              />
            )}
          </For>
          <div class="segment-header">{Segment.NUMERALS}</div>
          <For each={numerals()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf()}
                onClick={() => setGlyf(ge.glyf)}
              />
            )}
          </For>
          <div class="segment-header">{Segment.GRAPHICAL}</div>
          <For each={graphical()}>
            {(ge, _idx) => (
              <GlyphItem
                {...ge}
                selected={ge.glyf === glyf()}
                onClick={() => setGlyf(ge.glyf)}
              />
            )}
          </For>
        </div>
      </div>
      <pre class="diagram lg">
        {extras.download}
      </pre>
    </div>
  );
}


type GlyphItemProps = GlyphEntry & {
  selected: boolean;
  onClick: (e: MouseEvent) => void;
};

function GlyphItem(props: GlyphItemProps) {
  const content = () => String.fromCharCode(props.code);

  return (
    <div
      class="glyph-item"
      title={props.glyf.name.toUpperCase()}
      data-selected={props.selected}
      onClick={props.onClick}
    >
      <span class="glyph-example">
        {content()}
      </span>
    </div>
  );
}

const apollo = `\
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

const extras = {
  download: `\
Suspended ───► Queued ───► Connecting ────► Transferring ───► Transferred     
    │             ▲            │                │                 │           
    │             │            │                │                 │ (complete)
    └─────────────┼────────────┼────────────────┼────┐            ▼           
                  │            │                │    │       Acknowledged     
                  │            ▼                ▼    │                        
                  │    Transient Error ─────► Error  │                        
                  │            │                │    │ (cancel)               
                  │            └───────┬────────┴────┤                        
                  │                    │             │                        
                  │      (resume)      │             │                        
                  └────────────────────┘             └──► Cancelled           \
`,
  flow: `\
┌───────────────────────────────┐             
│random                         │             
└┬─────────────┬─────────────┬─┬┘             
┌▽───────────┐┌▽────────────┐│┌▽─────────────┐
│distribution││seed_sequence│││nonsecure_base│
└┬───────────┘└┬───┬───────┬┘│└┬┬────────────┘
 │             │  ┌│───────│─│─│┘             
 │ ┌───────────┘  ││       │ │┌┘              
 │ │┌─────────────▽▽┐┌─────▽─▽▽┐              
 │ ││salted_seed_seq││pool_urbg│              
 │ │└┬──────────────┘└┬────────┘              
 │┌▽─▽────────────────▽┐                      
 ││seed_material       │                      
 │└┬───────────────────┘                      
┌▽─▽────┐                                     
│strings│                                     
└───────┘                                     \
`,
  airline: `\
│ Flight  │ Airline          │ Destination          │ Departure Time  │ Gate  │ Status     │
├─────────┼──────────────────┼──────────────────────┼─────────────────┼───────┼────────────┤
│ DL123   │ Delta Air Lines  │ LAX (Los Angeles)    │ 08:00           │ 22    │ On Time    │
│ BA456   │ British Airways  │ JFK (New York)       │ 10:30           │ 5     │ Boarding   │
│ LH789   │ Lufthansa        │ JFK (New York)       │ 13:45           │ Z23   │ Delayed    │
│ AF321   │ Air France       │ SFO (San Francisco)  │ 09:15           │ 12    │ On Time    │
│ UA567   │ United Airlines  │ LGA (New York)       │ 11:20           │ C8    │ Departed   │
│ QF678   │ Qantas           │ LHR (London)         │ 20:00           │ 17    │ On Time    │
│ EK432   │ Emirates         │ JFK (New York)       │ 14:50           │ A7    │ Boarding   │
│ SQ890   │ Singapore Ai...  │ LAX (Los Angeles)    │ 19:30           │ B12   │ On Time    │
│ AA234   │ American Air...  │ ORD (Chicago)        │ 07:45           │ 15    │ Departed   │
│ CX879   │ Cathay Pacific   │ LAX (Los Angeles)    │ 22:10           │ 9     │ On Time    │
`,
};

