Feature: Create a new invoice

  As an accountant
  I want to create a new invoice with client and item details
  So that I can bill clients and track payments

Scenario: 1. Show new invoice form
  When the user clicks the "New Invoice" button
  Then new invoice floating form should slide out from left
  And all field must be reset

Scenario: 2. Save a draft invoice with incomplete form
  Given the user is on the new invoice form
  And only the invoice description and one item are filled
  When the user clicks "Save as Draft"
  Then 6 alpha numeric unique invoice ID should be generated
  And the invoice should be saved with status "draft"
  And the form should slide in
  And remains in same page

Scenario: 3. Submit a complete invoice as pending
  Given the user fills out all required fields in the form
  And selects a payment term of 7 days
  When the user clicks "Save & Send"
  Then 6 alpha numeric unique invoice ID should be generated
  And the invoice should be saved with status "pending"
  And the payment due date should be createdAt + 7 days
  And the form should slide in
  And remains in same page

Scenario: 4. Form shows errors when required fields are missing
  Given the user is on the new invoice form
  When the user clicks "Save & Send" without filling required fields
  Then validation error messages should be shown
  And the invoice should not be submitted

Scenario: 5. User discard invoice creation
  Given the user is on the new invoice form
  And some fields have been filled
  When the user clicks "Discard"
  And the form should slide in
  And remains in same page
  And the invoice should not be saved
