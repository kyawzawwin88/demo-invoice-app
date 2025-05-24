from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_save_invoice_as_draft(browser):
    # Navigate to homepage
    browser.get('http://localhost:3000')
    
    # Wait for and click "New Invoice" button
    new_invoice_btn = WebDriverWait(browser, 10).until(
      EC.element_to_be_clickable((By.XPATH, "//button/label[contains(text(), 'New Invoice')]"))
    )
    new_invoice_btn.click()
    
    time.sleep(0.5)

    # # Wait for form to slide out and "Save as Draft" button to be visible
    save_draft_btn = WebDriverWait(browser, 10).until(
      EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='save-as-draft-button']"))
    )

    browser.execute_script("arguments[0].scrollIntoView(true);", save_draft_btn)

    # # Click "Save as Draft" without filling any fields
    save_draft_btn.click()
    
    # # Wait for form to slide back in
    WebDriverWait(browser, 10).until(
      EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='save-as-draft-button']"))
    )
    
    # Verify we remain on same page by checking URL
    assert browser.current_url == 'http://localhost:3000/'
