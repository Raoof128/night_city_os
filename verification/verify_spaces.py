
from playwright.sync_api import Page, expect, sync_playwright

def verify_shared_spaces(page: Page):
    # 1. Arrange: Go to the app.
    page.goto("http://localhost:5173")

    # 2. Wait for boot sequence
    # Wait for the "START" button to appear.
    try:
        page.wait_for_selector("button:has-text('START')", timeout=20000)
    except:
        print("Timeout waiting for START button. Taking screenshot.")
        page.screenshot(path="verification/boot_timeout.png")
        return

    # 3. Open Financial Tracker
    # Double click the "FINANCE" icon on desktop.
    # Use a more specific selector to avoid ambiguity.
    finance_desktop_icon = page.locator("button:has-text('FINANCE')").first
    finance_desktop_icon.dblclick()

    page.wait_for_timeout(2000)

    # 4. Verify Space Switcher
    # Look for "PERSONAL SPACE"
    # Wait for it to be visible
    try:
        expect(page.get_by_text("PERSONAL SPACE")).to_be_visible(timeout=5000)
    except:
        print("Could not find Personal Space switcher. Taking screenshot.")
        page.screenshot(path="verification/switcher_missing.png")
        return

    # Click to open dropdown
    page.get_by_text("PERSONAL SPACE").click()
    page.wait_for_timeout(500)

    # Take screenshot of dropdown
    page.screenshot(path="verification/spaces_dropdown.png")

    # 5. Open Goals Tab
    page.get_by_text("GOALS").click()
    page.wait_for_timeout(1000)
    expect(page.get_by_text("SHARED_GOALS")).to_be_visible()
    page.screenshot(path="verification/goals_tab.png")

    # 6. Verify Shopping List (in Assets)
    page.get_by_text("ASSETS").click()
    page.wait_for_timeout(1000)
    expect(page.get_by_text("SHARED_SHOPPING_LIST")).to_be_visible()
    page.screenshot(path="verification/shopping_list.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_shared_spaces(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
