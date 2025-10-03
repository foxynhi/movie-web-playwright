import { test, expect } from '@playwright/test';

test('login to movies app', async ({ page }) => {
  await test.step('Navigate to the movies app', async () => {
    await page.goto('https://debs-obrien.github.io/playwright-movies-app');
  });
  
  await test.step('Check if already logged in', async () => {
    const userProfileButton = page.getByRole('button', { name: 'User Profile' });
    const isLoggedIn = await userProfileButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isLoggedIn) {
      console.log('Already logged in - skipping login steps');
      return;
    }
  });
  
  await test.step('Click Log In button', async () => {
    await page.getByRole('button', { name: 'Log In' }).click();
  });
  
  await test.step('Fill in login credentials', async () => {
    // Wait for login form to load
    await page.getByRole('heading', { name: 'Login to the Playwright Stage' }).waitFor();
    
    // Fill email address
    await page.getByRole('textbox', { name: 'Email address' }).fill('me@outlook.com');
    
    // Fill password
    await page.getByRole('textbox', { name: 'Password' }).fill('12345');
  });
  
  await test.step('Submit login form', async () => {
    await page.getByRole('button', { name: 'Login' }).click();
  });
  
  await test.step('Verify login successful', async () => {
    const userProfileButton = page.getByRole('button', { name: 'User Profile' });
    await expect(userProfileButton).toBeVisible({ timeout: 10000 });
    
    console.log('Login successful - User Profile button is visible');
  });
});