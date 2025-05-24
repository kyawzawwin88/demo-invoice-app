Feature: Delete an invoice

  As an accountant
  I want to delete an invoice I no longer need
  So that my records stay clean and accurate

Scenario: 1. User deletes a draft invoice
  Given there is an invoice with status "draft"
  When the user clicks the "Delete" button
  And confirms the deletion in the modal
  Then the invoice status should be updated to "deleted"
  And the user should see a success message
  And the invoice list should no longer show that invoice

Scenario: 2. User attempts to delete a paid invoice
  Given there is an invoice with status "paid"
  When the user should see disable deletion
  Then the invoice should remain in the system

Scenario: 3. User opens the delete confirmation modal but cancels
  Given the user is viewing an invoice
  When the user clicks the "Delete" button
  And then clicks "Cancel" in the confirmation modal
  Then the invoice should not be deleted
  And the user should return to the invoice view unchanged
