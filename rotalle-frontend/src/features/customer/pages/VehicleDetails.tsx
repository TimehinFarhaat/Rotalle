import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { vehicleApi } from "@/api/vehicle.api";
import { bookingApi } from "@/api/booking.api";
import { extractErrorMessage } from "@/api/client";
import { LoadingState, ErrorState } from "@/components/QueryState";
import { VEHICLE_TYPE_LABELS, TRANSMISSION_LABELS, FUEL_LABELS } from "@/types/enums";
import { useAuth } from "@/auth/AuthContext";

export function VehicleDetails() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingError, setBookingError] = useState<string | null>(null);

  const { data: vehicle, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => vehicleApi.getById(vehicleId!),
    enabled: !!vehicleId,
  });

  const bookMutation = useMutation({
    mutationFn: () =>
      bookingApi.create({
        vehicleId: vehicleId!,
        // Send explicit UTC midnight, not a bare "yyyy-MM-dd" string — the
        // backend requires DateTime.Kind=Utc for Postgres, and a bare date
        // string binds as Kind=Unspecified and crashes on save.
        startDate: `${startDate}T00:00:00.000Z`,
        endDate: `${endDate}T00:00:00.000Z`,
      }),
    onSuccess: (booking) => {
      navigate("/customer/bookings", { state: { justBooked: booking.id } });
    },
    onError: (e) => setBookingError(extractErrorMessage(e)),
    // Common failure here is a date conflict — the backend is the source of
    // truth for availability, so this message surfaces straight from it
    // rather than trying to pre-validate conflicts client-side.
  });

  if (isLoading) return <LoadingState label="Loading vehicle..." />;
  if (isError) return <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />;
  if (!vehicle) return null;

  const days =
    startDate && endDate
      ? Math.max(0, Math.ceil((+new Date(endDate) - +new Date(startDate)) / 86_400_000))
      : 0;
  // Display-only estimate — the backend recalculates and is the final word
  // on both price and availability when the booking is actually submitted.
  const estimatedTotal = days * vehicle.dailyRate;

  function handleBook() {
    setBookingError(null);
    bookMutation.mutate();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="aspect-video bg-charcoal-light rounded-card overflow-hidden">
          {vehicle.images[0] && (
            <img
              src={vehicle.images[0].url}
              alt={vehicle.brand}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <h1 className="text-2xl font-display">
          {vehicle.brand} {vehicle.model} · {vehicle.year}
        </h1>
        <div className="flex flex-wrap gap-2 text-sm text-muted">
          <span className="card px-3 py-1">{VEHICLE_TYPE_LABELS[vehicle.vehicleType]}</span>
          <span className="card px-3 py-1">{TRANSMISSION_LABELS[vehicle.transmission]}</span>
          <span className="card px-3 py-1">{FUEL_LABELS[vehicle.fuelType]}</span>
          <span className="card px-3 py-1">{vehicle.seats} seats</span>
          <span className="card px-3 py-1">{vehicle.location}</span>
        </div>
        <p className="text-champagne/80 leading-relaxed">{vehicle.description}</p>
      </div>

      <aside className="card p-5 h-fit space-y-4">
        <p className="text-2xl font-display text-bronze">
          ${vehicle.dailyRate}
          <span className="text-muted text-sm font-normal"> / day</span>
        </p>

        <div>
          <label className="text-xs text-muted block mb-1">Pickup date</label>
          <input
            type="date"
            className="input"
            value={startDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => {
              setStartDate(e.target.value);
              setBookingError(null);
            }}
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Return date</label>
          <input
            type="date"
            className="input"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => {
              setEndDate(e.target.value);
              setBookingError(null);
            }}
          />
        </div>

        {days > 0 && (
          <div className="text-sm space-y-1 border-t border-ink/15 pt-3">
            <div className="flex justify-between text-muted">
              <span>
                {days} day(s) × ${vehicle.dailyRate}
              </span>
              <span>${estimatedTotal}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Estimated total</span>
              <span>${estimatedTotal}</span>
            </div>
            <p className="text-xs text-muted">
              Final availability and total are confirmed when you submit.
            </p>
          </div>
        )}

        {bookingError && <p className="text-danger text-sm">{bookingError}</p>}

        {user?.role === "customer" ? (
          <button
            className="btn-primary w-full"
            disabled={days === 0 || bookMutation.isPending}
            onClick={handleBook}
          >
            {bookMutation.isPending ? "Checking availability..." : "Check availability & book"}
          </button>
        ) : !user ? (
          <p className="text-xs text-muted text-center">Log in as a customer to book.</p>
        ) : (
          <p className="text-xs text-muted text-center">
            Only customer accounts can book vehicles.
          </p>
        )}
      </aside>
    </div>
  );
}
