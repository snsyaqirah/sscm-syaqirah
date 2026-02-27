# Swim School Charge Management System

A frontend charge recording interface for swim school administrators. Built as part of the Supersharkz Full-Stack Developer assessment.

## How to Run

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173/`

Requires Node.js v18+. No environment variables or backend setup needed.

---

## Assumptions, Trade-offs, and Next Steps

**Assumptions made:**
- All amounts are in Malaysian Ringgit (RM)
- Student IDs are managed externally — this system only references them
- Charges cannot be posted with a future date (would be a data entry error in a real context)
- Data is session-only; resetting on refresh is acceptable given the mock data constraint

**Trade-offs chosen:**
- Modal-based editing over inline editing — adds one extra click but keeps validation feedback contained and errors easier to read for non-technical staff
- `useState` in a custom hook over Context/Redux — sufficient for a single-page scope and keeps the code straightforward to follow
- Student names displayed alongside IDs (sourced from a local lookup) — small deviation from the base schema but meaningfully reduces admin errors when identifying records

**What I would improve next:**
- Connect to a real API and replace session state with persistent storage
- Add column sorting and date range filtering on the charge list
- Show a family-level view that groups charges by student for a clearer account picture

---

## UX Reflection

**Three realistic mistakes a non-technical admin might make, and how the UI addresses them:**

**1. Entering the paid amount as the charge total instead of what was actually collected**

An admin recording a RM150 charge where only RM50 was paid might type 150 in the paid amount out of habit. The form validates that paid amount cannot exceed charge amount and shows the outstanding balance in a live preview so the admin can see the resulting numbers before submitting.

**2. Accidentally editing the wrong student's charge**

When the table has many rows, clicking Edit on the wrong row is easy. The edit dialog opens with the charge ID and student name visible at the top so the admin can confirm they have the right record before making any changes.

**3. Posting a charge with the wrong date**

Backdating is common when recording charges after the fact, but a typo (wrong month or year) is easy to miss. The date field caps at today to block future dates, defaults to today for new records so it is only touched when intentional, and shows an inline error if the value is invalid.

---

## Deletion Handling

The delete button opens a confirmation dialog before any data is removed. The dialog shows the full charge record — ID, student name, charge amount, paid amount, and outstanding balance — so the admin can verify they have the right record. If the charge has an unpaid balance, a warning calls that out explicitly, since removing a charge with outstanding amount is a more consequential action.

The confirm button is labeled "Delete Charge" (not just "Confirm") and styled in red. The cancel button is the default focus so pressing Enter or Escape without reading defaults to the safe path.

The reason for this approach over something like a soft-delete or undo toast is simplicity — non-technical staff are less likely to understand or trust an undo mechanism, and a clear confirmation step is easier to explain and reason about.
