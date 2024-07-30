import { Printout } from "./printout";
import { apollo } from "./tester";
import { Sensor } from "./sensor";
import "./code.css";

export function Code() {
  return (
    <div id="code" class="maxwidth">
      <pre id="apollo2" class="diagram">
        {apollo}
      </pre>
      { /* <pre id="flow" class="diagram lg">{extras.download}</pre> */}
      <img id="code-rust" src="/assets/rust.svg" />
      <img id="code-js" src="/assets/javascript.svg" />
      <img id="code-sql" src="/assets/sql.svg" />
      <Sensor />
      <p class="comment">CODE AND WRITE TECHNICAL DOCUMENTATION WITH A LO-FI TERMINAL FEEL</p>
      <Printout id="mission-report">
        <pre contenteditable style="font-size: 13.75px;">{altAltMissionReport}</pre>
      </Printout>
    </div>
  );
}

const altMissionReport = `\
# MISSION REPORT 75X9389

## SUBJECT: FINDINGS FROM KERBEROS 5 

EARTH DATE: NOV 20, 2057
MISSION DIRECTOR: E. KERNING

---

## GEOLOGICAL FEATURES AND MEASUREMENTS

### LANDING SITE COORDINATES
Latitude: 22.3°N  
Longitude: 135.5°W

### TABLE 1: SURFACE COMPOSITION ANALYSIS
┌────────────────────┬─────────────┬─────────────────────────────────────┐
│ Element/Compound   │ Conc. (PPM) │ Notes                               │
├────────────────────┼─────────────┼─────────────────────────────────────┤
│ Methane (CH₄)      │        1450 │ Higher than anticipated             │
│ Ethane (C₂H₆)      │         720 │ Consistent with previous            │
│                    │             │   observations                      │
│ Complex Organics   │         350 │ Potential biological activity       │
│ Water Ice (H₂O)    │        2100 │ Abundant, suggesting subsurface     │
│                    │             │   ocean                             │
│ Tholins            │        1100 │ Common in Kerberos 5’s atmosphere   │
└────────────────────┴─────────────┴─────────────────────────────────────┘
`;
void altMissionReport;

const altAltMissionReport = `\
# MISSION REPORT 75X9389

SUBJECT: Anomalous Energy Signatures FROM KERBEROS 5 
EARTH DATE: NOV 20, 2057
MISSION DIRECTOR: E. KERNING

---

## OVERVIEW

During the exploration of Kerberos 5, our instruments detected unexplained energy bursts emanating from the object's polar region. These signatures do not match any known natural phenomenon and warrant further investigation.

### OBSERVATIONS

a) Frequency: Energy bursts occur at irregular intervals, averaging one event every 37.6 Earth hours.
b) Duration: Each burst lasts between 3.2 to 8.7 seconds.
c) Energy Output: Estimated at 10^15 joules per event, far exceeding any known geologic process for an object of this size.
d) Spectral Analysis: Shows an unusual combination of gamma rays, radio waves, and neutrino emissions.

### CHARACTERISTICS

a) Directionality: Energy appears to be focused, rather than omnidirectional.
b) Pattern: While irregular, there are hints of an underlying pattern in the timing of the bursts.
c) Origin: Triangulation places the source approximately 5.3 km beneath the surface of the polar ice cap.

### HYPOTHESES

a) Natural Phenomenon: Possibly a new form of cryovolcanic activity involving exotic ice compositions.
b) Artificial Source: The regularity and energy output could suggest an artificial origin, potentially from an unknown civilization.
c) Quantum Fluctuations: Interaction between normal matter and theorized exotic matter in Kerberos 5's core.
d) Instrumental Error: While unlikely, we cannot completely rule out malfunction in our detection equipment.

### IMPLICATIONS

If confirmed, these energy signatures could represent:
a) A new class of astrophysical phenomena.
b) Evidence of advanced technology or non-terrestrial intelligence.
c) A novel energy source with potential technological applications.

### RECOMMENDATIONS

a) Deploy specialized probes to the polar region for close-range observations.
b) Establish a long-term monitoring station on Kerberos 5.
c) Assemble a multidisciplinary team to analyze the data and develop further hypotheses.
d) Prepare a follow-up mission with equipment designed specifically to study these energy signatures.

### SECURITY CONSIDERATIONS: Given the potential implications of this discovery, it is recommended that this information be classified at the highest level until further analysis can be conducted.\
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

void extras;
