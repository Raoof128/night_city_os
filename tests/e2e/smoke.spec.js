import { test, expect } from '@playwright/test';

test.describe('Night City OS Smoke Tests', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for boot sequence to finish and START button to appear
        // Boot takes ~4-5s, giving it 15s to be safe
        await page.locator('button:has-text("START")').waitFor({ state: 'visible', timeout: 15000 });
    });

    test('should boot to desktop and show taskbar', async ({ page }) => {
        await expect(page.locator('button:has-text("START")')).toBeVisible();
        await expect(page.locator('text=CONNECTED')).toBeVisible();
    });

    test('should open Calculator app', async ({ page }) => {
        // Double click CALC icon
        const calcIcon = page.locator('text=CALC').first();
        await calcIcon.dblclick();

        // Check window appears
        await expect(page.locator('text=CALCULATOR').first()).toBeVisible();
        
        // Check calculation logic
        await page.click('button:has-text("7")');
        await page.click('button:has-text("*")'); // Multiplication is *
        await page.click('button:has-text("6")');
        await page.click('button:has-text("=")');
        
        await expect(page.locator('text=42')).toBeVisible();
    });

    test('should persist window state after reload', async ({ page }) => {
        // Open Terminal
        await page.locator('text=TERMINAL').first().dblclick();
        await expect(page.locator('text=TERMINAL').first()).toBeVisible();

        // Reload
        await page.reload();
        // Wait for boot again
        await page.locator('button:has-text("START")').waitFor({ state: 'visible', timeout: 15000 });

        // Terminal should be open again
        await expect(page.locator('text=TERMINAL').first()).toBeVisible();
    });
});