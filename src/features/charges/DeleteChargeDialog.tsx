import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Charge } from "@/types/charge";
import { formatCurrency, calculateOutstanding } from "@/lib/chargeHelpers";
import { formatStudentDisplay } from "@/data/students";

interface DeleteChargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  charge: Charge | null;
  onConfirm: () => void;
}

export function DeleteChargeDialog({
  open,
  onOpenChange,
  charge,
  onConfirm,
}: DeleteChargeDialogProps) {
  if (!charge) return null;

  const outstanding = calculateOutstanding(charge);
  const hasOutstanding = outstanding > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-red-600">Permanently Delete Charge Record?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p className="text-base font-medium">
                You are about to permanently delete this financial record. This action <span className="underline font-bold">cannot be undone</span>.
              </p>
              
              <div className="rounded-md bg-gray-100 border-2 border-gray-300 p-4 space-y-2 text-sm">
                <p className="font-bold text-gray-900 mb-2">Record Details:</p>
                <div className="flex justify-between">
                  <span className="font-medium">Charge ID:</span>
                  <span className="font-mono font-bold">{charge.charge_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Student:</span>
                  <span className="font-bold">{formatStudentDisplay(charge.student_id)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Charge Amount:</span>
                  <span className="font-mono">{formatCurrency(charge.charge_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Paid Amount:</span>
                  <span className="font-mono">{formatCurrency(charge.paid_amount)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-gray-300 pt-2 mt-2">
                  <span className="font-bold">Outstanding Balance:</span>
                  <span className={`font-mono font-bold text-lg ${hasOutstanding ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(outstanding)}
                  </span>
                </div>
              </div>

              {hasOutstanding && (
                <div className="rounded-md bg-red-50 border-2 border-red-300 p-4">
                  <p className="text-sm font-bold text-red-800">
                    <strong>Financial Warning:</strong> This charge has an unpaid balance of {formatCurrency(outstanding)}. 
                    Deleting this record will remove it from the system permanently.
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-600 italic">
                Please review the details above carefully before proceeding.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="font-medium">
            No, Keep This Charge
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 font-bold"
          >
            Yes, Delete {charge.charge_id}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
