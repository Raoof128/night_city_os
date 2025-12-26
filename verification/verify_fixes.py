
from playwright.sync_api import Page, expect, sync_playwright
import json
import os

def verify_fixes(page: Page):
    # --- SETUP NETWORK INTERCEPTION ---
    def handle_gemini(route):
        print(f"Intercepted request to: {route.request.url}")
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "candidates": [{
                    "content": {
                        "parts": [{
                            "text": json.dumps({
                                "amount": 5000,
                                "summary": "Mega Arasaka Gear",
                                "category": "Cyberware"
                            })
                        }]
                    }
                }]
            })
        )

    page.route("**/generativelanguage.googleapis.com/**", handle_gemini)

    # --- START APP ---
    print("Loading app...")
    page.goto("http://localhost:5173")

    # Wait for boot
    try:
        page.wait_for_selector("button:has-text('START')", timeout=20000)
    except:
        print("Timeout waiting for START button.")
        return

    # --- 1. VERIFY CHALLENGES & SPLIT BUTTON ---
    print("Verifying UI fixes...")
    finance_icon = page.locator("button:has-text('FINANCE')").first
    finance_icon.dblclick()
    page.wait_for_timeout(2000)

    # Go to Analytics (Challenges are there)
    page.get_by_text("ANALYTICS").click()
    page.wait_for_timeout(1000)

    # Check for Challenges Widget - Use exact match or heading role
    if page.get_by_role("heading", name="ACTIVE_CHALLENGES").is_visible():
        print("PASS: Challenges Widget Header is visible.")
    else:
        print("FAIL: Challenges Widget Header not found.")

    page.screenshot(path="verification/challenges_check.png")

    # Go to Transactions to check Split Button
    page.get_by_text("TRANSACTIONS").click()
    page.wait_for_timeout(1000)

    # Check split buttons count.
    page.screenshot(path="verification/transactions_check.png")
    print("Transactions screenshot taken.")

    # --- 2. VERIFY APPROVAL WORKFLOW ---
    print("Verifying Approval Workflow...")

    # Create a dummy image file
    with open("verification/test_receipt.jpg", "wb") as f:
        f.write(b"\xFF\xD8\xFF" + b"\x00" * 100) # Pseudo JPG header

    # Find the file input in the DesktopUploadWidget
    upload_input = page.locator("input[type='file']").first
    upload_input.set_input_files("verification/test_receipt.jpg")

    print("File uploaded. Waiting for processing...")

    # Wait for processing
    try:
        expect(page.get_by_text("TRANSACTION PENDING APPROVAL")).to_be_visible(timeout=5000)
        print("PASS: Approval Notification appeared.")
    except:
        print("FAIL: Approval Notification did not appear.")
        page.screenshot(path="verification/approval_fail.png")

    # Verify it appears in Transaction List as Pending
    # Ensure we are on the transactions tab
    # page.get_by_text("TRANSACTIONS").click() # We are already there?
    # But the app might have re-rendered or we need to refresh the view?
    # The app state updates automatically.

    page.wait_for_timeout(2000)

    try:
        expect(page.get_by_text("Pending Approval")).to_be_visible()
        print("PASS: Transaction marked as Pending Approval.")
    except:
        print("FAIL: 'Pending Approval' status not found in list.")

    page.screenshot(path="verification/final_state.png")

    # Cleanup
    if os.path.exists("verification/test_receipt.jpg"):
        os.remove("verification/test_receipt.jpg")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_fixes(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
