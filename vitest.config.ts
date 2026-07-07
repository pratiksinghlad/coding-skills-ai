// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Node environment to test file system operations
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
  },
});
