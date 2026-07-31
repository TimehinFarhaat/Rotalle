import type {
  VehicleType,
  TransmissionType,
  FuelType,
  VehicleStatus,
  VehicleApprovalStatus,
} from "./enums";

export interface VehicleImageResponse {
  id: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface VehicleResponse {
  id: string;
  providerId: string;
  providerName: string;
  brand: string;
  model: string;
  year: number;
  vehicleType: VehicleType;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  dailyRate: number;
  location: string;
  description: string;
  images: VehicleImageResponse[];
  status: VehicleStatus;
  // NOTE: not yet on the backend DTO — add once VehicleResponse exposes it.
  // Provider/admin views need this for the approval badge; customer-facing
  // views never see anything but approved vehicles so it's optional there.
  approvalStatus?: VehicleApprovalStatus;
  createdAt: string;
}

// Fields only, sent as multipart/form-data (images attached separately)
export interface CreateVehicleFields {
  brand: string;
  model: string;
  year: number;
  dailyRate: number;
  seats: number;
  location: string;
  description: string;
  vehicleType: VehicleType;
  transmission: TransmissionType;
  fuelType: FuelType;
}

export interface UpdateVehicleFields {
  brand: string;
  model: string;
  year: number;
  vehicleType: VehicleType;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  dailyRate: number;
  location: string;
  description: string;
  status: VehicleStatus;
  // Images intentionally excluded — handled via separate
  // add/delete/set-primary endpoints, not the update form.
}

export interface VehicleSearchParams {
  search?: string;
  location?: string;
  vehicleType?: VehicleType;
  transmission?: TransmissionType;
  fuelType?: FuelType;
  seats?: number;
  minPrice?: number;
  maxPrice?: number;
}
