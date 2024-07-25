import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [nodePolyfills({ include: ["buffer", "stream"] }), solid()],
});
