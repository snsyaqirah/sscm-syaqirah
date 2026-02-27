export interface PaymentHistoryEntry {
  date: string; // ISO 8601 format (YYYY-MM-DD HH:MM:SS)
  amount_paid: number; // Amount paid in THIS transaction (not cumulative)
  outstanding_after: number; // Outstanding balance AFTER this payment
  payment_type: "initial" | "partial" | "full";
  notes?: string;
}

export interface Charge {
  charge_id: string;
  charge_amount: number;
  paid_amount: number;
  student_id: string;
  date_charged: string; // ISO 8601 format (YYYY-MM-DD)
  payment_history?: PaymentHistoryEntry[]; // Optional for backward compatibility
  payment_date?: string; // Used only during form submission in edit mode (date the payment was actually made)
}

export interface ChargeFormData {
  charge_amount: string;
  paid_amount: string;
  student_id: string;
  date_charged: string;
}
