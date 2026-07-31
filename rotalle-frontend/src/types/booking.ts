import type { BookingStatus } from "./enums";

export interface CreateBookingRequest {
  vehicleId: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
}

export interface BookingDecisionRequest {
  reason: string; // required by the backend DTO — always send a non-empty value
}

// Confirmed against the real BookingResponse DTO — flat, not nested.
export interface BookingResponse {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}
