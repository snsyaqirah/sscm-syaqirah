import type { ChargeFormData } from "@/types/charge";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateChargeForm(data: ChargeFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  const chargeAmount = parseFloat(data.charge_amount);
  if (!data.charge_amount || isNaN(chargeAmount)) {
    errors.push({ field: "charge_amount", message: "Charge amount is required and must be a valid number" });
  } else if (chargeAmount <= 0) {
    errors.push({ field: "charge_amount", message: "Charge amount must be greater than 0" });
  } else if (chargeAmount > 999999.99) {
    errors.push({ field: "charge_amount", message: "Charge amount cannot exceed RM999,999.99" });
  }

  const paidAmount = parseFloat(data.paid_amount);
  if (!data.paid_amount || isNaN(paidAmount)) {
    errors.push({ field: "paid_amount", message: "Paid amount is required and must be a valid number" });
  } else if (paidAmount < 0) {
    errors.push({ field: "paid_amount", message: "Paid amount cannot be negative" });
  } else if (!isNaN(chargeAmount) && paidAmount > chargeAmount) {
    errors.push({ field: "paid_amount", message: "Paid amount cannot exceed charge amount" });
  }

  if (!data.student_id || data.student_id.trim() === "") {
    errors.push({ field: "student_id", message: "Student is required" });
  }

  if (!data.date_charged) {
    errors.push({ field: "date_charged", message: "Date charged is required" });
  } else {
    const chargedDate = new Date(data.date_charged);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(chargedDate.getTime())) {
      errors.push({ field: "date_charged", message: "Invalid date format" });
    } else if (chargedDate > today) {
      errors.push({ field: "date_charged", message: "Date charged cannot be in the future" });
    }
  }

  return errors;
}

// Validates an incremental payment — newPayment is the amount being paid right now, not the running total
export function validateNewPayment(
  newPayment: string,
  alreadyPaid: number,
  chargeAmount: number
): ValidationError[] {
  const errors: ValidationError[] = [];
  const payment = parseFloat(newPayment);

  if (newPayment.trim() === "" || isNaN(payment)) {
    errors.push({ field: "new_payment", message: "Payment amount is required and must be a valid number" });
    return errors;
  }

  if (payment <= 0) {
    errors.push({ field: "new_payment", message: "Payment amount must be greater than 0" });
  }

  const remaining = chargeAmount - alreadyPaid;
  if (payment > remaining) {
    errors.push({ field: "new_payment", message: `Payment cannot exceed outstanding balance of RM${remaining.toFixed(2)}` });
  }

  return errors;
}
