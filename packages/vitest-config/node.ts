import { mergeConfig, defineConfig } from "vitest/config";
import { baseConfig } from "./base.ts";

export const nodeConfig = mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: "node",
      typecheck: { enabled: true, include: ["**/*.test-d.ts"] },
    },
  }),
);
