import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-ink/10 bg-charcoal sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-wide text-champagne">
          ROTALLE
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {!user && (
            <>
              <Link to="/vehicles" className="hover:text-bronze transition-colors">
                Browse
              </Link>
              <Link to="/login" className="hover:text-bronze transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm !py-2">
                Register
              </Link>
            </>
          )}

          {user?.role === "customer" && (
            <>
              <Link to="/vehicles" className="hover:text-bronze transition-colors">
                Browse
              </Link>
              <Link to="/customer/bookings" className="hover:text-bronze transition-colors">
                My Bookings
              </Link>
            </>
          )}

          {user?.role === "provider" && (
            <>
              <Link to="/provider/vehicles" className="hover:text-bronze transition-colors">
                My Vehicles
              </Link>
              <Link to="/provider/bookings" className="hover:text-bronze transition-colors">
                Booking Requests
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/admin/dashboard" className="hover:text-bronze transition-colors">
                Dashboard
              </Link>
              <Link to="/admin/providers" className="hover:text-bronze transition-colors">
                Providers
              </Link>
              <Link to="/admin/customers" className="hover:text-bronze transition-colors">
                Customers
              </Link>
              <Link to="/admin/vehicles" className="hover:text-bronze transition-colors">
                Vehicles
              </Link>
              <Link to="/admin/bookings" className="hover:text-bronze transition-colors">
                Bookings
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-muted hover:text-champagne transition-colors"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
