import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vehicleApi } from "@/api/vehicle.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState } from "@/components/QueryState";
import {
  VEHICLE_TYPE_LABELS,
  TRANSMISSION_LABELS,
  FUEL_LABELS,
  VEHICLE_STATUS_LABELS,
  type VehicleType,
  type TransmissionType,
  type FuelType,
  type VehicleStatus,
} from "@/types/enums";
import type { CreateVehicleFields, UpdateVehicleFields } from "@/types/vehicle";

const empty: CreateVehicleFields = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  dailyRate: 0,
  seats: 4,
  location: "",
  description: "",
  vehicleType: "sedan",
  transmission: "automatic",
  fuelType: "petrol",
};

export function VehicleForm() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const isEdit = !!vehicleId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: existing,
    isLoading: isLoadingExisting,
    isError: isExistingError,
    error: existingError,
  } = useQuery({
    queryKey: ["provider-vehicle", vehicleId],
    queryFn: () => vehicleApi.getMyVehicleById(vehicleId!),
    enabled: isEdit,
  });

  const [fields, setFields] = useState<CreateVehicleFields>(empty);
  const [status, setStatus] = useState<VehicleStatus>("available");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formReady, setFormReady] = useState(!isEdit); // create mode is ready immediately
  const [error, setError] = useState<string | null>(null);

  // Sync form state from the fetched vehicle exactly once it arrives.
  // This runs as a side effect (not during render) so the mutation never
  // fires before `fields`/`status` actually hold the real data — a
  // render-time setState here was the root cause of edits saving as blank/zero.
  useEffect(() => {
    if (!isEdit || !existing) return;
    setFields({
      brand: existing.brand,
      model: existing.model,
      year: existing.year,
      dailyRate: existing.dailyRate,
      seats: existing.seats,
      location: existing.location,
      description: existing.description,
      vehicleType: existing.vehicleType,
      transmission: existing.transmission,
      fuelType: existing.fuelType,
    });
    setStatus(existing.status);
    setFormReady(true);
  }, [isEdit, existing]);

  // Build/revoke object URLs for local image previews on selection.
  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  const createMutation = useMutation({
    mutationFn: () => vehicleApi.create(fields, images),
    onSuccess: (vehicle) => {
      queryClient.invalidateQueries({ queryKey: ["my-vehicles"] });
      navigate(`/provider/vehicles/${vehicle.id}`);
    },
    onError: (e) => setError(extractErrorMessage(e)),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      vehicleApi.update(vehicleId!, { ...fields, status } as UpdateVehicleFields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["provider-vehicle", vehicleId] });
      navigate(`/provider/vehicles/${vehicleId}`);
    },
    onError: (e) => setError(extractErrorMessage(e)),
  });

  if (isEdit && isLoadingExisting) return <LoadingState label="Loading vehicle..." />;
  if (isEdit && isExistingError)
    return <ErrorState message={extractErrorMessage(existingError)} />;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    // Guard against submitting an edit before the fetched data has synced in —
    // this is the actual fix for "update sends blank/zero" (see useEffect above).
    if (isEdit && !formReady) return;
    if (isEdit) updateMutation.mutate();
    else createMutation.mutate();
  }

  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display">{isEdit ? "Edit Vehicle" : "Add Vehicle"}</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand">
            <input
              required
              className="input"
              value={fields.brand}
              onChange={(e) => setFields({ ...fields, brand: e.target.value })}
            />
          </Field>
          <Field label="Model">
            <input
              required
              className="input"
              value={fields.model}
              onChange={(e) => setFields({ ...fields, model: e.target.value })}
            />
          </Field>
          <Field label="Year">
            <input
              type="number"
              required
              max={new Date().getFullYear()}
              className="input input-no-spinner"
              value={fields.year}
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) => {
                const val = Number(e.target.value);
                const currentYear = new Date().getFullYear();
                // Clamp — a listing can't claim a model year from the future.
                setFields({ ...fields, year: Math.min(val, currentYear) });
              }}
            />
          </Field>
          <Field label="Daily rate ($)">
            <input
              type="number"
              required
              min={1}
              className="input input-no-spinner"
              value={fields.dailyRate}
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) => setFields({ ...fields, dailyRate: Number(e.target.value) })}
            />
          </Field>
          <Field label="Seats">
            <input
              type="number"
              required
              min={1}
              className="input input-no-spinner"
              value={fields.seats}
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) => setFields({ ...fields, seats: Number(e.target.value) })}
            />
          </Field>
          <Field label="Location">
            <input
              required
              className="input"
              value={fields.location}
              onChange={(e) => setFields({ ...fields, location: e.target.value })}
            />
          </Field>
          <Field label="Type">
            <select
              className="input"
              value={fields.vehicleType}
              onChange={(e) =>
                setFields({ ...fields, vehicleType: e.target.value as VehicleType })
              }
            >
              {Object.entries(VEHICLE_TYPE_LABELS).map(([k, l]) => (
                <option key={k} value={k}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Transmission">
            <select
              className="input"
              value={fields.transmission}
              onChange={(e) =>
                setFields({ ...fields, transmission: e.target.value as TransmissionType })
              }
            >
              {Object.entries(TRANSMISSION_LABELS).map(([k, l]) => (
                <option key={k} value={k}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fuel type">
            <select
              className="input"
              value={fields.fuelType}
              onChange={(e) => setFields({ ...fields, fuelType: e.target.value as FuelType })}
            >
              {Object.entries(FUEL_LABELS).map(([k, l]) => (
                <option key={k} value={k}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          {isEdit && (
            <Field label="Status">
              <select
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
              >
                {Object.entries(VEHICLE_STATUS_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <Field label="Description">
          <textarea
            rows={4}
            className="input"
            value={fields.description}
            onChange={(e) => setFields({ ...fields, description: e.target.value })}
          />
        </Field>

        {!isEdit && (
          <Field label="Images">
            <input
              type="file"
              multiple
              accept="image/*"
              className="input"
              onChange={(e) => setImages(Array.from(e.target.files ?? []))}
            />
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {imagePreviews.map((src, i) => (
                  <div key={src} className="relative">
                    <img
                      src={src}
                      className="w-20 h-20 object-cover rounded-card border border-ink/15"
                    />
                    {i === 0 && (
                      <span className="absolute -top-2 -left-2 badge badge-approved text-[10px] px-1.5 py-0.5">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted mt-1">
              First image becomes the primary/thumbnail image.
            </p>
          </Field>
        )}
        {isEdit && (
          <p className="text-xs text-muted">
            Manage this vehicle's photos from the details page after saving.
          </p>
        )}

        {error && <p className="text-danger text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            className="btn-primary flex-1"
            disabled={submitting || (isEdit && !formReady)}
          >
            {submitting ? "Saving..." : isEdit ? "Save changes" : "Create vehicle"}
          </button>
          {isEdit && (
            <Link to={`/provider/vehicles/${vehicleId}`} className="btn-outline">
              Cancel
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted block mb-1">{label}</label>
      {children}
    </div>
  );
}
