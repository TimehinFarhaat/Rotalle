import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/NavBar";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-charcoal text-champagne">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
