import { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { go } from "@codemirror/lang-go";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";

export enum Language {
  GO = "go",
  JAVASCRIPT = "javascript",
  MARKDOWN = "markdown",
  RUST = "rust",
  SQL = "sql",
  TYPESCRIPT = "typescript",
}

export const theme = EditorView.theme({
  "&": {
    color: "var(--cement)",
    backgroundColor: "var(--carbon)",
  },
  ".cm-content": { caretColor: "var(--cement)" },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--cement)" },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
    {
      backgroundColor: "var(--ash)",
    },
});

export const syntax = syntaxHighlighting(
  HighlightStyle.define([
    { tag: t.keyword, color: "var(--pumpkin)" },
    {
      tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
      color: "var(--cement)",
    },
    {
      tag: [t.function(t.variableName), t.labelName],
      color: "var(--enamel)",
    },
    // {
    // 	tag: [t.color, t.constant(t.name), t.standard(t.name)],
    // 	color: "var(--flux)",
    // },
    // {
    // 	tag: [t.definition(t.name), t.separator],
    // 	color: "var(--clay)",
    // },
    {
      tag: [
        t.typeName,
        t.className,
        t.number,
        t.changed,
        t.annotation,
        t.modifier,
        t.self,
        t.namespace,
      ],
      color: "var(--amber)",
    },
    // {
    // 	tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
    // 	color: "var(--ash)",
    // },
    {
      tag: [t.meta, t.comment],
      color: "var(--clay)",
    },
    {
      tag: t.strong,
      fontWeight: "bold",
    },
    {
      tag: t.emphasis,
      fontStyle: "italic",
    },
    {
      tag: t.strikethrough,
      textDecoration: "line-through",
    },
    {
      tag: t.link,
      color: "var(--flux)",
      textDecoration: "underline",
    },
    {
      tag: t.heading,
      fontWeight: "bold",
      color: "var(--amber)",
    },
    {
      tag: [t.atom, t.bool, t.special(t.variableName)],
      color: "var(--enamel)",
    },
    {
      tag: [t.processingInstruction, t.string, t.inserted],
      color: "var(--flux)",
    },
    {
      tag: t.invalid,
      color: "var(--foam)",
    },
  ]),
);

const goSnippet = `\
package comlink

import (
	"errors"
	"sync"
	"time"
)

const MAX_PROCESS_TIME = 90 * time.Microsecond

type MessageBus[D any] struct {
	mu       sync.Mutex
	updata   []D
	downdata []D
}

func (bus *MessageBus[D]) Drain(sink func(D) error) error {
	timeout := time.After(MAX_PROCESS_TIME)
	result := make(chan error, len(bus.downdata))
	done := make(chan error)

	bus.mu.Lock()
	defer bus.mu.Unlock()

	for i, msg := range bus.downdata {
		go func(i int, msg D) {
			err := sink(msg)
			bus.downdata = append(bus.downdata[:i], bus.downdata[i+1:]...)
			result <- err
		}(i, msg)
	}
	go func() {
		for range len(bus.downdata) {
			if err := <-result; err != nil {
				done <- err
			}
		}
		done <- nil
	}()

	select {
	case <-timeout:
		return errors.New("timed out draining downdata bus")
	case err := <-done:
		return err
	}
}`;

const jsSnippet = `\
function shortestPath(source, target) {
  if (!source || !target) return [];
  if (source === target) return [source];

  const queue = [source];
  const visited = { [source]: true };
  const predecessor = {};
  let tail = 0;

  while (tail < queue.length) {
    // Pop vertex off queue
    let last = queue[tail++];
    let neighbors = nodeMap[last];

    if (neighbors) {
      for (let neighbor of neighbors) {
        if (visited[neighbor]) continue;

        visited[neighbor] = true;
        if (neighbor === target) {
          // Check if path is complete. If so, backtrack!
          const path = [neighbor];
          while (last !== source) {
            path.push(last);
            last = predecessor[last];
          }
          path.push(last);
          path.reverse();
          return path;
        }
        predecessor[neighbor] = last;
        queue.push(neighbor);
      }
    }
  }
};`;

