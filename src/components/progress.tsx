import { splitProps, Show } from "solid-js";
import { Progress as ArkProgress } from "@ark-ui/solid";
import "./progress.css";

export type ProgressProps = ArkProgress.RootProps & {
  label?: string;

};

export function Progress(props: ProgressProps) {
  const [local, rest] = splitProps(props, ["label"]);
  return (<ArkProgress.Root {...rest}>
    <Show when={local.label}>
      <ArkProgress.Label><>{local.label}</></ArkProgress.Label>
    </Show>
    <ArkProgress.Track>
      <ArkProgress.Range />
    </ArkProgress.Track>
    <Show when={props.translations}>
      <ArkProgress.ValueText />
    </Show>
  </ArkProgress.Root>
  );
} 
