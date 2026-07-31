import { Routes, Route } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { ProtectedRoute, RoleRoute } from "@/auth/guards";

import { Landing } from "@/features/Landing";
import { Unauthorized, NotFound } from "@/features/Fallbacks";
import { Login } from "@/features/auth/Login";
import { Register } from "@/features/auth/Register";

import { BrowseVehicles } from "@/features/customer/pages/BrowseVehicles";
import { VehicleDetails } from "@/features/customer/pages/VehicleDetails";
import { MyBookings } from "@/features/customer/pages/MyBookings";

import { MyVehicles } from "@/features/provider/pages/MyVehicles";
import { ProviderVehicleDetails } from "@/features/provider/pages/ProviderVehicleDetails";
import { VehicleForm } from "@/features/provider/pages/VehicleForm";
import { BookingRequests } from "@/features/provider/pages/BookingRequests";

import { AdminDashboard } from "@/features/admin/pages/Dashboard";
import { AdminVehicles } from "@/features/admin/pages/AdminVehicles";
import { AdminVehicleDetails } from "@/features/admin/pages/AdminVehicleDetails";
import { AdminProviders } from "@/features/admin/pages/AdminProviders";
import { AdminProviderDetails } from "@/features/admin/pages/AdminProviderDetails";
import { AdminCustomers } from "@/features/admin/pages/AdminCustomers";
import { AdminCustomerDetails } from "@/features/admin/pages/AdminCustomerDetails";
import { AdminBookings } from "@/features/admin/pages/AdminBookings";
import { AdminBookingDetails } from "@/features/admin/pages/AdminBookingDetails";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public */}
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="vehicles" element={<BrowseVehicles />} />
        <Route path="vehicles/:vehicleId" element={<VehicleDetails />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* Any authenticated user */}
        <Route element={<ProtectedRoute />}>
          {/* Customer only */}
          <Route element={<RoleRoute allow={["customer"]} />}>
            <Route path="customer/bookings" element={<MyBookings />} />
          </Route>

          {/* Provider only */}
          <Route element={<RoleRoute allow={["provider"]} />}>
            <Route path="provider/vehicles" element={<MyVehicles />} />
            <Route path="provider/vehicles/new" element={<VehicleForm />} />
            <Route path="provider/vehicles/:vehicleId/edit" element={<VehicleForm />} />
            <Route path="provider/vehicles/:vehicleId" element={<ProviderVehicleDetails />} />
            <Route path="provider/bookings" element={<BookingRequests />} />
          </Route>

          {/* Admin only */}
          <Route element={<RoleRoute allow={["admin"]} />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/vehicles" element={<AdminVehicles />} />
            <Route path="admin/vehicles/:vehicleId" element={<AdminVehicleDetails />} />
            <Route path="admin/providers" element={<AdminProviders />} />
            <Route path="admin/providers/:providerId" element={<AdminProviderDetails />} />
            <Route path="admin/customers" element={<AdminCustomers />} />
            <Route path="admin/customers/:customerId" element={<AdminCustomerDetails />} />
            <Route path="admin/bookings" element={<AdminBookings />} />
            <Route path="admin/bookings/:bookingId" element={<AdminBookingDetails />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
