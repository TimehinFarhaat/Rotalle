import { useState } from "react";

interface Props {
  actionLabel: string; // e.g. "Cancel booking", "Reject"
  placeholder?: string;
  onConfirm: (reason: string) => void;
  isPending?: boolean;
  variant?: "danger" | "outline";
}

export function ReasonPrompt({
  actionLabel,
  placeholder = "Reason...",
  onConfirm,
  isPending,
  variant = "danger",
}: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  if (!open) {
    return (
      <button
        className={
          variant === "danger"
            ? "btn-outline text-sm text-danger border-danger/40 hover:border-danger"
            : "btn-outline text-sm"
        }
        onClick={() => setOpen(true)}
      >
        {actionLabel}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input
        className="input flex-1 min-w-[160px] !py-1.5 text-sm"
        placeholder={placeholder}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        autoFocus
      />
      <button
        className="btn-primary text-sm !py-1.5"
        disabled={!reason.trim() || isPending}
        onClick={() => onConfirm(reason.trim())}
      >
        {isPending ? "Submitting..." : "Confirm"}
      </button>
      <button className="text-muted text-sm hover:text-champagne" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </div>
  );
}
