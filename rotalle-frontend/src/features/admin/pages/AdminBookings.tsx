import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminBookingApi } from "@/api/booking.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState, EmptyState } from "@/components/QueryState";
import { BOOKING_STATUS_LABELS } from "@/types/enums";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card p-4">
      <p className="text-muted text-xs">{label}</p>
      <p className="text-2xl font-display text-bronze mt-1">{value}</p>
    </div>
  );
}

export function AdminBookings() {
  const { data: bookings, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: adminBookingApi.getAll,
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-booking-stats"],
    queryFn: adminBookingApi.getStats,
  });

  if (isLoading) return <LoadingState label="Loading bookings..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">All Bookings</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Bookings" value={stats.totalBookings} />
          <StatCard label="Pending" value={stats.pendingBookings} />
          <StatCard label="Active" value={stats.activeBookings} />
          <StatCard label="Completed" value={stats.completedBookings} />
          <StatCard label="Approved" value={stats.approvedBookings} />
          <StatCard label="Rejected" value={stats.rejectedBookings} />
          <StatCard label="Cancelled" value={stats.cancelledBookings} />
          <StatCard label="Total Revenue" value={`$${stats.totalRevenue}`} />
        </div>
      )}

      {bookings && bookings.length === 0 && <EmptyState title="No bookings on the platform yet." />}

      {bookings && bookings.length > 0 && (
        <div className="card divide-y divide-ink/10">
          {bookings.map((b) => (
            <Link
              key={b.id}
              to={`/admin/bookings/${b.id}`}
              className="p-4 flex items-center justify-between gap-4 hover:bg-champagne-muted/20 transition-colors"
            >
              <div>
                <p className="font-medium">{b.vehicleName}</p>
                <p className="text-muted text-sm">{b.customerName}</p>
                <p className="text-muted text-xs mt-1">
                  {new Date(b.startDate).toLocaleDateString()} —{" "}
                  {new Date(b.endDate).toLocaleDateString()} · ${b.totalAmount}
                </p>
              </div>
              <span className={`badge badge-${b.status} shrink-0`}>
                {BOOKING_STATUS_LABELS[b.status]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
