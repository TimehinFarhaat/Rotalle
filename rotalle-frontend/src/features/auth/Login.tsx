import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, dashboardPathFor } from "@/auth/AuthContext";
import { extractErrorMessage } from "@/api/client";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      navigate(dashboardPathFor(user.role));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12 card p-6 space-y-4">
      <h1 className="text-xl font-display text-center">Welcome back</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-muted block mb-1">Email</label>
          <input
            type="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Password</label>
          <input
            type="password"
            required
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="text-sm text-muted text-center">
        No account?{" "}
        <Link to="/register" className="text-bronze hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
