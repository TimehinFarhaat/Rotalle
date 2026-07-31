import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div className="text-center py-24 space-y-6">
      <h1 className="text-4xl md:text-5xl font-display text-champagne">
        Rent extraordinary vehicles.
      </h1>
      <p className="text-muted max-w-md mx-auto">
        Rotalle connects discerning drivers with premium vehicles from trusted providers.
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/vehicles" className="btn-primary">
          Browse Vehicles
        </Link>
        <Link to="/register" className="btn-outline">
          List Your Vehicle
        </Link>
      </div>
    </div>
  );
}
