
from playwright.sync_api import Page, expect, sync_playwright
import json

def verify_approval(page: Page):
    # --- SETUP NETWORK INTERCEPTION ---
    def handle_gemini(route):
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
    page.set_viewport_size({"width": 1280, "height": 720})
    page.goto("http://localhost:5173")

    try:
        page.wait_for_selector("button:has-text('START')", timeout=20000)
    except:
        print("Timeout waiting for START button.")
        return

    # Create dummy file
    with open("verification/approval_receipt.jpg", "wb") as f:
        f.write(b"\xFF\xD8\xFF" + b"\x00" * 100)

    # Upload file
    print("Uploading file...")
    upload_input = page.locator("input[type='file']").first
    upload_input.set_input_files("verification/approval_receipt.jpg")

    # Wait for Pending Approval notification
    try:
        expect(page.get_by_text("TRANSACTION PENDING APPROVAL")).to_be_visible(timeout=10000)
        print("PASS: Approval Notification appeared.")
    except:
        print("FAIL: Approval Notification did not appear.")
        return

    # Go to Finance App
    print("Opening Finance App...")
    page.locator("button:has-text('FINANCE')").first.dblclick()
    page.wait_for_timeout(2000)

    # Check for Pending Approval status
    pending_label = page.get_by_text("Pending Approval").first
    if pending_label.is_visible():
        print("PASS: Transaction is Pending.")
    else:
        print("FAIL: Transaction not pending.")

    # Check for Approve Button ("APP")
    approve_btn = page.locator("button:has-text('APP')").first
    if approve_btn.is_visible():
        print("PASS: Approve button is visible.")
        approve_btn.click()
        page.wait_for_timeout(1000)

        # Check if status changed to "Posted"
        if page.get_by_text("Posted").first.is_visible():
             print("PASS: Transaction Approved and Posted.")
        else:
             print("FAIL: Transaction not posted after approval.")
    else:
        print("FAIL: Approve button not visible.")

    page.screenshot(path="verification/approval_workflow_pass.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_approval(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
