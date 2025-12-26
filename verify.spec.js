
import { test, expect } from '@playwright/test';

test('WinOS boots and opens FinancialTracker', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Wait for the boot screen to finish by waiting for the last instance of the boot text
  await expect(page.locator('text=WAKE_UP_SAMURAI...').last()).toBeVisible({ timeout: 20000 });
  await expect(page.locator('text=WAKE_UP_SAMURAI...').last()).not.toBeVisible({ timeout: 20000 });

  // Now, find and double-click the "FINANCE" icon.
  const financeIcon = page.locator('button', { hasText: 'FINANCE' });
  await financeIcon.dblclick();

  // The tab bar should now be visible. We can use a selector that targets the parent div of the tabs.
  const tabBar = page.locator('div.flex.bg-black.border.border-gray-800');
  await expect(tabBar).toBeVisible({ timeout: 20000 });

  // Click the "PRO_TOOLS" tab
  const proToolsTab = page.locator('button:has-text("PRO_TOOLS")');
  await proToolsTab.click();

  // Verify that the "Pro Tools" content is visible
  await expect(page.locator('text="Tax Tagging"')).toBeVisible();
  await expect(page.locator('text="Mileage Tracker"')).toBeVisible();

  // Capture a screenshot
  await page.screenshot({ path: '/home/jules/verification/pro-tools-feature.png' });
});
