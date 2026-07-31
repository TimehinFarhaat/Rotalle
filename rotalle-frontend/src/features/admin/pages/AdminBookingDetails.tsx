import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminBookingApi } from "@/api/booking.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState } from "@/components/QueryState";
import { BookingTimeline } from "@/components/BookingTimeline";
import { BOOKING_STATUS_LABELS } from "@/types/enums";

export function AdminBookingDetails() {
  const { bookingId } = useParams<{ bookingId: string }>();

  const { data: booking, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-booking", bookingId],
    queryFn: () => adminBookingApi.getById(bookingId!),
    enabled: !!bookingId,
  });

  if (isLoading) return <LoadingState label="Loading booking..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;
  if (!booking) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display">{booking.vehicleName}</h1>
        <p className="text-muted text-sm mt-1">
          Booked by {booking.customerName} · Created{" "}
          {new Date(booking.createdAt).toLocaleDateString()}
        </p>
        <span className={`badge badge-${booking.status} mt-2 inline-flex`}>
          {BOOKING_STATUS_LABELS[booking.status]}
        </span>
      </div>

      <div className="card p-5">
        <BookingTimeline status={booking.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Detail label="Pickup date" value={new Date(booking.startDate).toLocaleDateString()} />
        <Detail label="Return date" value={new Date(booking.endDate).toLocaleDateString()} />
        <Detail label="Total days" value={String(booking.totalDays)} />
        <Detail label="Daily rate" value={`$${booking.dailyRate}`} />
        <Detail label="Total amount" value={`$${booking.totalAmount}`} />
        <Detail label="Customer" value={booking.customerName} />
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3">
      <p className="text-muted text-xs">{label}</p>
      <p className="text-champagne">{value}</p>
    </div>
  );
}
