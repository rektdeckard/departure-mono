import { version } from "../../package.json";
import { Printout } from "./printout";
import "./header.css";

const [MAJOR, MINOR] = version.split(".");

export function Header() {
  return (
    <header>
      <div class="maxwidth">
        <div class="headline">
          <h1 id="title">
            DEPARTURE MONO
          </h1>
          <span id="version">
            v{MAJOR}.{MINOR}
          </span>
        </div>
        <menu>
          <a href="/" download>
            ►► DOWNLOAD <sup>532KB</sup>
          </a>
          <a href="https://buymeacoffee.com/phosphoricons">►► DONATE</a>
        </menu>
        <div id="letter">
          <img id="planet" src="/assets/planet.svg" />
          <p class="comment">WHEN YOU’RE GOING FOR A RETRO TECHNICAL VIBE</p>
          {letter}
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
          <p class="comment">OR WHEN YOU’RE WORKING WITH TABULAR DATA</p>
          <img id="boarding-pass" src="/assets/boarding-pass.svg" />
          <img id="receipt" src="/assets/receipt.svg" />
          <img id="bag-tag" src="/assets/bag-tag.svg" />
        </div>
        <p id="announce">
          QUIET IN THE CABIN FLIGHT ATTENDANTS PREPARE FOR TAKEOFF
        </p>
      </div>
    </header>
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
      <span class="highlight">Your primary objective will be to investigate an anomaly detected in</span>
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
Professor Hubert J. Farnsworth Founder, Farnsworth Institute
            `}
    </pre>
  </Printout>
    );

