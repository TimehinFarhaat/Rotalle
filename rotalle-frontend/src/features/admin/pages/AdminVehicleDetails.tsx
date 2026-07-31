import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState } from "@/components/QueryState";
import { ApprovalBadge, VehicleStatusBadge } from "@/components/StatusBadge";
import { VEHICLE_TYPE_LABELS, TRANSMISSION_LABELS, FUEL_LABELS } from "@/types/enums";

export function AdminVehicleDetails() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const queryClient = useQueryClient();

  const { data: vehicle, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-vehicle", vehicleId],
    queryFn: () => adminApi.getVehicle(vehicleId!),
    enabled: !!vehicleId,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-vehicle", vehicleId] });
    queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
  }

  const approve = useMutation({ mutationFn: () => adminApi.approveVehicle(vehicleId!), onSuccess: invalidate });
  const reject = useMutation({ mutationFn: () => adminApi.rejectVehicle(vehicleId!), onSuccess: invalidate });
  const suspend = useMutation({ mutationFn: () => adminApi.suspendVehicle(vehicleId!), onSuccess: invalidate });
  const reinstate = useMutation({ mutationFn: () => adminApi.reinstateVehicle(vehicleId!), onSuccess: invalidate });

  if (isLoading) return <LoadingState label="Loading vehicle..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;
  if (!vehicle) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display">
            {vehicle.brand} {vehicle.model} · {vehicle.year}
          </h1>
          <p className="text-muted text-sm mt-1">
            Listed by {vehicle.providerName} · Created{" "}
            {new Date(vehicle.createdAt).toLocaleDateString()}
          </p>
          <div className="flex gap-2 mt-2">
            <VehicleStatusBadge status={vehicle.status} />
            {vehicle.approvalStatus && <ApprovalBadge status={vehicle.approvalStatus} />}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {vehicle.approvalStatus === "pending" && (
            <>
              <button className="btn-primary text-sm" onClick={() => approve.mutate()} disabled={approve.isPending}>
                Approve
              </button>
              <button className="btn-outline text-sm" onClick={() => reject.mutate()} disabled={reject.isPending}>
                Reject
              </button>
            </>
          )}
          {vehicle.approvalStatus === "approved" && (
            <button className="btn-outline text-sm" onClick={() => suspend.mutate()} disabled={suspend.isPending}>
              Suspend
            </button>
          )}
          {vehicle.approvalStatus === "suspended" && (
            <button className="btn-primary text-sm" onClick={() => reinstate.mutate()} disabled={reinstate.isPending}>
              Reinstate
            </button>
          )}
        </div>
      </div>

      {vehicle.images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {vehicle.images
            .slice()
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((img) => (
              <div key={img.id} className="relative">
                <img
                  src={img.url}
                  alt=""
                  className="w-full aspect-square object-cover rounded-card border border-ink/10"
                />
                {img.isPrimary && (
                  <span className="absolute top-1 left-1 badge badge-approved text-[10px] px-1.5 py-0.5">
                    Primary
                  </span>
                )}
              </div>
            ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Detail label="Type" value={VEHICLE_TYPE_LABELS[vehicle.vehicleType]} />
        <Detail label="Transmission" value={TRANSMISSION_LABELS[vehicle.transmission]} />
        <Detail label="Fuel" value={FUEL_LABELS[vehicle.fuelType]} />
        <Detail label="Seats" value={String(vehicle.seats)} />
        <Detail label="Location" value={vehicle.location} />
        <Detail label="Daily rate" value={`$${vehicle.dailyRate}`} />
      </div>

      {vehicle.description && (
        <div>
          <h2 className="text-sm text-muted mb-1">Description</h2>
          <p className="text-champagne/90">{vehicle.description}</p>
        </div>
      )}
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
