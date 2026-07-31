import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, dashboardPathFor } from "@/auth/AuthContext";
import { extractErrorMessage } from "@/api/client";
import type { RegisterRequest } from "@/types/auth";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequest>({
    fullName: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await register(form);
      navigate(dashboardPathFor(user.role));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12 card p-6 space-y-4">
      <h1 className="text-xl font-display text-center">Create your account</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-muted block mb-1">Full name</label>
          <input
            required
            className="input"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Email</label>
          <input
            type="email"
            required
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Password</label>
          <input
            type="password"
            required
            minLength={8}
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">I am a</label>
          <div className="flex gap-2">
            {(["customer", "provider"] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-2 rounded-card border text-sm capitalize transition-colors ${
                  form.role === r
                    ? "border-bronze text-bronze bg-bronze/10"
                    : "border-champagne-muted/30 text-muted"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="text-sm text-muted text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-bronze hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
