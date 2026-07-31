import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState } from "@/components/QueryState";

export function AdminCustomerDetails() {
  const { customerId } = useParams<{ customerId: string }>();
  const queryClient = useQueryClient();

  const { data: customer, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-customer", customerId],
    queryFn: () => adminApi.getCustomer(customerId!),
    enabled: !!customerId,
  });

  const toggle = useMutation({
    mutationFn: (active: boolean) =>
      active ? adminApi.suspendCustomer(customerId!) : adminApi.activateCustomer(customerId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
    },
  });

  if (isLoading) return <LoadingState label="Loading customer..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;
  if (!customer) return null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display">{customer.fullName}</h1>
          <p className="text-muted text-sm mt-1">{customer.email}</p>
          <p className="text-muted text-xs mt-1">
            Joined {new Date(customer.createdAt).toLocaleDateString()}
          </p>
          <span className={`badge mt-2 inline-flex ${customer.isActive ? "badge-approved" : "badge-suspended"}`}>
            {customer.isActive ? "Active" : "Suspended"}
          </span>
        </div>
        <button
          className={customer.isActive ? "btn-outline text-sm" : "btn-primary text-sm"}
          onClick={() => toggle.mutate(customer.isActive)}
          disabled={toggle.isPending}
        >
          {customer.isActive ? "Suspend" : "Activate"}
        </button>
      </div>

      {/* Booking history isn't linked to this endpoint yet on the backend
          (CustomerDetailsResponse has a commented-out Bookings field) —
          once that's added, list it here the same way AdminBookings.tsx does. */}
    </div>
  );
}
