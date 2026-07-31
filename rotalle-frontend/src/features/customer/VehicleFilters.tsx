import type { VehicleSearchParams } from "@/types/vehicle";
import {
  VEHICLE_TYPE_LABELS,
  TRANSMISSION_LABELS,
  FUEL_LABELS,
  type VehicleType,
  type TransmissionType,
  type FuelType,
} from "@/types/enums";

interface Props {
  value: VehicleSearchParams;
  onChange: (next: VehicleSearchParams) => void;
}

export function VehicleFilters({ value, onChange }: Props) {
  function set<K extends keyof VehicleSearchParams>(key: K, val: VehicleSearchParams[K]) {
    onChange({ ...value, [key]: val || undefined });
  }

  return (
    <div className="card p-4 flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="text-xs text-muted block mb-1">Search</label>
        <input
          className="input"
          placeholder="Brand or model..."
          value={value.search ?? ""}
          onChange={(e) => set("search", e.target.value)}
        />
      </div>

      <div className="min-w-[140px]">
        <label className="text-xs text-muted block mb-1">Location</label>
        <input
          className="input"
          placeholder="City"
          value={value.location ?? ""}
          onChange={(e) => set("location", e.target.value)}
        />
      </div>

      <div className="min-w-[140px]">
        <label className="text-xs text-muted block mb-1">Type</label>
        <select
          className="input"
          value={value.vehicleType ?? ""}
          onChange={(e) => set("vehicleType", (e.target.value || undefined) as VehicleType)}
        >
          <option value="">Any</option>
          {Object.entries(VEHICLE_TYPE_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[130px]">
        <label className="text-xs text-muted block mb-1">Transmission</label>
        <select
          className="input"
          value={value.transmission ?? ""}
          onChange={(e) =>
            set("transmission", (e.target.value || undefined) as TransmissionType)
          }
        >
          <option value="">Any</option>
          {Object.entries(TRANSMISSION_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[120px]">
        <label className="text-xs text-muted block mb-1">Fuel</label>
        <select
          className="input"
          value={value.fuelType ?? ""}
          onChange={(e) => set("fuelType", (e.target.value || undefined) as FuelType)}
        >
          <option value="">Any</option>
          {Object.entries(FUEL_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[90px]">
        <label className="text-xs text-muted block mb-1">Min $/day</label>
        <input
          type="number"
          className="input input-no-spinner"
          value={value.minPrice ?? ""}
          onWheel={(e) => e.currentTarget.blur()}
          onChange={(e) => set("minPrice", e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <div className="min-w-[90px]">
        <label className="text-xs text-muted block mb-1">Max $/day</label>
        <input
          type="number"
          className="input input-no-spinner"
          value={value.maxPrice ?? ""}
          onWheel={(e) => e.currentTarget.blur()}
          onChange={(e) => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <button className="btn-outline text-sm" onClick={() => onChange({})}>
        Clear
      </button>
    </div>
  );
}
