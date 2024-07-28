import { version } from "../../package.json";
import "./header.css";

const [MAJOR, MINOR] = version.split(".");

export function Header() {
  return (
    <header class="maxwidth">
      <div class="headline">
        <h1 id="title">
          DEPARTURE MONO
        </h1>
        <span id="version">
          v{MAJOR}.{MINOR}
        </span>
      </div>
      <menu>
        <a href="/assets/dm.zip" download>
          ►► DOWNLOAD <sup>532KB</sup>
        </a>
        <a href="https://buymeacoffee.com/phosphoricons">►► DONATE</a>
      </menu>
      <div id="letter">
        <img id="planet" src="/assets/planet.svg" />
        <p class="comment">WHEN YOU’RE GOING FOR A RETRO TECHNICAL VIBE</p>
        <img id="brief" src="/assets/brief.svg" />
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
    </header>
  );
}
