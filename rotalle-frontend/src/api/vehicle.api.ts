import { apiClient } from "./client";
import type {
  VehicleResponse,
  CreateVehicleFields,
  UpdateVehicleFields,
  VehicleSearchParams,
} from "@/types/vehicle";

function toVehicleFormData(fields: CreateVehicleFields | UpdateVehicleFields, images?: File[]) {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => fd.append(key, String(value)));
  images?.forEach((file) => fd.append("Images", file));
  return fd;
}

export const vehicleApi = {
  // Public / customer
  search: (params: VehicleSearchParams) =>
    apiClient.get<VehicleResponse[]>("/vehicles", { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<VehicleResponse>(`/vehicles/${id}`).then((r) => r.data),

  // Provider
  getMyVehicles: () =>
    apiClient.get<VehicleResponse[]>("/provider/vehicles").then((r) => r.data),

  getMyVehicleById: (id: string) =>
    apiClient.get<VehicleResponse>(`/provider/vehicles/${id}`).then((r) => r.data),

  create: (fields: CreateVehicleFields, images: File[]) =>
    apiClient
      .post<VehicleResponse>("/provider/vehicles", toVehicleFormData(fields, images), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  update: (id: string, fields: UpdateVehicleFields) =>
    apiClient.put<VehicleResponse>(`/provider/vehicles/${id}`, fields).then((r) => r.data),

  deactivate: (id: string) => apiClient.delete(`/provider/vehicles/${id}`),

  // Images — separate from the update form by design
  addImages: (id: string, images: File[]) => {
    const fd = new FormData();
    images.forEach((file) => fd.append("Images", file));
    return apiClient
      .post<VehicleResponse>(`/provider/vehicles/${id}/images`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  deleteImage: (vehicleId: string, imageId: string) =>
    apiClient.delete(`/provider/vehicles/${vehicleId}/images/${imageId}`),

  setPrimaryImage: (vehicleId: string, imageId: string) =>
    apiClient.put(`/provider/vehicles/${vehicleId}/images/${imageId}/primary`),
};
