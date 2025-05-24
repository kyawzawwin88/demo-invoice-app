Feature: View audit log for an invoice

  As an accountant
  I want to see a history of changes made to an invoice
  So that I can understand what was modified and when

Scenario: 1. User views audit log of an invoice
  Given the user is viewing an invoice that has been edited
  When the user opens the "Audit Log" button
  Then they should see modal popup with audit log
  And each log entry should show:
    | message                                        | action_type   | Timestamp  |
    | You’ve created new draft invoice               | created       | 2024-01-10 14:05:00 |
    | You’ve marked pending invoice INV-123 as paid  | mark_as_paid  | 2024-01-10 14:05:00 |

Scenario: 2. Invoice has no audit log entries
  Given the user is viewing an invoice that has not been edited
  When the user opens the "Audit Log" section
  Then they should see a message saying "No activity recorded yet"
  