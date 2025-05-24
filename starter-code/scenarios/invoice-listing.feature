Feature: Manage and view invoices

  As an accountant
  I want to see a list of all invoices
  So that I can review them, filter them by status, and create new ones

Scenario: 1. User views the list of invoices
  Given there are 5 invoices in the system
  When the user visits the "/invoices" page
  Then they should see a table with 5 invoice rows
  And the total invoice count should display "5 Invoices"

Scenario: 2. User filters invoices by status
  Given there are invoices with statuses: draft, pending, and paid
  When the user selects "pending" from the filter dropdown
  Then only invoices with status "pending" should be shown in the table
  And the total invoice count should update accordingly

Scenario: 3. User clicks the New Invoice button
  Given the user is on the "/invoices" page
  When the user clicks the "New Invoice" button
  Then new invoice floating form should slide out from left

Scenario: 4. No invoices in the system
  Given there are no invoices in the system
  When the user visits the "/invoices" page
  Then they should see a message that says "No invoices available"
  And the New Invoice button should still be visible
  And filter by status option should be hidden
