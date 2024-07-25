import { Suspense } from "solid-js";

import { Header } from "./header";
import { Countdown } from "./countdown";
import { Keeb } from "./keeb";
import { Tester } from "./tester";
import { Editor } from "./editor";
import { Deparkanoid } from "./derparkanoid";

export function App() {
  return (
    <>
      <Header />
      <Countdown />
      <main>
        <Keeb />
        <Suspense fallback="Loading...">
          <Tester />
        </Suspense>
        <section>
          <Editor />
        </section>
        <section>
          <Deparkanoid />
        </section>
      </main>
    </>
  );
}
