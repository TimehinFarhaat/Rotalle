import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState } from "@/components/QueryState";
import { VehicleStatusBadge, ApprovalBadge } from "@/components/StatusBadge";

export function AdminProviderDetails() {
  const { providerId } = useParams<{ providerId: string }>();
  const queryClient = useQueryClient();

  const { data: provider, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-provider", providerId],
    queryFn: () => adminApi.getProvider(providerId!),
    enabled: !!providerId,
  });

  const toggle = useMutation({
    mutationFn: (active: boolean) =>
      active ? adminApi.suspendProvider(providerId!) : adminApi.activateProvider(providerId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-provider", providerId] });
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
    },
  });

  if (isLoading) return <LoadingState label="Loading provider..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;
  if (!provider) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display">{provider.fullName}</h1>
          <p className="text-muted text-sm mt-1">{provider.email}</p>
          <p className="text-muted text-xs mt-1">
            Joined {new Date(provider.createdAt).toLocaleDateString()}
          </p>
          <span className={`badge mt-2 inline-flex ${provider.isActive ? "badge-approved" : "badge-suspended"}`}>
            {provider.isActive ? "Active" : "Suspended"}
          </span>
        </div>
        <button
          className={provider.isActive ? "btn-outline text-sm" : "btn-primary text-sm"}
          onClick={() => toggle.mutate(provider.isActive)}
          disabled={toggle.isPending}
        >
          {provider.isActive ? "Suspend" : "Activate"}
        </button>
      </div>

      <div>
        <h2 className="font-display text-lg mb-3">Vehicles ({provider.vehicles.length})</h2>
        {provider.vehicles.length === 0 && <p className="text-muted text-sm">No vehicles listed yet.</p>}
        {provider.vehicles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {provider.vehicles.map((v) => {
              const primary = v.images.find((i) => i.isPrimary) ?? v.images[0];
              return (
                <div key={v.id} className="card overflow-hidden">
                  <div className="aspect-[4/3] bg-champagne-muted/30">
                    {primary && (
                      <img src={primary.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-3 space-y-1.5">
                    <p className="font-medium">
                      {v.brand} {v.model} ({v.year})
                    </p>
                    <p className="text-muted text-sm">${v.dailyRate}/day · {v.location}</p>
                    <div className="flex gap-2">
                      <VehicleStatusBadge status={v.status} />
                      {v.approvalStatus && <ApprovalBadge status={v.approvalStatus} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
