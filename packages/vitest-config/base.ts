import { defineConfig } from "vitest/config";

export const baseConfig = defineConfig({
  test: {
    globals: true,
    passWithNoTests: false,
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/dist/**", "**/*.config.*", "**/types/**", "**/*.d.ts"],
    },
  },
});
