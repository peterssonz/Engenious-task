import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium", // or 'firefox' or 'webkit'
    headless: true,
  },
});
