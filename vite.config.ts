/// <reference types="vitest" />

import { resolve } from "node:path";
import devServer from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          tanstack: [
            "@tanstack/match-sorter-utils",
            "@tanstack/react-devtools",
            "@tanstack/react-form",
            "@tanstack/react-router",
            "@tanstack/react-router-devtools",
            "@tanstack/react-table",
            "@tanstack/router-plugin",
          ],
          radix: [
            "@radix-ui/react-label",
            "@radix-ui/react-select",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
          ],
          tailwind: [
            // '@tailwindcss/vite',
            // 'tailwind-merge',
            // 'tailwindcss',
            // 'tw-animate-css',
          ],
          zod: ["zod"],
          utils: ["class-variance-authority", "clsx", "lucide-react"],
          jazz: [
            "jazz-tools",
            "cojson",
            "cojson-storage-indexeddb",
            "cojson-transport-ws",
          ],
          wasm: ["cojson-core-wasm"],
          "better-auth": ["better-auth"],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  plugins: [
    visualizer(),
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    devServer({
      entry: "server/index.ts",
      exclude: [/^(?!\/api(?:\/|$)).*/],
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
