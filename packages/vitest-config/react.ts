import { mergeConfig, defineConfig } from "vitest/config";
import { baseConfig } from "./base.ts";

export const reactConfig = mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./vitest.setup.ts"],
    },
  }),
);
