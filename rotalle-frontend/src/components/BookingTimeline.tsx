import type { BookingStatus } from "@/types/enums";

const STEPS: { status: BookingStatus; label: string }[] = [
  { status: "pending", label: "Booking Created" },
  { status: "approved", label: "Provider Approved" },
  { status: "active", label: "Rental Active" },
  { status: "completed", label: "Completed" },
];

export function BookingTimeline({ status }: { status: BookingStatus }) {
  if (status === "rejected" || status === "cancelled") {
    return (
      <p className="text-danger text-sm">
        {status === "rejected" ? "This booking was rejected by the provider." : "This booking was cancelled."}
      </p>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.status === status);

  return (
    <div className="flex items-center gap-1 text-xs">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step.status} className="flex items-center gap-1 flex-1">
            <span
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                done ? "bg-bronze" : "border border-muted"
              }`}
            />
            <span className={done ? "text-champagne" : "text-muted"}>{step.label}</span>
            {i < STEPS.length - 1 && (
              <span className={`flex-1 h-px ${i < currentIndex ? "bg-bronze" : "bg-ink/15"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
