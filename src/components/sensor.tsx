import { createSignal, createEffect } from "solid-js";
import "./sensor.css";

export function Sensor() {
  const [val, setVal] = createSignal<number>(0);
  createEffect(() => {
    (function rand() {
      setVal(Math.floor(Math.random() * 100));
      setTimeout(rand, Math.random() * 200 + 50);
    })();
    // window.addEventListener("mousemove", (e) => {
    //   setVal(Math.max(0, Math.min(99, Math.abs(e.movementX) + Math.abs(e.movementY))));
    // });
  });

  return <span id="sensor">{val().toString().padStart(2, "0")}</span>;
}
