
from playwright.sync_api import Page, expect, sync_playwright

def verify_mobile_and_palette(page: Page):
    page.on("console", lambda msg: print(f"Browser Log: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Browser Error: {err}"))

    # --- 1. MOBILE EXPERIENCE ---
    print("Testing Mobile Experience...")

    # Set Viewport to Mobile
    page.set_viewport_size({"width": 390, "height": 844}) # iPhone 12 Pro

    page.goto("http://localhost:5173")

    # Wait for boot
    print("Waiting for boot...")
    try:
        # Wait for either Desktop Finance button (Draggable) or Mobile Finance button (Grid)
        page.wait_for_selector("button", timeout=30000) # Wait for ANY button first

        # Check specifically for FINANCE
        page.wait_for_selector("button:has-text('FINANCE')", timeout=30000)
        print("Boot complete. FINANCE button found.")
    except Exception as e:
        print(f"Timeout waiting for App Grid: {e}")
        page.screenshot(path="verification/mobile_boot_fail.png")
        return

    # Verify Grid Layout (should be a button with class 'aspect-square')
    finance_btn = page.locator("button:has-text('FINANCE')").first
    expect(finance_btn).to_be_visible()

    # Check that Start Menu button is hidden
    if page.locator("button:has-text('START')").is_visible():
        print("FAIL: Start button should be hidden on mobile.")
    else:
        print("PASS: Start button hidden.")

    # Open App
    print("Opening Finance App...")
    finance_btn.click(force=True)
    page.wait_for_timeout(2000)

    # Check Window dimensions
    window = page.locator("div.backdrop-blur-md").first # WindowFrame class
    if window.count() == 0:
        print("FAIL: No window found.")
        page.screenshot(path="verification/window_fail.png")
    else:
        box = window.bounding_box()
        print(f"Window Box: {box}")

        if box['width'] >= 250:
            print("PASS: Window is full width (roughly).")
        else:
            print(f"FAIL: Window width is {box['width']}, expected > 250")

        # Close Window (X button)
        # page.locator("button:has(svg.lucide-x)").click()
        # page.wait_for_timeout(500)

    # --- 2. COMMAND PALETTE (Desktop View) ---
    print("Testing Command Palette...")

    # Switch back to Desktop
    page.set_viewport_size({"width": 1280, "height": 720})
    page.reload()

    # Wait for boot again
    page.wait_for_selector("button:has-text('START')", timeout=30000)

    # Press Cmd+K
    page.keyboard.press("Control+k")
    page.wait_for_timeout(1000)

    # Check Palette Visibility
    palette = page.get_by_placeholder("BREACH_PROTOCOL_V.5.0...")
    if palette.is_visible():
        print("PASS: Command Palette opened.")

        # Search for "Stealth"
        palette.fill("Stealth")
        page.wait_for_timeout(500)

        # Click "TOGGLE STEALTH MODE"
        page.get_by_text("TOGGLE STEALTH MODE").click()

        # Palette should close
        page.wait_for_timeout(500)
        if not palette.is_visible():
            print("PASS: Command Palette closed after action.")
        else:
            print("FAIL: Command Palette stayed open.")
    else:
        print("FAIL: Command Palette did not open.")
        page.screenshot(path="verification/palette_fail.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_mobile_and_palette(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
