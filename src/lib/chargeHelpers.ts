import type { Charge } from "@/types/charge";

export function calculateOutstanding(charge: Charge): number {
  return charge.charge_amount - charge.paid_amount;
}

export function formatCurrency(amount: number): string {
  return `RM${amount.toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function generateChargeId(existingCharges: { charge_id: string }[] = []): string {
  // Extract all charge numbers from existing charges
  const chargeNumbers = existingCharges
    .map(charge => {
      const match = charge.charge_id.match(/^chg_(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => num > 0);
  
  // Find the highest number and add 1
  const nextNumber = chargeNumbers.length > 0 ? Math.max(...chargeNumbers) + 1 : 1;
  
  // Format with leading zeros (001, 002, etc.)
  return `chg_${String(nextNumber).padStart(3, '0')}`;
}
