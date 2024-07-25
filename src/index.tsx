/* @refresh reload */
import { render } from "solid-js/web";

import "./reset.css";
import "./index.css";
import { App } from "./components/app";

const root = document.getElementById("root");
render(() => <App />, root!);
