import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "@/api/booking.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState, EmptyState } from "@/components/QueryState";
import { ReasonPrompt } from "@/components/ReasonPrompt";
import { BOOKING_STATUS_LABELS } from "@/types/enums";

export function BookingRequests() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: bookingApi.getProviderBookings,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
  }

  const approve = useMutation({
    mutationFn: (id: string) => bookingApi.approve(id),
    onSuccess: invalidate,
  });
  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingApi.reject(id, reason),
    onSuccess: invalidate,
  });
  const pickup = useMutation({
    mutationFn: (id: string) => bookingApi.pickup(id),
    onSuccess: invalidate,
  });
  const complete = useMutation({
    mutationFn: (id: string) => bookingApi.returnVehicle(id),
    onSuccess: invalidate,
  });

  if (isLoading) return <LoadingState label="Loading booking requests..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">Booking Requests</h1>

      {data && data.length === 0 && (
        <EmptyState
          title="No booking requests yet."
          subtitle="They'll show up here as customers book your vehicles."
        />
      )}

      {data && data.length > 0 && (
        <div className="card divide-y divide-ink/10">
          {data.map((b) => (
            <div key={b.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium">{b.vehicleName}</p>
                <p className="text-muted text-sm">{b.customerName}</p>
                <p className="text-muted text-xs mt-1">
                  {new Date(b.startDate).toLocaleDateString()} —{" "}
                  {new Date(b.endDate).toLocaleDateString()} · ${b.totalAmount}
                </p>
                <span className={`badge badge-${b.status} mt-2`}>
                  {BOOKING_STATUS_LABELS[b.status]}
                </span>
              </div>

              <div className="flex gap-2 shrink-0 items-center">
                {b.status === "pending" && (
                  <>
                    <button
                      className="btn-primary text-sm !py-1.5"
                      onClick={() => approve.mutate(b.id)}
                      disabled={approve.isPending}
                    >
                      Approve
                    </button>
                    <ReasonPrompt
                      actionLabel="Reject"
                      placeholder="Why are you rejecting?"
                      isPending={reject.isPending}
                      onConfirm={(reason) => reject.mutate({ id: b.id, reason })}
                    />
                  </>
                )}
                {b.status === "approved" && (
                  <button
                    className="btn-primary text-sm !py-1.5"
                    onClick={() => pickup.mutate(b.id)}
                    disabled={pickup.isPending}
                  >
                    Mark Picked Up
                  </button>
                )}
                {b.status === "active" && (
                  <button
                    className="btn-primary text-sm !py-1.5"
                    onClick={() => complete.mutate(b.id)}
                    disabled={complete.isPending}
                  >
                    Mark Returned
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
