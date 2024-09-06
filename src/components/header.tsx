import { Random, Range } from "kdim";
import { version } from "../../package.json";
import { Printout } from "./printout";
import { TypeTest } from "./typetest";
import "./header.css";
import { createEffect, createSignal } from "solid-js";

const [MAJOR, MINOR] = version.split(".");
const GITHUB_RELEASES_URL = "https://github.com/rektdeckard/departure-mono/releases/latest";

export function Header() {
  return (
    <header>
      <div class="maxwidth">
        <div class="headline">
          <div id="title">
            <GlitchTitle />
          </div>
          <menu>
            <a href={`/assets/DepartureMono-${MAJOR}.${MINOR}.zip`}>↓ DOWNLOAD</a>
            <a href={GITHUB_RELEASES_URL}>&gt; GITHUB</a>
            <a href="https://buymeacoffee.com/helenazhang">♥ DONATE</a>
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
          {`│ LH789   │ EUR Europa 1            │ 13:45      │ Z23   │ Delayed      │`}
          <br />
          <span class="blink">
            │ XX123{`   `}│ KBA Kuiper Alpha{`        `}│ 08:00{`      `}│ 22
            {`    `}│ On Time{`      `}│
          </span>
          <br />
          {`│ AF321   │ MAR Mars Landing        │ 09:15      │ 12    │ On Time      │`}
          <br />
          {`│ UA567   │ NTK New Tokyo           │ 11:20      │ C8    │ Departed     │`}
          <br />
          {`│ QF678   │ ZMB Zvezda Moonbase     │ 20:00      │ 17    │ On Time      │`}
        </pre>
        <div id="ephemera">
          <p class="comment">
            ░{"  "}IT'S GREAT FOR WORKING
            <br />░{"  "}WITH TABULAR DATA
          </p>
          <div id="ephemera-items">
            <img id="boarding-pass" src="/assets/boarding-pass.svg" />
            <img id="receipt" src="/assets/receipt.svg" />
            <img id="bag-tag" src="/assets/bag-tag.svg" />
          </div>
        </div>
        <TypeTest />
      </div>
    </header>
  );
}

const DEPARTURE = "DEPARTURE";
const MONO = "MONO";
const COGNATES: Record<string, string> = {
  E: "3ΣΞ€Ǝ",
  A: "Λ",
  R: "2₹",
  T: "7",
  U: "Ʉ",
  " ": "_",
  O: "0",
  N: "Ɲ",
} as const;

function GlitchTitle() {
  const MIN_DELAY = 400;
  const MAX_DELAY = 2000;
  const GLITCH_CHANCE = 0.1;
  const GLITCH_DELAY = 30;

  const [departure, setDeparture] = createSignal<string>(DEPARTURE);
  const [space, setSpace] = createSignal<string>(" ");
  const [mono, setMono] = createSignal<string>(MONO);

  function glitchWord(original: string, odds: number[]): string {
    const swaps = Random.sample(odds)!;
    if (swaps === 0) return original;

    const glitched = [...original];
    const opts =
      original.length === 1
        ? [0]
        : Random.permutation(Range.of(original.length));
    for (let i = 0; i < swaps; i++) {
      glitched[opts[i]] = Random.sample([
        ...(COGNATES[original[opts[i]]] ?? original[opts[i]]),
      ])!;
    }

    return glitched.join("");
  }

  createEffect(() => {
    (function d() {
      setDeparture(glitchWord(DEPARTURE, [0, 0, 0, 1, 1, 2, 2, 2, 3]));
      if (Math.random() < GLITCH_CHANCE) {
        const delay = Random.natural(MAX_DELAY - MIN_DELAY) + MIN_DELAY;
        const glitched = glitchWord(DEPARTURE, [2, 3, 4, 4, 5, 5, 5, 6, 6]);
        setTimeout(() => setDeparture(DEPARTURE), delay);
        setTimeout(() => setDeparture(glitched), delay + GLITCH_DELAY);
        setTimeout(() => setDeparture(DEPARTURE), delay + GLITCH_DELAY * 2);
        setTimeout(() => setDeparture(glitched), delay + GLITCH_DELAY * 3);
        setTimeout(d, delay + GLITCH_DELAY * 4);
      } else {
        setTimeout(d, Random.natural(MAX_DELAY - MIN_DELAY) + MIN_DELAY);
      }
    })();
    (function s() {
      setSpace(glitchWord(" ", [0, 1, 1]));
      setTimeout(s, Random.natural(MAX_DELAY - MIN_DELAY) + MIN_DELAY);
    })();
    (function m() {
      setMono(glitchWord(MONO, [0, 0, 0, 1, 1, 2, 2]));
      if (Math.random() < GLITCH_CHANCE) {
        const delay = Random.natural(MAX_DELAY - MIN_DELAY) + MIN_DELAY;
        const glitched = glitchWord(DEPARTURE, [1, 1, 2, 2, 3, 3]);
        setTimeout(() => setDeparture(DEPARTURE), delay);
        setTimeout(() => setDeparture(glitched), delay + GLITCH_DELAY);
        setTimeout(() => setDeparture(DEPARTURE), delay + GLITCH_DELAY * 2);
        setTimeout(() => setDeparture(glitched), delay + GLITCH_DELAY * 3);
        setTimeout(m, delay + GLITCH_DELAY * 4);
      } else {
        setTimeout(m, Random.natural(MAX_DELAY - MIN_DELAY) + MIN_DELAY);
      }
    })();
  });

  return (
    <h1>
      <span>{departure()}</span>
      <span id="title-space-dyn">{space()}</span>
      <br id="title-space-sta" />
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
