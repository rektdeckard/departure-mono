import { createSignal, createEffect } from "solid-js";
import "./sensor.css";

export function Sensor() {
  const [val, setVal] = createSignal<number>(0);
  createEffect(() => {
    function scrollPercent() {
      const scroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setVal(100 - Math.round((scroll / height) * 100));
    }

    window.addEventListener("scroll", scrollPercent);
    return () => window.removeEventListener("scroll", scrollPercent);
  });

  return <span id="sensor">{val().toString().padStart(2, "0")}</span>;
}
