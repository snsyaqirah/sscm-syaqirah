import type { Charge } from "@/types/charge";

export const mockCharges: Charge[] = [
  {
    charge_id: "chg_001",
    charge_amount: 120.00,
    paid_amount: 0.00,
    student_id: "stu_101",
    date_charged: "2025-01-05",
    payment_history: [
      {
        date: "2025-01-05 10:30:00",
        amount_paid: 0.00,
        outstanding_after: 120.00,
        payment_type: "initial",
        notes: "Charge created"
      }
    ]
  },
  {
    charge_id: "chg_002",
    charge_amount: 80.50,
    paid_amount: 80.50,
    student_id: "stu_102",
    date_charged: "2025-01-07",
    payment_history: [
      {
        date: "2025-01-07 09:15:00",
        amount_paid: 0.00,
        outstanding_after: 80.50,
        payment_type: "initial",
        notes: "Charge created"
      },
      {
        date: "2025-01-07 14:20:00",
        amount_paid: 80.50,
        outstanding_after: 0.00,
        payment_type: "full",
        notes: "Final payment received - fully paid"
      }
    ]
  },
  {
    charge_id: "chg_003",
    charge_amount: 150.00,
    paid_amount: 50.00,
    student_id: "stu_101",
    date_charged: "2025-01-12",
    payment_history: [
      {
        date: "2025-01-12 11:00:00",
        amount_paid: 0.00,
        outstanding_after: 150.00,
        payment_type: "initial",
        notes: "Charge created"
      },
      {
        date: "2025-01-15 16:45:00",
        amount_paid: 30.00,
        outstanding_after: 120.00,
        payment_type: "partial",
        notes: "Payment received - RM120.00 remaining"
      },
      {
        date: "2025-01-18 10:30:00",
        amount_paid: 20.00,
        outstanding_after: 100.00,
        payment_type: "partial",
        notes: "Payment received - RM100.00 remaining"
      }
    ]
  },
  {
    charge_id: "chg_004",
    charge_amount: 90.00,
    paid_amount: 90.00,
    student_id: "stu_103",
    date_charged: "2025-01-15",
    payment_history: [
      {
        date: "2025-01-15 13:20:00",
        amount_paid: 0.00,
        outstanding_after: 90.00,
        payment_type: "initial",
        notes: "Charge created"
      },
      {
        date: "2025-01-16 10:00:00",
        amount_paid: 45.00,
        outstanding_after: 45.00,
        payment_type: "partial",
        notes: "Payment received - RM45.00 remaining"
      },
      {
        date: "2025-01-18 14:30:00",
        amount_paid: 45.00,
        outstanding_after: 0.00,
        payment_type: "full",
        notes: "Final payment received - fully paid"
      }
    ]
  },
  {
    charge_id: "chg_005",
    charge_amount: 200.00,
    paid_amount: 200.00,
    student_id: "stu_104",
    date_charged: "2025-01-20",
    payment_history: [
      {
        date: "2025-01-20 08:00:00",
        amount_paid: 0.00,
        outstanding_after: 200.00,
        payment_type: "initial",
        notes: "Charge created"
      },
      {
        date: "2025-01-22 09:30:00",
        amount_paid: 100.00,
        outstanding_after: 100.00,
        payment_type: "partial",
        notes: "Payment received - RM100.00 remaining"
      },
      {
        date: "2025-01-25 10:00:00",
        amount_paid: 100.00,
        outstanding_after: 0.00,
        payment_type: "full",
        notes: "Final payment received - fully paid"
      }
    ]
  }
];
