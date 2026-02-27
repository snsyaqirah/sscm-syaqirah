import { useState } from "react";
import type { Charge, PaymentHistoryEntry } from "@/types/charge";
import { mockCharges } from "@/data/mockCharges";

export function useCharges() {
  const [charges, setCharges] = useState<Charge[]>(mockCharges);

  const addCharge = (charge: Charge) => {
    // Add initial payment history entry
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const outstanding = charge.charge_amount - charge.paid_amount;
    
    const chargeWithHistory: Charge = {
      ...charge,
      payment_history: [
        {
          date: now,
          amount_paid: charge.paid_amount,
          outstanding_after: outstanding,
          payment_type: charge.paid_amount === 0 ? "initial" : 
                       charge.paid_amount >= charge.charge_amount ? "full" : "partial",
          notes: charge.paid_amount === 0 ? "Charge created" : 
                 charge.paid_amount >= charge.charge_amount ? "Full payment received" : "Initial partial payment"
        }
      ]
    };
    setCharges((prev) => [...prev, chargeWithHistory]);
  };

  const updateCharge = (chargeId: string, updatedCharge: Charge) => {
    setCharges((prev) =>
      prev.map((charge) => {
        if (charge.charge_id === chargeId) {
          const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
          // Use the provided payment date if available, otherwise use now
          const paymentDateStr = updatedCharge.payment_date
            ? `${updatedCharge.payment_date} 00:00:00`
            : now;
          
          if (charge.paid_amount !== updatedCharge.paid_amount) {
            const paymentDifference = updatedCharge.paid_amount - charge.paid_amount;
            const outstandingAfter = updatedCharge.charge_amount - updatedCharge.paid_amount;
            
            // Only add history entry if payment INCREASED (actual new payment)
            // Ignore decreases (corrections/mistakes)
            if (paymentDifference > 0) {
              const newEntry: PaymentHistoryEntry = {
                date: paymentDateStr,
                amount_paid: paymentDifference, // Individual payment amount
                outstanding_after: outstandingAfter, // Outstanding after this payment
                payment_type: updatedCharge.paid_amount >= updatedCharge.charge_amount ? "full" : "partial",
                notes: outstandingAfter === 0 
                  ? "Final payment received - fully paid" 
                  : `Payment received - RM${outstandingAfter.toFixed(2)} remaining`
              };
              
              return {
                ...updatedCharge,
                payment_history: [...(charge.payment_history || []), newEntry]
              };
            } else {
              // Payment decreased (correction) - just update without history entry
              return {
                ...updatedCharge,
                payment_history: charge.payment_history
              };
            }
          }
          
          if (charge.charge_amount !== updatedCharge.charge_amount) {
            const outstandingAfter = updatedCharge.charge_amount - updatedCharge.paid_amount;
            const newEntry: PaymentHistoryEntry = {
              date: now,
              amount_paid: 0,
              outstanding_after: outstandingAfter,
              payment_type: updatedCharge.paid_amount >= updatedCharge.charge_amount ? "full" : "partial",
              notes: `Charge amount updated from RM${charge.charge_amount.toFixed(2)} to RM${updatedCharge.charge_amount.toFixed(2)}`
            };
            
            return {
              ...updatedCharge,
              payment_history: [...(charge.payment_history || []), newEntry]
            };
          }
          
          return {
            ...updatedCharge,
            payment_history: charge.payment_history
          };
        }
        return charge;
      })
    );
  };

  const deleteCharge = (chargeId: string) => {
    setCharges((prev) => prev.filter((charge) => charge.charge_id !== chargeId));
  };

  const getChargeById = (chargeId: string) => {
    return charges.find((charge) => charge.charge_id === chargeId);
  };

  return {
    charges,
    addCharge,
    updateCharge,
    deleteCharge,
    getChargeById,
  };
}
