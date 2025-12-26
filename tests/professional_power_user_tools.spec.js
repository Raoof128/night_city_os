
import { test, expect } from '@playwright/test';

test('Professional Power User Tools tab is visible and clickable', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Wait for the boot screen to finish by waiting for a known desktop element
  await page.waitForSelector('text=FINANCE', { timeout: 20000 });

  // Click the FINANCE icon on the desktop to open the app
  await page.click('text=FINANCE');

  // Take a screenshot to see the state after clicking the icon
  await page.screenshot({ path: '/home/jules/verification/after_finance_click_debug.png' });

  // Wait for the FinancialTracker app to open and the tab bar to be visible, with an increased timeout
  await page.waitForSelector('[data-testid="tab-bar"]', { timeout: 20000 });

  // Now that the app is loaded, click the PRO_TOOLS tab
  const proToolsTab = page.locator('[data-testid="PRO_TOOLS"]');
  await proToolsTab.click();

  // Verify that the Pro Tools content is now visible
  const proToolsContent = page.locator('text="Export to CSV"');
  await expect(proToolsContent).toBeVisible();

  // Capture a screenshot for final verification
  await page.screenshot({ path: '/home/jules/verification/pro_tools_tab_visible.png' });
});
