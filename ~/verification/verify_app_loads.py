
from playwright.sync_api import Page, expect, sync_playwright

def verify_app_loads(page: Page):
  """
  This test verifies that the main application loads by checking for the
  presence of the "FINANCE_OS" header.
  """
  # 1. Arrange: Go to the application homepage.
  page.goto("http://localhost:5173")

  # 2. Assert: Wait for the main application to load by looking for the header.
  expect(page.get_by_text("FINANCE_OS")).to_be_visible(timeout=30000)

  print("Application loaded successfully.")

if __name__ == "__main__":
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    try:
      verify_app_loads(page)
    finally:
      browser.close()
