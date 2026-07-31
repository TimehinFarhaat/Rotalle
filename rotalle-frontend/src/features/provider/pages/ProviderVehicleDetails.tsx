import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleApi } from "@/api/vehicle.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState } from "@/components/QueryState";
import { VehicleStatusBadge, ApprovalBadge } from "@/components/StatusBadge";
import { VEHICLE_TYPE_LABELS, TRANSMISSION_LABELS, FUEL_LABELS } from "@/types/enums";

export function ProviderVehicleDetails() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newImages, setNewImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { data: vehicle, isLoading, isError, error: loadError, refetch } = useQuery({
    queryKey: ["provider-vehicle", vehicleId],
    queryFn: () => vehicleApi.getMyVehicleById(vehicleId!),
    enabled: !!vehicleId,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["provider-vehicle", vehicleId] });
    queryClient.invalidateQueries({ queryKey: ["my-vehicles"] });
  }

  const addImages = useMutation({
    mutationFn: () => vehicleApi.addImages(vehicleId!, newImages),
    onSuccess: () => {
      setNewImages([]);
      invalidate();
    },
    onError: (e) => setError(extractErrorMessage(e)),
  });

  const deleteImage = useMutation({
    mutationFn: (imageId: string) => vehicleApi.deleteImage(vehicleId!, imageId),
    onSuccess: invalidate,
    onError: (e) => setError(extractErrorMessage(e)),
  });

  const setPrimary = useMutation({
    mutationFn: (imageId: string) => vehicleApi.setPrimaryImage(vehicleId!, imageId),
    onSuccess: invalidate,
    onError: (e) => setError(extractErrorMessage(e)),
  });

  const deactivate = useMutation({
    mutationFn: () => vehicleApi.deactivate(vehicleId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-vehicles"] });
      navigate("/provider/vehicles");
    },
    onError: (e) => setError(extractErrorMessage(e)),
  });

  if (isLoading) return <LoadingState label="Loading vehicle..." />;
  if (isError) return <ErrorState message={extractErrorMessage(loadError)} onRetry={() => refetch()} />;
  if (!vehicle) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display">
            {vehicle.brand} {vehicle.model} · {vehicle.year}
          </h1>
          <div className="flex gap-2 mt-2">
            <VehicleStatusBadge status={vehicle.status} />
            {vehicle.approvalStatus && <ApprovalBadge status={vehicle.approvalStatus} />}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link to={`/provider/vehicles/${vehicle.id}/edit`} className="btn-outline text-sm">
            Edit Details
          </Link>
          {vehicle.status !== "inactive" && (
            <button
              className="btn-outline text-sm text-danger border-danger/40 hover:border-danger"
              onClick={() => setConfirmingDelete(true)}
            >
              Deactivate
            </button>
          )}
        </div>
      </div>

      {confirmingDelete && (
        <div className="card p-4 border-danger/40 space-y-3">
          <p className="text-sm">
            This takes the vehicle off the marketplace (soft delete — it won't appear in
            customer search anymore). Are you sure?
          </p>
          <div className="flex gap-2">
            <button
              className="btn-primary text-sm bg-danger hover:bg-danger/90"
              onClick={() => deactivate.mutate()}
              disabled={deactivate.isPending}
            >
              {deactivate.isPending ? "Deactivating..." : "Yes, deactivate"}
            </button>
            <button className="btn-outline text-sm" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </button>
          </div>
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

      <div className="space-y-3">
        <h2 className="font-display text-lg">Photos</h2>

        {vehicle.images.length === 0 && (
          <p className="text-muted text-sm">No photos yet — add some below.</p>
        )}

        {vehicle.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {vehicle.images
              .slice()
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt=""
                    className="w-full aspect-square object-cover rounded-card border border-ink/15"
                  />
                  {img.isPrimary && (
                    <span className="absolute top-1 left-1 badge badge-approved text-[10px] px-1.5 py-0.5">
                      Primary
                    </span>
                  )}
                  <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-card flex flex-col items-center justify-center gap-1">
                    {!img.isPrimary && (
                      <button
                        className="text-xs text-champagne hover:text-bronze"
                        onClick={() => setPrimary.mutate(img.id)}
                        disabled={setPrimary.isPending}
                      >
                        Set primary
                      </button>
                    )}
                    <button
                      className="text-xs text-danger hover:text-danger/80"
                      onClick={() => deleteImage.mutate(img.id)}
                      disabled={deleteImage.isPending}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="pt-2">
          <input
            type="file"
            multiple
            accept="image/*"
            className="input"
            onChange={(e) => setNewImages(Array.from(e.target.files ?? []))}
          />
          {newImages.length > 0 && (
            <button
              className="btn-primary text-sm mt-2"
              onClick={() => addImages.mutate()}
              disabled={addImages.isPending}
            >
              {addImages.isPending ? "Uploading..." : `Upload ${newImages.length} photo(s)`}
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}
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
