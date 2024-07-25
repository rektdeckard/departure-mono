import { Index, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { Select as ArkSelect, type SelectRootProps } from "@ark-ui/solid";
import "./select.css";

export type SelectItem<T> = { label: string; value: T };

export type SelectProps<T> = Omit<SelectRootProps<SelectItem<T>>, "items"> & {
  label?: string;
  placeholder?: string;
  options: SelectItem<T>[];
};

export function Select<T>(props: SelectProps<T>) {
  const [local, rest] = splitProps(props, ["label", "placeholder", "options"]);

  return (
    <ArkSelect.Root items={local.options} {...rest}>
      <Show when={!!local.label}>
        <ArkSelect.Label>{local.label}</ArkSelect.Label>
      </Show>
      <ArkSelect.Control>
        <ArkSelect.Trigger>
          <ArkSelect.ValueText placeholder={props.placeholder} />
          <ArkSelect.Indicator>↕</ArkSelect.Indicator>
        </ArkSelect.Trigger>
      </ArkSelect.Control>
      <Portal>
        <ArkSelect.Positioner>
          <ArkSelect.Content>
            <Index each={local.options}>
              {(item) => (
                <ArkSelect.Item item={item().value}>
                  <span>
                    <ArkSelect.ItemIndicator>→</ArkSelect.ItemIndicator>
                  </span>
                  <ArkSelect.ItemText>{item().label}</ArkSelect.ItemText>
                </ArkSelect.Item>
              )}
            </Index>
          </ArkSelect.Content>
        </ArkSelect.Positioner>
      </Portal>
      <ArkSelect.HiddenSelect />
    </ArkSelect.Root>
  );
}
