import { createEffect } from "solid-js";
import { EditorView } from "codemirror";
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { EditorState, Compartment, Extension } from "@codemirror/state";
import { drawSelection, dropCursor, highlightSpecialChars, keymap } from "@codemirror/view";

import { Language, Snippets, theme, syntax } from "./editordata";
import { Select } from "./select";
import "./editor.css";

const DEFAULT_EXTENSIONS: Extension = [
  history(),
  highlightSpecialChars(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  EditorView.lineWrapping,
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...historyKeymap,
    ...completionKeymap,
  ]),
  theme,
  syntax,
];

export type EditorProps = {
  initialValue?: string;
  initialLanguage?: Language;
};

export function Editor(props: EditorProps) {
  let ref: HTMLDivElement;
  let view: EditorView;
  const initialLang = props.initialLanguage ?? Language.RUST;
  const initialDoc = props.initialValue ?? Snippets[initialLang].doc

  const langs = new Compartment(), tabSize = new Compartment();
  const state = EditorState.create({
    doc: initialDoc,
    extensions: [
      DEFAULT_EXTENSIONS,
      langs.of(Snippets[initialLang].syntax),
      tabSize.of(EditorState.tabSize.of(4))
    ],
  });

  createEffect(() => {
    view = new EditorView({
      state,
      parent: ref,
    });
  })

  function selectLanguage(lang: Language) {
    view.setState(EditorState.create({
      doc: Snippets[lang].doc,
      extensions: [
        DEFAULT_EXTENSIONS,
        tabSize.of(EditorState.tabSize.of(4)),
        Snippets[lang].syntax,
      ],
    }));
  }

  return (
    <div class="editor">
      <Select
        class="control"
        options={Object.values(Language).map((value) => ({ value, label: value }))}
        value={[initialLang]}
        onValueChange={(v) => selectLanguage(v.items[0].value)}
      />
      <div ref={ref!} />
    </div>
  );
}
