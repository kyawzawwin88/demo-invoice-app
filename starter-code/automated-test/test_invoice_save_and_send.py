from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_save_and_send_invoice(browser):
    # Navigate to homepage
    browser.get('http://localhost:3000')
    
    # Wait for and click "New Invoice" button
    new_invoice_btn = WebDriverWait(browser, 10).until(
      EC.element_to_be_clickable((By.XPATH, "//button/label[contains(text(), 'New Invoice')]"))
    )
    new_invoice_btn.click()
    
    time.sleep(0.5)

    # Fill sender address
    browser.find_element(By.CSS_SELECTOR, "[data-testid='bill-from-section'] input[aria-label='Street Address']").send_keys("123 Main St")
    browser.find_element(By.CSS_SELECTOR, "[data-testid='bill-from-section'] input[aria-label='City']").send_keys("London")
    browser.find_element(By.CSS_SELECTOR, "[data-testid='bill-from-section'] input[aria-label='Post Code']").send_keys("SW1A 1AA")
    browser.find_element(By.CSS_SELECTOR, "[data-testid='bill-from-section'] input[aria-label='Country']").send_keys("United Kingdom")

    # # Fill client details
    browser.find_element(By.CSS_SELECTOR, "[data-testid='clientName']").send_keys("John Smith")
    browser.find_element(By.CSS_SELECTOR, "[data-testid='clientEmail']").send_keys("john@example.com")

    # # Fill client address
    browser.find_element(By.CSS_SELECTOR, "[data-testid='bill-to-section'] input[aria-label='Street Address']").send_keys("456 Client Road")
    browser.find_element(By.CSS_SELECTOR, "[data-testid='bill-to-section'] input[aria-label='City']").send_keys("Manchester")
    browser.find_element(By.CSS_SELECTOR, "[data-testid='bill-to-section'] input[aria-label='Post Code']").send_keys("M1 1AA")
    browser.find_element(By.CSS_SELECTOR, "[data-testid='bill-to-section'] input[aria-label='Country']").send_keys("United Kingdom")
    
    # # Fill invoice details
    browser.find_element(By.CSS_SELECTOR, "input[type='date']").send_keys("15012024")
    
    # # Select payment terms
    payment_terms = WebDriverWait(browser, 10).until(
      EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='paymentTerms']"))
    )
    payment_terms.click()
    
    seven_days = WebDriverWait(browser, 10).until(
      EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Net 7 Days')]"))
    )
    seven_days.click()

    browser.find_element(By.CSS_SELECTOR, "[data-testid='projectDescription']").send_keys("Website Development")

    # # Add first item
    browser.find_element(By.CSS_SELECTOR, "[data-testid='add-new-item-button']").click()
    item_inputs = browser.find_elements(By.CSS_SELECTOR, "[data-testid='invoice-item-list'] input")
    item_inputs[0].send_keys("Homepage Design")  # Name
    item_inputs[1].send_keys("2")               # Quantity
    item_inputs[2].send_keys("500")            # Price

    # # Add second item
    browser.find_element(By.CSS_SELECTOR, "[data-testid='add-new-item-button']").click()
    item_inputs = browser.find_elements(By.CSS_SELECTOR, "[data-testid='invoice-item-list'] input")
    item_inputs[3].send_keys("Backend Development")  # Name
    item_inputs[4].send_keys("1")                    # Quantity
    item_inputs[5].send_keys("1000")                 # Price

    # # Click Save & Send
    save_send_btn = WebDriverWait(browser, 10).until(
      EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='save-and-send-button']"))
    )

    browser.execute_script("arguments[0].scrollIntoView(true);", save_send_btn)

    # # Click "Save as Draft" without filling any fields
    save_send_btn.click()

    time.sleep(0.5)
    
    # Verify we remain on same page
    assert browser.current_url == 'http://localhost:3000/'
