import { For } from "solid-js";
import "./typetest.css";

const SAMPLES: TypeSampleProps[] = [
  {
    class: "hidden-small",
    copy: "ATTN: PASSENGERS QUIET IN THE CABIN",
    size: 121,
    tracking: -11,
    style: "gap: 3px;",
  },
  {
    copy: "FLIGHT ATTENDANTS, PREPARE FOR TAKEOFF",
    size: 55,
    style: "gap: 13px;",
  },
  {
    copy: "DEPARTURE MONO IS A MONOSPACED PIXEL FONT INSPIRED BY THE CONSTRAINTS OF EARLY COMMAND-LINE AND GRAPHICAL USER INTERFACES, THE TINY PIXEL FONTS OF THE LATE 90S/EARLY 00s, AND SCI-FI CONCEPTS FROM FILM AND TELEVISION.",
    size: 22,
    style: "gap: 15px; max-width: 1124px;",
  },
  {
    copy: "Departure Mono is a monospaced pixel font inspired by the constraints of early command-line and graphical user interfaces, the tiny pixel fonts of the late 90s/early 00s, and sci-fi concepts from film and television.",
    size: 16.5,
    style: "gap: 16px; max-width: 895px;",
  },
];

export function TypeTest() {
  return (
    <div class="type-samples">
      <For each={SAMPLES}>{(props) => <TypeSample {...props} />}</For>
    </div>
  );
}

type TypeSampleProps = {
  class?: string;
  style?: string;
  copy: string;
  size: number;
  tracking?: number;
};

function TypeSample(props: TypeSampleProps) {
  return (
    <div class={`type-sample ${props.class ?? ""}`} style={props.style}>
      <div class="type-sample-header">
        <span>DEPARTURE MONO</span>
        <span>{props.size}PX</span>
        {props.tracking ? <span>{props.tracking}PX TRACK</span> : null}
      </div>
      <div
        class="type-sample-text"
        contenteditable
        spellcheck={false}
        children={props.copy}
        style={`font-size: ${props.size}px; ${
          props.tracking ? `letter-spacing: ${props.tracking}px` : ""
        }`}
      />
    </div>
  );
}
