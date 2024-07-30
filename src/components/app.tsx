import { Suspense } from "solid-js";

import { Header } from "./header";
import { Cockpit } from "./cockpit";
import { Keeb } from "./keeb";
import { Tester } from "./tester";
import { Deparkanoid } from "./derparkanoid";
import { Code } from "./code";
import { Footer } from "./footer";

export function App() {
  return (
    <>
      <Header />
      <Cockpit />
      <main>
        <Keeb />
        <Suspense fallback="Loading...">
          <Tester />
        </Suspense>
        <Code />
        <Deparkanoid />
      </main>
      <Footer />
    </>
  );
}
