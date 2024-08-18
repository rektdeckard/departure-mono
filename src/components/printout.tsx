import { JSX, splitProps } from "solid-js";
import "./printout.css";

type PaperColor = "white" | "grey";

const Colors: Record<PaperColor, [string, string]> = {
  white: ["white", "var(--enamel)"],
  grey: ["var(--cement)", "var(--carbon)"],
} as const;

type PrintoutProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  color?: PaperColor;
};

export function Printout(props: PrintoutProps) {
  const [local, rest] = splitProps(props, ["class", "color", "children"]);
  return (
    <svg
      class={`printout ${local.class ?? ""}`}
      width="1010"
      height="648"
      viewBox="0 0 1010 648"
      fill="none"
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1010 0H0V648H22.0448C22.5501 642.393 27.262 638 33 638C38.738 638 43.4499 642.393 43.9552 648H966.045C966.55 642.393 971.262 638 977 638C982.738 638 987.45 642.393 987.955 648H1010V0ZM44 55C44 61.0751 39.0751 66 33 66C26.9249 66 22 61.0751 22 55C22 48.9249 26.9249 44 33 44C39.0751 44 44 48.9249 44 55ZM44 121C44 127.075 39.0751 132 33 132C26.9249 132 22 127.075 22 121C22 114.925 26.9249 110 33 110C39.0751 110 44 114.925 44 121ZM33 198C39.0751 198 44 193.075 44 187C44 180.925 39.0751 176 33 176C26.9249 176 22 180.925 22 187C22 193.075 26.9249 198 33 198ZM44 253C44 259.075 39.0751 264 33 264C26.9249 264 22 259.075 22 253C22 246.925 26.9249 242 33 242C39.0751 242 44 246.925 44 253ZM33 330C39.0751 330 44 325.075 44 319C44 312.925 39.0751 308 33 308C26.9249 308 22 312.925 22 319C22 325.075 26.9249 330 33 330ZM44 385C44 391.075 39.0751 396 33 396C26.9249 396 22 391.075 22 385C22 378.925 26.9249 374 33 374C39.0751 374 44 378.925 44 385ZM33 462C39.0751 462 44 457.075 44 451C44 444.925 39.0751 440 33 440C26.9249 440 22 444.925 22 451C22 457.075 26.9249 462 33 462ZM44 517C44 523.075 39.0751 528 33 528C26.9249 528 22 523.075 22 517C22 510.925 26.9249 506 33 506C39.0751 506 44 510.925 44 517ZM33 594C39.0751 594 44 589.075 44 583C44 576.925 39.0751 572 33 572C26.9249 572 22 576.925 22 583C22 589.075 26.9249 594 33 594ZM977 66C983.075 66 988 61.0751 988 55C988 48.9249 983.075 44 977 44C970.925 44 966 48.9249 966 55C966 61.0751 970.925 66 977 66ZM988 121C988 127.075 983.075 132 977 132C970.925 132 966 127.075 966 121C966 114.925 970.925 110 977 110C983.075 110 988 114.925 988 121ZM977 198C983.075 198 988 193.075 988 187C988 180.925 983.075 176 977 176C970.925 176 966 180.925 966 187C966 193.075 970.925 198 977 198ZM988 253C988 259.075 983.075 264 977 264C970.925 264 966 259.075 966 253C966 246.925 970.925 242 977 242C983.075 242 988 246.925 988 253ZM977 330C983.075 330 988 325.075 988 319C988 312.925 983.075 308 977 308C970.925 308 966 312.925 966 319C966 325.075 970.925 330 977 330ZM988 385C988 391.075 983.075 396 977 396C970.925 396 966 391.075 966 385C966 378.925 970.925 374 977 374C983.075 374 988 378.925 988 385ZM977 462C983.075 462 988 457.075 988 451C988 444.925 983.075 440 977 440C970.925 440 966 444.925 966 451C966 457.075 970.925 462 977 462ZM988 517C988 523.075 983.075 528 977 528C970.925 528 966 523.075 966 517C966 510.925 970.925 506 977 506C983.075 506 988 510.925 988 517ZM977 594C983.075 594 988 589.075 988 583C988 576.925 983.075 572 977 572C970.925 572 966 576.925 966 583C966 589.075 970.925 594 977 594Z"
        fill={Colors[local.color ?? "white"][0]}
      />
      <path d="M66 0H67V648H66V0Z" fill={Colors[local.color ?? "white"][1]} />
      <path
        d="M943 0H944V648H943V0Z"
        fill={Colors[local.color ?? "white"][1]}
      />
      <foreignObject x="68" y="0" width="875" height="648">
        {local.children}
      </foreignObject>
    </svg>
  );
}
