import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState, EmptyState } from "@/components/QueryState";

export function AdminProviders() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-providers"],
    queryFn: adminApi.getProviders,
  });

  const toggle = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? adminApi.suspendProvider(id) : adminApi.activateProvider(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-providers"] }),
  });

  if (isLoading) return <LoadingState label="Loading providers..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">Providers</h1>
      {data && data.length === 0 && <EmptyState title="No providers yet." />}
      {data && data.length > 0 && (
        <div className="card divide-y divide-ink/10">
          {data.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between gap-4">
              <Link to={`/admin/providers/${p.id}`} className="flex-1 hover:opacity-80 transition-opacity">
                <p className="font-medium">{p.fullName}</p>
                <p className="text-muted text-sm">{p.email}</p>
                <p className="text-muted text-xs mt-1">
                  {p.vehicleCount} vehicles · {p.pendingVehicles} pending · {p.approvedVehicles} live
                </p>
              </Link>
              <button
                className={p.isActive ? "btn-outline text-sm !py-1.5" : "btn-primary text-sm !py-1.5"}
                onClick={() => toggle.mutate({ id: p.id, active: p.isActive })}
                disabled={toggle.isPending}
              >
                {p.isActive ? "Suspend" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
