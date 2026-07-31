import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { vehicleApi } from "@/api/vehicle.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState, EmptyState } from "@/components/QueryState";
import { VehicleStatusBadge, ApprovalBadge } from "@/components/StatusBadge";

export function MyVehicles() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-vehicles"],
    queryFn: vehicleApi.getMyVehicles,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display">My Vehicles</h1>
        <Link to="/provider/vehicles/new" className="btn-primary">
          + Add Vehicle
        </Link>
      </div>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />}
      {data && data.length === 0 && (
        <EmptyState
          title="No vehicles yet."
          subtitle="Add your first vehicle to start renting it out."
        />
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((v) => {
            const primary = v.images.find((i) => i.isPrimary) ?? v.images[0];
            return (
              <div key={v.id} className="card overflow-hidden">
                <div className="aspect-[4/3] bg-charcoal-light">
                  {primary ? (
                    <img
                      src={primary.url}
                      alt={`${v.brand} ${v.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                      No photos yet
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display">
                      {v.brand} {v.model}
                    </h3>
                    <span className="text-bronze font-semibold">${v.dailyRate}/day</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <VehicleStatusBadge status={v.status} />
                    {v.approvalStatus && <ApprovalBadge status={v.approvalStatus} />}
                  </div>
                  <Link
                    to={`/provider/vehicles/${v.id}`}
                    className="btn-outline w-full text-center text-sm block"
                  >
                    View & Manage
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
