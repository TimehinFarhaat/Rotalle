import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState, EmptyState } from "@/components/QueryState";

export function AdminCustomers() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: adminApi.getCustomers,
  });

  const toggle = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? adminApi.suspendCustomer(id) : adminApi.activateCustomer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-customers"] }),
  });

  if (isLoading) return <LoadingState label="Loading customers..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">Customers</h1>
      {data && data.length === 0 && <EmptyState title="No customers yet." />}
      {data && data.length > 0 && (
        <div className="card divide-y divide-ink/10">
          {data.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between gap-4">
              <Link to={`/admin/customers/${c.id}`} className="flex-1 hover:opacity-80 transition-opacity">
                <p className="font-medium">{c.fullName}</p>
                <p className="text-muted text-sm">{c.email}</p>
              </Link>
              <button
                className={c.isActive ? "btn-outline text-sm !py-1.5" : "btn-primary text-sm !py-1.5"}
                onClick={() => toggle.mutate({ id: c.id, active: c.isActive })}
                disabled={toggle.isPending}
              >
                {c.isActive ? "Suspend" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
