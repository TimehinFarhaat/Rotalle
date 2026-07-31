import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState } from "@/components/QueryState";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <p className="text-muted text-sm">{label}</p>
      <p className="text-3xl font-display text-bronze mt-1">{value}</p>
    </div>
  );
}

export function AdminDashboard() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminApi.dashboard,
  });

  if (isLoading) return <LoadingState label="Loading dashboard..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">Platform Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={data.totalUsers} />
        <StatCard label="Providers" value={data.totalProviders} />
        <StatCard label="Customers" value={data.totalCustomers} />
        <StatCard label="Total Vehicles" value={data.totalVehicles} />
        <StatCard label="Pending Approval" value={data.pendingVehicles} />
        <StatCard label="Approved" value={data.approvedVehicles} />
        <StatCard label="Rejected" value={data.rejectedVehicles} />
        <StatCard label="Suspended" value={data.suspendedVehicles} />
      </div>
      {/* Booking stat cards render at 0 until booking endpoints are implemented. */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Active Bookings" value={data.activeBookings} />
        <StatCard label="Completed Bookings" value={data.completedBookings} />
        <StatCard label="Cancelled Bookings" value={data.cancelledBookings} />
      </div>
    </div>
  );
}
