import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "unpaid" | "partial" | "paid";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          "bg-red-100 text-red-700": status === "unpaid",
          "bg-orange-100 text-orange-700": status === "partial",
          "bg-green-100 text-green-700": status === "paid",
        }
      )}
    >
      {status === "unpaid" && "Unpaid"}
      {status === "partial" && "Partial"}
      {status === "paid" && "Paid"}
    </span>
  );
}
