# Rotalle Frontend Scaffold

React + TypeScript + Vite + Tailwind + React Router + TanStack Query, built against
the DTOs and services you've shared so far.

## Setup
```
npm install
cp .env.example .env   # point VITE_API_URL at your real API
npm run dev
```

## What's fully wired
- Auth: register/login/logout, JWT stored, role-based redirect after login
- Route guards: `ProtectedRoute` (must be logged in) + `RoleRoute` (must match role)
- **Light theme** — Ivory / Espresso / Metallic Bronze, no dark background, no
  green/blue/yellow/purple anywhere. Class names are unchanged from the original
  dark theme — only the hex values in `tailwind.config.js` moved — so further
  color tweaks go there, not in individual component files.
- Customer: browse (client-side pagination, 9/page) + search/filter, vehicle
  details with date selection, real booking creation, My Bookings with a
  lifecycle timeline and cancel (reason required)
- Provider: vehicle list, create/edit forms, dedicated vehicle details page with a
  full image manager (add/delete/set-primary) and deactivate, booking requests with
  approve/reject(reason)/pickup/return actions matching your actual state machine
  (Pending → Approved → Active → Completed, no separate "ready for pickup" state)
- Admin: dashboard stats, **clickable vehicle/provider/customer/booking lists**
  each with a details page (vehicle details include images + created date;
  provider details list their vehicles; booking details show the full timeline),
  vehicle approve/reject/suspend/**reinstate**, provider/customer suspend
  toggles, booking stats

## Known gaps / assumptions to fix as backend lands
- **`VehicleResponse.approvalStatus`** is typed as optional (`src/types/vehicle.ts`)
  because it's not yet on the backend DTO. Once added, provider vehicle list and
  admin vehicle list badges will just start rendering — no frontend change needed.
- **Booking pages are stubs** (`MyBookings.tsx`, `BookingRequests.tsx`) — empty-state
  placeholders since booking endpoints don't exist yet. Build these once Day 3
  booking DTOs/controller are ready; the date-selection UI on `VehicleDetails.tsx`
  is ready to hook into a real "create booking" call.
- **Enum casing**: `VehicleType.SUV` may serialize as `"sUV"` per
  `JsonNamingPolicy.CamelCase` — verify against a live response and fix
  `src/types/enums.ts` if needed.
- **Image manager** (add/delete/set-primary on an existing vehicle) isn't built yet —
  `VehicleForm.tsx` only handles image upload on *create*. Add a separate panel
  for edit mode using the `addImages`/`deleteImage`/`setPrimaryImage` calls already
  in `vehicle.api.ts`.
- No pagination anywhere (matches backend, which has none yet).
