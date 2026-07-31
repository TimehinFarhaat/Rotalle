// These mirror Rotalle.Domain.Enums exactly, serialized via
// JsonStringEnumConverter(JsonNamingPolicy.CamelCase, allowIntegerValues: true)
// configured in Program.cs. Confirm exact casing against a live response —
// JsonNamingPolicy.CamelCase only lowercases the FIRST character, so
// VehicleType.SUV may come back as "sUV" rather than "suv". Adjust the
// SUV entry below (and its label) if the API disagrees.

export type UserRole = "customer" | "provider" | "admin";

export type VehicleType =
  | "sedan"
  | "sUV"
  | "hatchback"
  | "coupe"
  | "convertible"
  | "pickup"
  | "van"
  | "bus"
  | "luxury";

export type TransmissionType = "automatic" | "manual";

export type FuelType = "petrol" | "diesel" | "hybrid" | "electric";

// Operational state — is the vehicle bookable right now
export type VehicleStatus = "available" | "rented" | "maintenance" | "inactive";

// Moderation state — has admin approved this listing
export type VehicleApprovalStatus = "pending" | "approved" | "rejected" | "suspended";

// Matches your actual BookingService: Pending -> Approved -> Active -> Completed,
// with Rejected/Cancelled as terminal off-ramps. Pickup moves Approved -> Active
// directly (setting PickedUpAt) — there's no separate "ready for pickup" status.
export type BookingStatus = "pending" | "approved" | "active" | "completed" | "rejected" | "cancelled";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  active: "Active",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  sedan: "Sedan",
  sUV: "SUV",
  hatchback: "Hatchback",
  coupe: "Coupe",
  convertible: "Convertible",
  pickup: "Pickup",
  van: "Van",
  bus: "Bus",
  luxury: "Luxury",
};

export const TRANSMISSION_LABELS: Record<TransmissionType, string> = {
  automatic: "Automatic",
  manual: "Manual",
};

export const FUEL_LABELS: Record<FuelType, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  hybrid: "Hybrid",
  electric: "Electric",
};

export const APPROVAL_LABELS: Record<VehicleApprovalStatus, string> = {
  pending: "Pending review",
  approved: "Live",
  rejected: "Rejected",
  suspended: "Suspended",
};

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  available: "Available",
  rented: "Rented",
  maintenance: "Maintenance",
  inactive: "Deactivated",
};
