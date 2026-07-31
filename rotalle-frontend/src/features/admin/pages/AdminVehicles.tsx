import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState, EmptyState } from "@/components/QueryState";
import { ApprovalBadge, VehicleStatusBadge } from "@/components/StatusBadge";

export function AdminVehicles() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: adminApi.getVehicles,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
  }

  const approve = useMutation({ mutationFn: (id: string) => adminApi.approveVehicle(id), onSuccess: invalidate });
  const reject = useMutation({ mutationFn: (id: string) => adminApi.rejectVehicle(id), onSuccess: invalidate });
  const suspend = useMutation({ mutationFn: (id: string) => adminApi.suspendVehicle(id), onSuccess: invalidate });
  const reinstate = useMutation({ mutationFn: (id: string) => adminApi.reinstateVehicle(id), onSuccess: invalidate });

  if (isLoading) return <LoadingState label="Loading vehicles..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">All Vehicles</h1>
      {data && data.length === 0 && <EmptyState title="No vehicles on the platform yet." />}
      {data && data.length > 0 && (
        <div className="card divide-y divide-ink/10">
          {data.map((v) => (
            <div key={v.id} className="p-4 flex items-center justify-between gap-4">
              <Link to={`/admin/vehicles/${v.id}`} className="flex-1 hover:opacity-80 transition-opacity">
                <p className="font-medium">
                  {v.brand} {v.model} ({v.year})
                </p>
                <p className="text-muted text-sm">
                  {v.providerName} · {v.location}
                </p>
                <div className="flex gap-2 mt-1">
                  <VehicleStatusBadge status={v.status} />
                  {v.approvalStatus && <ApprovalBadge status={v.approvalStatus} />}
                </div>
              </Link>
              <div className="flex gap-2 shrink-0">
                {v.approvalStatus === "pending" && (
                  <>
                    <button
                      className="btn-primary text-sm !py-1.5"
                      onClick={() => approve.mutate(v.id)}
                      disabled={approve.isPending}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-outline text-sm !py-1.5"
                      onClick={() => reject.mutate(v.id)}
                      disabled={reject.isPending}
                    >
                      Reject
                    </button>
                  </>
                )}
                {v.approvalStatus === "approved" && (
                  <button
                    className="btn-outline text-sm !py-1.5"
                    onClick={() => suspend.mutate(v.id)}
                    disabled={suspend.isPending}
                  >
                    Suspend
                  </button>
                )}
                {v.approvalStatus === "suspended" && (
                  <button
                    className="btn-primary text-sm !py-1.5"
                    onClick={() => reinstate.mutate(v.id)}
                    disabled={reinstate.isPending}
                  >
                    Reinstate
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
