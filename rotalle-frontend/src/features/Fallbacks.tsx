import { Link } from "react-router-dom";

export function Unauthorized() {
  return (
    <div className="text-center py-24">
      <h1 className="text-2xl font-display mb-2">You don't have access to this page</h1>
      <Link to="/" className="text-bronze hover:underline">
        Go home
      </Link>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-2xl font-display mb-2">Page not found</h1>
      <Link to="/" className="text-bronze hover:underline">
        Go home
      </Link>
    </div>
  );
}
