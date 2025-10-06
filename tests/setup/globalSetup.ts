import { chromium, expect } from "@playwright/test";
import { performLogin } from "../shared/auth";
import { TestCredentials } from "../../utils/interfaces";
import fs from 'fs';

export default async function gobalSetup() {
  const creds : TestCredentials = {
    baseUrl: process.env.BASE_URL || "",
    email: process.env.TEST_EMAIL || "",
    password: process.env.TEST_PASSWORD || "",
  };
  
  const browser = await chromium.launch();
  const context = await browser.newContext();

  context.setDefaultTimeout(15_000);

  const page = await context.newPage();

  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  try {
    await performLogin(page, creds);
    console.log('globalSetup: performLogin finished OK');
    await context.storageState({ path: 'fixtures/storageState.auth.json' });
  } 
  catch (err) {
    console.error('globalSetup: performLogin threw:', err);
    await page.screenshot({ path: 'fixtures/setup-failure.png', fullPage: true }).catch(() => {});
    const html = await page.content().catch(() => '');
    fs.writeFileSync('fixtures/setup-dom.html', html);

    const state = await context.storageState().catch(() => null);
    fs.writeFileSync('fixtures/setup-storage.json', JSON.stringify(state, null, 2));

    throw err;
  } finally {
    await context.tracing.stop({ path: 'fixtures/setup-trace.zip' });
    await browser.close();
  }
}