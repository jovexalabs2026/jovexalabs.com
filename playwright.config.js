import { defineConfig } from '@playwright/test';

const baseURL = process.env.STATIC_BASE_URL || 'http://127.0.0.1:4173';
export default defineConfig({
  testDir: './e2e',
  workers: 1,
  use: { baseURL, browserName: 'chromium' },
  webServer: process.env.STATIC_BASE_URL ? undefined : {
    command: 'node tool/static-preview.mjs',
    url: baseURL,
    reuseExistingServer: false,
  },
});
