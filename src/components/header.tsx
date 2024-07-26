import { version } from "../../package.json";
import "./header.css";

const [MAJOR, MINOR] = version.split(".");

export function Header() {
  return (
    <header class="maxwidth">
      <menu>
        <a href="/assets/dm.zip" download>
          █ DOWNLOAD <sup>532KB</sup>
        </a>
        <a href="https://buymeacoffee.com/phosphoricons">█ DONATE</a>
      </menu>
      <h1 id="title">
        Departure Mono
        <span id="version">
          v{MAJOR}.{MINOR}
        </span>
      </h1>
      <p class="comment">
        DEPARTURE MONO IS A MONOSPACED PIXEL FONT BY{" "}
        <a href="https://helenazhang.com">HELENA ZHANG</a>.
      </p>
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
    </header>
  );
}
