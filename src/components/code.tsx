import { Printout } from "./printout";
import { missionReport } from "./editordata";
import { Sensor } from "./sensor";
import "./code.css";

export function Code() {
  return (
    <div id="code">
      <pre class="diagram lg">{extras.download}</pre>
      <img id="code-rust" src="/assets/rust.svg" />
      <img id="code-js" src="/assets/javascript.svg" />
      <img id="code-sql" src="/assets/sql.svg" />
      <Sensor />
      <Printout id="mission-report">
        <pre contenteditable style="font-size: 13.75px;">{missionReport}</pre>
      </Printout>
    </div>
  );
}

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
