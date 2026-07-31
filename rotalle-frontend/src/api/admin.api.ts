import { apiClient } from "./client";
import type { VehicleResponse } from "@/types/vehicle";

export interface DashboardResponse {
  totalUsers: number;
  totalProviders: number;
  totalCustomers: number;
  totalVehicles: number;
  pendingVehicles: number;
  approvedVehicles: number;
  rejectedVehicles: number;
  suspendedVehicles: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export interface ProviderListResponse {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  vehicleCount: number;
  pendingVehicles: number;
  approvedVehicles: number;
}

export interface ProviderDetailsResponse {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  vehicles: VehicleResponse[];
}

export interface CustomerListResponse {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export const adminApi = {
  dashboard: () => apiClient.get<DashboardResponse>("/admin/dashboard").then((r) => r.data),

  // Vehicles / approvals
  getPendingVehicles: () =>
    apiClient.get<VehicleResponse[]>("/admin/vehicles/pending").then((r) => r.data),
  getVehicles: () => apiClient.get<VehicleResponse[]>("/admin/vehicles").then((r) => r.data),
  getVehicle: (id: string) =>
    apiClient.get<VehicleResponse>(`/admin/vehicles/${id}`).then((r) => r.data),
  approveVehicle: (id: string) => apiClient.put(`/admin/vehicles/${id}/approve`),
  rejectVehicle: (id: string, reason?: string) =>
    apiClient.put(`/admin/vehicles/${id}/reject`, { reason }),
  suspendVehicle: (id: string, reason?: string) =>
    apiClient.put(`/admin/vehicles/${id}/suspend`, { reason }),
  reinstateVehicle: (id: string) => apiClient.put(`/admin/vehicles/${id}/reinstate`),

  // Providers
  getProviders: () =>
    apiClient.get<ProviderListResponse[]>("/admin/providers").then((r) => r.data),
  getProvider: (id: string) =>
    apiClient.get<ProviderDetailsResponse>(`/admin/providers/${id}`).then((r) => r.data),
  activateProvider: (id: string) => apiClient.put(`/admin/providers/${id}/activate`),
  suspendProvider: (id: string) => apiClient.put(`/admin/providers/${id}/suspend`),

  // Customers
  getCustomers: () =>
    apiClient.get<CustomerListResponse[]>("/admin/customers").then((r) => r.data),
  getCustomer: (id: string) =>
    apiClient.get<CustomerListResponse>(`/admin/customers/${id}`).then((r) => r.data),
  activateCustomer: (id: string) => apiClient.put(`/admin/customers/${id}/activate`),
  suspendCustomer: (id: string) => apiClient.put(`/admin/customers/${id}/suspend`),
};
