import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Charge } from "@/types/charge";
import { calculateOutstanding, formatCurrency, formatDate } from "@/lib/chargeHelpers";
import { formatStudentDisplay } from "@/data/students";
import { Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

interface ChargeListTableProps {
  charges: Charge[];
  onEdit: (charge: Charge) => void;
  onDelete: (chargeId: string) => void;
}

export function ChargeListTable({ charges, onEdit, onDelete }: ChargeListTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (chargeId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chargeId)) {
        newSet.delete(chargeId);
      } else {
        newSet.add(chargeId);
      }
      return newSet;
    });
  };

  if (charges.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No charges found. Add your first charge to get started.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(charges.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCharges = charges.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaymentStatus = (charge: Charge) => {
    const outstanding = calculateOutstanding(charge);
    if (outstanding === 0) return "paid";
    if (charge.paid_amount === 0) return "unpaid";
    return "partial";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Charge ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead className="text-right">Charge Amount</TableHead>
              <TableHead className="text-right">Paid Amount</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Charged</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCharges.map((charge, index) => {
              const outstanding = calculateOutstanding(charge);
              const status = getPaymentStatus(charge);
              const isExpanded = expandedRows.has(charge.charge_id);
              const hasHistory = charge.payment_history && charge.payment_history.length > 0;
              
              return (
                <>
                  <TableRow 
                    key={charge.charge_id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <TableCell className="font-medium font-mono text-sm">
                      <div className="flex items-center gap-2">
                        {hasHistory && (
                          <button
                            onClick={() => toggleRowExpansion(charge.charge_id)}
                            className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                            aria-label="Toggle payment history"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <span>{charge.charge_id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatStudentDisplay(charge.student_id)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(charge.charge_amount)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(charge.paid_amount)}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {formatCurrency(outstanding)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={status} />
                    </TableCell>
                    <TableCell>{formatDate(charge.date_charged)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(charge)}
                          aria-label={`Edit charge ${charge.charge_id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(charge.charge_id)}
                          aria-label={`Delete charge ${charge.charge_id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Payment History Expansion */}
                  {isExpanded && hasHistory && (
                    <TableRow key={`${charge.charge_id}-history`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <TableCell colSpan={8} className="p-0">
                        <div className="p-4 bg-blue-50/50 border-l-4 border-blue-500">
                          <h4 className="font-semibold text-sm mb-3 text-blue-900">Payment History</h4>
                          <div className="space-y-2">
                            {charge.payment_history?.map((entry, idx) => (
                              <div
                                key={idx}
                                className="grid grid-cols-[1fr,auto,auto] gap-4 text-sm bg-white p-3 rounded border border-blue-100"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-700">
                                      {new Date(entry.date).toLocaleString('en-MY', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      entry.payment_type === 'full' ? 'bg-green-100 text-green-700' :
                                      entry.payment_type === 'partial' ? 'bg-orange-100 text-orange-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {entry.payment_type === 'initial' ? 'Created' :
                                       entry.payment_type === 'full' ? 'Full Payment' :
                                       'Partial Payment'}
                                    </span>
                                  </div>
                                  {entry.notes && (
                                    <p className="text-gray-600 text-xs">{entry.notes}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-gray-500 mb-0.5">Paid</div>
                                  <div className="font-bold font-mono text-base text-blue-600">
                                    {formatCurrency(entry.amount_paid)}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-gray-500 mb-0.5">Outstanding</div>
                                  <div className={`font-bold font-mono text-base ${
                                    entry.outstanding_after === 0 ? 'text-green-600' : 'text-orange-600'
                                  }`}>
                                    {formatCurrency(entry.outstanding_after)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={charges.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
}