const mdSnippet = `\
# MISSION REPORT

## SUBJECT: ASTRONAUT'S DISCOVERY ON SATURN'S MOON TITAN

DATE: JULY 20, 2031
MISSION NAME: TITAN EXPLORER I
LEAD ASTRONAUT: COMMANDER JANE DOE

---

## EXECUTIVE SUMMARY

On July 20, 2031, during the Titan Explorer I mission, Commander Jane Doe made an unprecedented and shocking discovery on Saturn's moon Titan. This report documents the significant findings and initial analyses of the geological features near the landing site. The data collected provides groundbreaking insights into the potential for extraterrestrial life and the geological history of Titan.

---

## DISCOVERY OVERVIEW

Commander Jane Doe reported the presence of unusual geological formations and organic compounds near the designated landing site. The initial analysis suggests these formations may have biological origins, indicating the possible existence of primitive life forms on Titan.

---

## GEOLOGICAL FEATURES AND MEASUREMENTS

### LANDING SITE COORDINATES
Latitude: 22.3°N  
Longitude: 135.5°W

### TABLE 1: SURFACE COMPOSITION ANALYSIS
┌────────────────────┬─────────────────────┬────────────────────────────────────────────┐
│ Element/Compound   │ Concentration (ppm) │ Notes                                      │
├────────────────────┼─────────────────────┼────────────────────────────────────────────┤
│ Methane (CH₄)      │ 1450                │ Higher than anticipated                    │
│ Ethane (C₂H₆)      │ 720                 │ Consistent with previous observations      │
│ Complex Organics   │ 350                 │ Indicates potential biological activity    │
│ Water Ice (H₂O)    │ 2100                │ Abundant, suggesting subsurface ocean      │
│ Tholins            │ 1100                │ Common in Titan’s atmosphere               │
└────────────────────┴─────────────────────┴────────────────────────────────────────────┘

### TABLE 2: GEOLOGICAL FEATURE DIMENSIONS
┌─────────────────────┬──────────┬───────────┬──────────────────────────────────────────┐
│ Feature             │ Dia. (m) │ Depth (m) │ Description                              │
├─────────────────────┼──────────┼───────────┼──────────────────────────────────────────┤
│ Methane Lake        │ 300      │ 50        │ Smooth, reflective surface               │
│ Organic Ridge       │ 150      │ 20        │ Composed of unknown organic material     │
│ Ice Volcano         │ 200      │ 75        │ Erupting with a mix of water and ammonia │
│ Cryovolcanic Plain  │ 500      │ 10        │ Flat area with cryovolcanic deposits     │
└─────────────────────┴──────────┴───────────┴──────────────────────────────────────────┘

---

## DETAILED OBSERVATIONS

### METHANE LAKE
The methane lake observed near the landing site exhibits a highly reflective surface, indicating a smooth, liquid state. The presence of such a large, stable liquid methane body is critical for understanding Titan's hydrological cycle and potential for life.

### ORGANIC RIDGE
The organic ridge, spanning 150 meters in diameter, is composed of complex organic materials not previously observed on Titan. Preliminary spectroscopic analysis suggests the presence of amino acids and other precursors to life.

### ICE VOLCANO
The ice volcano, approximately 200 meters in diameter and 75 meters deep, is actively erupting with a mixture of water and ammonia. This finding supports the hypothesis of a subsurface ocean and ongoing cryovolcanic activity.

### CRYOVOLCANIC PLAIN
The cryovolcanic plain is characterized by an expansive, flat area covered with cryovolcanic deposits. This feature provides evidence of recent geological activity and potential subsurface habitability.

---

## CONCLUSIONS AND RECOMMENDATIONS

The discovery of complex organics and geological activity on Titan suggests the potential for primitive life forms and a dynamic, evolving environment. It is recommended that future missions focus on in-depth analysis of the organic ridge and methane lake to explore the possibility of extant life. Additionally, a subsurface probe should be deployed to investigate the composition and habitability of Titan's subsurface ocean.

---

## ATTACHMENTS

- Spectroscopic Analysis Data
- High-Resolution Images of Geological Features
- Detailed Logs from Commander Jane Doe

---

**SIGNED:**

Commander Jane Doe
Lead Astronaut, Titan Explorer I
NESA

---

**END OF REPORT**`;

