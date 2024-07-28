import { Suspense } from "solid-js";

import { Header } from "./header";
import { Cockpit } from "./cockpit";
import { Fuzz } from "./fuzz";
import { Keeb } from "./keeb";
import { Tester } from "./tester";
import { Editor } from "./editor";
import { Deparkanoid } from "./derparkanoid";
import { Code } from "./code";

export function App() {
  return (
    <>
      <Header />
      <Fuzz />
      <Cockpit />
      <main>
        <Keeb />
        <Suspense fallback="Loading...">
          <Tester />
        </Suspense>
        <section>
          <Code />
          <Editor />
        </section>
        <section>
          <Deparkanoid />
        </section>
      </main>
    </>
  );
}
