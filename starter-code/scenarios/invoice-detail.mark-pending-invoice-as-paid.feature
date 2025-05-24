Feature: Mark pending invoice as paid

  As an accountant
  I want to update a pending invoice as paid
  So that I can track payment status accurately

Scenario: User marks a pending invoice as paid
  Given there is an invoice with status "pending"
  When the user clicks the "Mark as Paid" button
  Then the invoice status should be updated to "paid"
  And the status badge in the list should reflect "Paid"
