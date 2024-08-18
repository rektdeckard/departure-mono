import { Random } from "kdim";
import { version } from "../../package.json";
import { Printout } from "./printout";
import { TypeTest } from "./typetest";
import "./header.css";
import { createEffect, createSignal } from "solid-js";

const [MAJOR, MINOR] = version.split(".");

export function Header() {
  return (
    <header>
      <div class="maxwidth">
        <div class="headline">
          <div id="title">
            <GlitchTitle />
          </div>
          <menu>
            <a href="/" download>
              ►► DOWNLOAD
            </a>
            <a href="https://buymeacoffee.com/phosphoricons">►► DONATE</a>
          </menu>
        </div>
        <div id="letter">
          <img id="planet" src="/assets/planet.svg" />
          <p class="comment">
            ░{"  "}DEPARTURE MONO IS A
            <br />░{"  "}MONOSPACED PIXEL FONT WITH
            <br />░{"  "}A LO-FI TECHNICAL VIBE
          </p>
          <img id="brief" src="/assets/brief.svg" />
          <img id="newspaper-clipping" src="/assets/newspaper-clipping.svg" />
          <img id="paperclip" src="/assets/paperclip.svg" />
          <img id="badge" src="/assets/badge.svg" />
          <img id="highlighter" src="/assets/highlighter-outline.svg" />
        </div>
        <pre id="departures">
          {`│ Flight  │ Destination ↑           │ Departing  │ Gate  │ Status       │`}
          <br />
          {`├─────────┼─────────────────────────┼────────────┼───────┼──────────────┤`}
          <br />
          {`│ LH789   │ TGK Tengoku             │ 13:45      │ Z23   │ Delayed      │`}
          <br />
          <span class="blink">
            │ XX123{`   `}│ MBA Moonbase Alpha{`      `}│ 08:00{`      `}│ 22
            {`    `}│ On Time{`      `}│
          </span>
          <br />
          {`│ AF321   │ MAR Mars Landing        │ 09:15      │ 12    │ On Time      │`}
          <br />
          {`│ UA567   │ NNY New New York        │ 11:20      │ C8    │ Departed     │`}
          <br />
          {`│ QF678   │ LHR (London)            │ 20:00      │ 17    │ On Time      │`}
        </pre>
        <div id="ephemera">
          <p class="comment">
            ░{"  "}IT'S GREAT FOR WORKING
            <br />░{"  "}WITH TABULAR DATA
          </p>
          <img id="boarding-pass" src="/assets/boarding-pass.svg" />
          <img id="receipt" src="/assets/receipt.svg" />
          <img id="bag-tag" src="/assets/bag-tag.svg" />
        </div>
        <TypeTest />
      </div>
    </header>
  );
}

const DEPARTURE = "DEPARTURE";
const MONO = "MONO";
const COGNATES: Record<string, string> = {
  D: "DDDƊÐ",
  E: "EEE3ΣΞƏ℮€Ǝ",
  P: "PPP¶₽",
  A: "AAAΛ4@",
  R: "RRR2₹",
  T: "TTT7₸",
  U: "UUUɄ",
  " ": "   _→~",
  M: "MMM",
  O: "OOO0ΘØ",
  N: "NNNƝ",
} as const;

function GlitchTitle() {
  const [departure, setDeparture] = createSignal<string>(DEPARTURE);
  const [space, setSpace] = createSignal<string>(" ");
  const [mono, setMono] = createSignal<string>(MONO);

  function swapCognate(curr: string, original: string): string {
    const idx = Random.natural(curr.length - 1);
    const letter = original[idx];
    const swaps = COGNATES[letter];
    if (!!swaps) {
      const swapped = [...curr];
      swapped[idx] = Random.sample([...swaps])!;
      return swapped.join("");
    }
    return curr;
  }

  createEffect(() => {
    (function d() {
      setDeparture((val) => swapCognate(val, DEPARTURE));
      setTimeout(d, Random.natural(400) + 50);
    })();
    (function s() {
      setSpace((val) => swapCognate(val, " "));
      setTimeout(s, Random.natural(400) + 50);
    })();
    (function m() {
      setMono((val) => swapCognate(val, MONO));
      setTimeout(m, Random.natural(400) + 50);
    })();
  });

  return (
    <h1>
      <span>{departure()}</span>
      <span>{space()}</span>
      <span>{mono()}</span>
      <span id="version">
        v{MAJOR}.{MINOR}
      </span>
    </h1>
  );
}

const letter = (
  <Printout id="brief" color="white" height="594" viewBox="0 55 1010 594">
    <pre>
      {`\
To:                                     From:
DR. E. KERNING                          PROFESSOR H. J. FARNSWORTH
MERCURY RESEARCH LABS                   FARNSWORTH INSTITUTE
3572 WILSHIRE BLVD #9732                88 ESSEX ST
LOS ANGELES, CA 90010                   NEW NEW YORK, NY 10002



Dear Dr. Kerning,

I trust this message finds you in good spirits. I am pleased to brief
you on `}
      <span class="highlight">this critical scientific venture</span>
      {` at the far reaches of our
solar system. Your groundbreaking research and expertise in
exoplanetary ecosystems uniquely qualifies you for this endeavor.

`}
      <span class="highlight">
        Your primary objective will be to investigate an anomaly detected in
      </span>
      <br />
      <span class="highlight">the Kuiper belt.</span>
      {` Initial readings suggest the presence of amino acids
near newly discovered KBOs. Your team will deploy specialized
equipment to collect data and analyze the phenomenon.

Please ensure all preparations are completed according to the attached
mission protocols. We would appreciate your prompt assessment of the
included candidate profiles. Departure is set from Earth's orbit on
the 15th of next month.

I have full confidence in your ability to navigate the challenges of
this mission with scientific rigor and ethical consideration. Your
discoveries may unlock new chapters in our understanding of
extraterrestrial life.

Best regards,
Professor Hubert J. FarnsworthFounder, Farnsworth Institute
            `}
    </pre>
  </Printout>
);

void letter;
