import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { Charge, ChargeFormData } from "@/types/charge";
import { validateChargeForm, validateNewPayment, type ValidationError } from "@/lib/validation";
import { generateChargeId, formatCurrency } from "@/lib/chargeHelpers";
import { AlertCircle, Info } from "lucide-react";
import { STUDENTS, formatStudentDisplay } from "@/data/students";

interface ChargeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (charge: Charge) => void;
  editingCharge?: Charge | null;
  existingCharges: Charge[];
}

export function ChargeFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editingCharge,
  existingCharges,
}: ChargeFormDialogProps) {
  const [formData, setFormData] = useState<ChargeFormData>({
    charge_amount: "",
    paid_amount: "",
    student_id: "",
    date_charged: "",
  });
  const [newPayment, setNewPayment] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!editingCharge;

  const editPreview = useMemo(() => {
    if (!editingCharge) return null;
    const chargeAmt = parseFloat(formData.charge_amount) || editingCharge.charge_amount;
    const newPaymentAmt = parseFloat(newPayment) || 0;
    const newTotalPaid = editingCharge.paid_amount + newPaymentAmt;
    const outstandingAfter = chargeAmt - newTotalPaid;
    return {
      chargeAmount: chargeAmt,
      alreadyPaid: editingCharge.paid_amount,
      newPaymentAmt,
      newTotalPaid,
      outstandingAfter,
    };
  }, [editingCharge, formData.charge_amount, newPayment]);

  const addPreview = useMemo(() => {
    const chargeAmt = parseFloat(formData.charge_amount) || 0;
    const paidAmt = parseFloat(formData.paid_amount) || 0;
    return {
      chargeAmount: chargeAmt,
      paidAmount: paidAmt,
      outstanding: chargeAmt - paidAmt,
    };
  }, [formData.charge_amount, formData.paid_amount]);

  useEffect(() => {
    if (open) {
      if (editingCharge) {
        setFormData({
          charge_amount: editingCharge.charge_amount.toString(),
          paid_amount: editingCharge.paid_amount.toString(),
          student_id: editingCharge.student_id,
          date_charged: editingCharge.date_charged,
        });
        setNewPayment("");
        setPaymentDate(new Date().toISOString().split("T")[0]);
      } else {
        const today = new Date().toISOString().split("T")[0];
        setFormData({
          charge_amount: "",
          paid_amount: "0",
          student_id: "",
          date_charged: today,
        });
        setNewPayment("");
      }
      setErrors([]);
      setIsSubmitting(false);
    }
  }, [open, editingCharge]);

  const handleChange = (field: keyof ChargeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => prev.filter((err) => err.field !== field));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (isEditMode && editingCharge) {
      const paymentErrors = validateNewPayment(
        newPayment,
        editingCharge.paid_amount,
        editingCharge.charge_amount
      );
      if (paymentErrors.length > 0) {
        setErrors(paymentErrors);
        setIsSubmitting(false);
        return;
      }

      const newPaymentAmt = parseFloat(newPayment) || 0;
      const charge: Charge = {
        charge_id: editingCharge.charge_id,
        charge_amount: editingCharge.charge_amount,
        paid_amount: editingCharge.paid_amount + newPaymentAmt,
        student_id: editingCharge.student_id,
        date_charged: editingCharge.date_charged,
        payment_date: paymentDate || new Date().toISOString().split("T")[0],
      };

      await new Promise(resolve => setTimeout(resolve, 300));
      onSubmit(charge);
      onOpenChange(false);
      setIsSubmitting(false);
    } else {
      const validationErrors = validateChargeForm(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      const charge: Charge = {
        charge_id: generateChargeId(existingCharges),
        charge_amount: parseFloat(formData.charge_amount),
        paid_amount: parseFloat(formData.paid_amount),
        student_id: formData.student_id.trim(),
        date_charged: formData.date_charged,
      };

      await new Promise(resolve => setTimeout(resolve, 300));
      onSubmit(charge);
      onOpenChange(false);
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find((err) => err.field === field)?.message;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Record Payment" : "Add New Charge"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Recording a new payment for charge ${editingCharge?.charge_id}`
              : "Enter the charge details below. All fields are required."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">

            {/* ── EDIT MODE ─────────────────────────────────── */}
            {isEditMode && editingCharge && editPreview && (
              <>
                {/* Charge summary (read-only) */}
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 space-y-2 text-sm">
                  <p className="font-semibold text-gray-700 mb-2">Charge Summary</p>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Student</span>
                    <span className="font-medium">{formatStudentDisplay(editingCharge.student_id)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Charge Amount</span>
                    <span className="font-mono font-medium">{formatCurrency(editingCharge.charge_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Already Paid</span>
                    <span className="font-mono font-medium text-blue-600">{formatCurrency(editingCharge.paid_amount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-1">
                    <span className="font-semibold text-gray-700">Outstanding</span>
                    <span className={`font-mono font-bold ${editingCharge.charge_amount - editingCharge.paid_amount === 0 ? "text-green-600" : "text-orange-600"}`}>
                      {formatCurrency(editingCharge.charge_amount - editingCharge.paid_amount)}
                    </span>
                  </div>
                </div>

                {/* Payment date */}
                <div className="grid gap-2">
                  <Label htmlFor="payment_date">
                    Payment Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="payment_date"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  <p className="text-xs text-muted-foreground">
                    Date the payment was actually received
                  </p>
                </div>

                {/* New payment input */}
                <div className="grid gap-2">
                  <Label htmlFor="new_payment">
                    New Payment Amount (RM) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="new_payment"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPayment}
                    onChange={(e) => {
                      setNewPayment(e.target.value);
                      setErrors((prev) => prev.filter((err) => err.field !== "new_payment"));
                    }}
                    placeholder="0.00"
                    className={getFieldError("new_payment") ? "border-red-500" : ""}
                    autoFocus
                  />
                  {getFieldError("new_payment") && (
                    <p className="text-sm text-red-500">{getFieldError("new_payment")}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter the amount being paid right now — not the total
                  </p>
                </div>

                {/* Live after-payment preview */}
                {editPreview.newPaymentAmt > 0 && (
                  <Alert className={editPreview.outstandingAfter <= 0 ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
                    <Info className={`h-4 w-4 ${editPreview.outstandingAfter <= 0 ? "text-green-600" : "text-blue-600"}`} />
                    <AlertDescription>
                      <div className="text-sm space-y-1">
                        <p className={`font-semibold ${editPreview.outstandingAfter <= 0 ? "text-green-900" : "text-blue-900"}`}>
                          After This Payment:
                        </p>
                        <div className="flex justify-between">
                          <span>Total Paid</span>
                          <span className="font-bold font-mono">{formatCurrency(editPreview.newTotalPaid)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining Outstanding</span>
                          <span className={`font-bold font-mono ${editPreview.outstandingAfter <= 0 ? "text-green-700" : "text-orange-600"}`}>
                            {formatCurrency(Math.max(0, editPreview.outstandingAfter))}
                          </span>
                        </div>
                        {editPreview.outstandingAfter <= 0 && (
                          <p className="text-green-700 font-semibold pt-1">Charge will be fully paid.</p>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {/* ── ADD MODE ──────────────────────────────────── */}
            {!isEditMode && (
              <>
                {/* Student Selection */}
                <div className="grid gap-2">
                  <Label htmlFor="student_id">
                    Student <span className="text-red-500">*</span>
                  </Label>
                  <SearchableSelect
                    value={formData.student_id}
                    onChange={(value) => handleChange("student_id", value)}
                    options={STUDENTS.map(student => ({
                      value: student.student_id,
                      label: formatStudentDisplay(student.student_id)
                    }))}
                    placeholder="-- Select a student --"
                    error={!!getFieldError("student_id")}
                  />
                  {getFieldError("student_id") && (
                    <p className="text-sm text-red-500">{getFieldError("student_id")}</p>
                  )}
                </div>

                {/* Charge Amount */}
                <div className="grid gap-2">
                  <Label htmlFor="charge_amount">
                    Charge Amount (RM) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="charge_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.charge_amount}
                    onChange={(e) => handleChange("charge_amount", e.target.value)}
                    placeholder="0.00"
                    className={getFieldError("charge_amount") ? "border-red-500" : ""}
                  />
                  {getFieldError("charge_amount") && (
                    <p className="text-sm text-red-500">{getFieldError("charge_amount")}</p>
                  )}
                </div>

                {/* Initial Paid Amount */}
                <div className="grid gap-2">
                  <Label htmlFor="paid_amount">
                    Initial Payment (RM)
                  </Label>
                  <Input
                    id="paid_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.paid_amount}
                    onChange={(e) => handleChange("paid_amount", e.target.value)}
                    placeholder="0.00"
                    className={getFieldError("paid_amount") ? "border-red-500" : ""}
                  />
                  {getFieldError("paid_amount") && (
                    <p className="text-sm text-red-500">{getFieldError("paid_amount")}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Amount paid upfront. Leave as 0 if nothing has been paid yet.
                  </p>
                </div>

                {/* Date Charged */}
                <div className="grid gap-2">
                  <Label htmlFor="date_charged">
                    Date Charged <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date_charged"
                    type="date"
                    value={formData.date_charged}
                    onChange={(e) => handleChange("date_charged", e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className={getFieldError("date_charged") ? "border-red-500" : ""}
                  />
                  {getFieldError("date_charged") && (
                    <p className="text-sm text-red-500">{getFieldError("date_charged")}</p>
                  )}
                </div>

                {/* Add mode preview */}
                {(formData.student_id || addPreview.chargeAmount > 0) && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription>
                      <div className="text-sm space-y-1">
                        <p className="font-semibold text-blue-900">Preview:</p>
                        {formData.student_id && (
                          <p>Student: <span className="font-bold">{formatStudentDisplay(formData.student_id)}</span></p>
                        )}
                        {addPreview.chargeAmount > 0 && (
                          <>
                            <div className="flex justify-between">
                              <span>Charge</span>
                              <span className="font-mono font-bold">{formatCurrency(addPreview.chargeAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Initial Payment</span>
                              <span className="font-mono font-bold">{formatCurrency(addPreview.paidAmount)}</span>
                            </div>
                            <div className="flex justify-between border-t border-blue-200 pt-1 mt-1">
                              <span>Outstanding</span>
                              <span className={`font-mono font-bold ${addPreview.outstanding === 0 ? "text-green-700" : "text-orange-600"}`}>
                                {formatCurrency(addPreview.outstanding)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {/* General errors */}
            {errors.length > 0 && errors.some((err) => !["charge_amount", "paid_amount", "student_id", "date_charged", "new_payment"].includes(err.field)) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please correct the errors above before submitting.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode ? "Recording..." : "Adding..."
                : isEditMode ? "Record Payment" : "Add Charge"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
