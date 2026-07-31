import { Link } from "react-router-dom";
import type { VehicleResponse } from "@/types/vehicle";
import { VEHICLE_TYPE_LABELS, TRANSMISSION_LABELS } from "@/types/enums";

export function VehicleCard({ vehicle }: { vehicle: VehicleResponse }) {
  const primary = vehicle.images.find((i) => i.isPrimary) ?? vehicle.images[0];

  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="card overflow-hidden hover:border-bronze/40 transition-colors group"
    >
      <div className="aspect-[4/3] bg-charcoal-light overflow-hidden">
        {primary ? (
          <img
            src={primary.url}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight">
            {vehicle.brand} {vehicle.model}
          </h3>
          <span className="text-bronze font-semibold whitespace-nowrap">
            ${vehicle.dailyRate}
            <span className="text-muted text-xs font-normal">/day</span>
          </span>
        </div>
        <p className="text-muted text-sm mt-1">
          {vehicle.year} · {VEHICLE_TYPE_LABELS[vehicle.vehicleType]} ·{" "}
          {TRANSMISSION_LABELS[vehicle.transmission]}
        </p>
        <p className="text-muted text-sm mt-0.5">{vehicle.location}</p>
      </div>
    </Link>
  );
}
