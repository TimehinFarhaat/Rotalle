import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "@/api/booking.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState, EmptyState } from "@/components/QueryState";
import { BookingTimeline } from "@/components/BookingTimeline";
import { ReasonPrompt } from "@/components/ReasonPrompt";
import { BOOKING_STATUS_LABELS } from "@/types/enums";

export function MyBookings() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: bookingApi.getMyBookings,
  });

  const cancel = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingApi.cancel(id, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-bookings"] }),
  });

  if (isLoading) return <LoadingState label="Loading your bookings..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">My Bookings</h1>

      {data && data.length === 0 && (
        <EmptyState title="You have no bookings yet." subtitle="Find your next vehicle." />
      )}

      {data && data.length > 0 && (
        <div className="space-y-4">
          {data.map((b) => (
            <div key={b.id} className="card p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg">{b.vehicleName}</p>
                  <p className="text-muted text-sm">
                    {new Date(b.startDate).toLocaleDateString()} —{" "}
                    {new Date(b.endDate).toLocaleDateString()} · {b.totalDays} day(s)
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-bronze font-semibold">${b.totalAmount}</p>
                  <p className="text-muted text-xs">{BOOKING_STATUS_LABELS[b.status]}</p>
                </div>
              </div>

              <BookingTimeline status={b.status} />

              {b.status === "pending" && (
                <ReasonPrompt
                  actionLabel="Cancel booking"
                  placeholder="Why are you cancelling?"
                  isPending={cancel.isPending}
                  onConfirm={(reason) => cancel.mutate({ id: b.id, reason })}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