const rsSnippet = `\
use crate::biometrics::Monitor;
use crate::telemetry::Telemetry;

#[derive(Default)]
pub struct Consumables {
    pub v_ox: f32,
    pub v_aq: f32,
    pub delta_ox: f32,
    pub delta_aq: f32,
    pub suit_pressure: usize,
}

pub struct LifeSupport<'t> {
    pub bios: &'t Monitor,
    pub telemetry: &'t Telemetry,
    consumables: Consumables,
}

impl <'t> LifeSupport<'t> {
    pub fn new_with_intruments(bios: &'t Monitor, telemetry: &'t Telemetry) -> Self {
        LifeSupport {
            bios,
            telemetry,
            consumables: Default::default()
        }
    }

    pub fn eva_remaining(&self) -> std::time::Duration {
        const UPSILON: u64 = 41;
        let mut t = std::time::Duration::from_secs(UPSILON);
        t *= (self.consumables.v_ox - self.consumables.delta_ox.powi(4)) as u32;
        t * self.consumables.v_aq.powf(self.consumables.delta_aq).floor() as u32
    }
}`;

export const Snippets: Record<Language, { syntax: Extension; doc: string }> = {
  [Language.GO]: {
    syntax: go(),
    doc: goSnippet,
  },
  [Language.JAVASCRIPT]: {
    syntax: javascript(),
    doc: jsSnippet,
  },
  [Language.MARKDOWN]: {
    syntax: markdown(),
    doc: mdSnippet,
  },
  [Language.RUST]: {
    syntax: rust(),
    doc: rsSnippet,
  },
  [Language.SQL]: {
    syntax: sql(),
    doc: `\
-- Summarize largest and most prominent space missions from Bloc Gamma
WITH gamma_bloc_missions AS (
    SELECT
        m.id,
        m.name AS mission_name,
        m.launch_date,
        s.name AS spacecraft_name,
        COUNT(ma.astronaut_id) AS astronaut_count
    FROM
        missions m
    JOIN
        spacecraft s ON m.spacecraft_id = s.id
    JOIN
        mission_astronauts ma ON m.id = ma.mission_id
    WHERE
        m.launch_date BETWEEN '2029-01-01' AND '2032-12-31' -- all dates UTC
    GROUP BY
        m.id, m.name, m.launch_date, s.name
    ORDER BY
        astronaut_count DESC,
        m.launch_date DESC
    LIMIT 5
)
SELECT
    mission_name,
    launch_date,
    spacecraft_name,
    astronaut_count
FROM 
    gamma_bloc_missions;
`,
  },
  [Language.TYPESCRIPT]: {
    syntax: javascript({ typescript: true }),
    doc: `\
const GRAVITATIONAL_CONSTANT: number = 9.81; // m/s^2, Earth's gravitational constant
const EARTH_RADIUS: number = 6371; // km, average radius of the Earth

function dynamicPressure(speed: number, altitude: number): number {
    return 0.5 * (speed ** 2);
}

function reentryAngle(
    speed: number,
    azimuth: number,
    altitude: number,
    mass: number,
): number {
    const az = degToRad(azimuth);
    const dp = dynamicPressure(speed, altitude);
    const fc = (speed ** 2) / (EARTH_RADIUS + altitude);
    const fg = GRAVITATIONAL_CONSTANT * mass / Math.pow(EARTH_RADIUS + altitude, 2);
    const ft = fc - fg;

    const angle = Math.atan2(dp, ft);
    return radToDeg(angle);
}

const speed = 7800; // m/s, typical re-entry speed
const azimuth = 45; // degrees
const altitude = 120; // km
const mass = 2000; // kg, mass of the spacecraft

gimbalEngines(reentryAngle(speed, azimuth, altitude, mass));
`,
  },
};
