Feature: Edit an existing invoice

  As an accountant
  I want to edit the details of an existing invoice
  So that I can correct or complete information before sending it

Scenario: 1. User edits a draft invoice and submits it
  Given there is an invoice with status "draft"
  When the user click "Edit" button on detail page
  And invoice floating form should slide out from left
  And all field must be populated with existing data
  And fills in all required fields
  And clicks "Save Changes"
  Then the invoice status should be updated to "pending"
  And the changes should be saved

Scenario: 2. User discard editing an invoice
  Given the user is editing an invoice
  And some fields have been changed
  When the user clicks "Discard"
  Then the form should slide in
  And remains in same page
  And the invoice should not be saved
