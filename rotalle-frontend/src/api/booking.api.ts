import { apiClient } from "./client";
import type { BookingResponse, CreateBookingRequest } from "@/types/booking";

export const bookingApi = {
  // Customer
  create: (body: CreateBookingRequest) =>
    apiClient.post<BookingResponse>("/bookings", body).then((r) => r.data),

  getMyBookings: () => apiClient.get<BookingResponse[]>("/bookings").then((r) => r.data),

  getById: (id: string) => apiClient.get<BookingResponse>(`/bookings/${id}`).then((r) => r.data),

  // Reason is required by BookingDecisionRequest — always pass a real string.
  cancel: (id: string, reason: string) =>
    apiClient.put(`/bookings/${id}/cancel`, { reason }),

  // Provider
  getProviderBookings: () =>
    apiClient.get<BookingResponse[]>("/provider/bookings").then((r) => r.data),

  getProviderBooking: (id: string) =>
    apiClient.get<BookingResponse>(`/provider/bookings/${id}`).then((r) => r.data),

  approve: (id: string) => apiClient.put(`/provider/bookings/${id}/approve`),

  reject: (id: string, reason: string) =>
    apiClient.put(`/provider/bookings/${id}/reject`, { reason }),

  pickup: (id: string) => apiClient.put(`/provider/bookings/${id}/pickup`),

  returnVehicle: (id: string) => apiClient.put(`/provider/bookings/${id}/return`),
};

export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  rejectedBookings: number;
  totalRevenue: number;
}

export const adminBookingApi = {
  getAll: () => apiClient.get<BookingResponse[]>("/admin/bookings").then((r) => r.data),
  getById: (id: string) =>
    apiClient.get<BookingResponse>(`/admin/bookings/${id}`).then((r) => r.data),
  getStats: () => apiClient.get<BookingStats>("/admin/bookings/stats").then((r) => r.data),
};
