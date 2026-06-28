import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clapperboard } from "lucide-react";
import FormField from "../components/FormField";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!form.email.trim()) next.email = "Enter your email.";
    if (form.password.length < 6) next.password = "Use at least 6 characters.";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setServerError("");
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password });
      navigate("/login");
    } catch (err) {
      setServerError(
        err?.response?.data?.message || "Couldn't create your account. Try a different email."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-[#2A0A12] via-[#1A0A0B] to-paper px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-stub/90 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex items-center gap-2">
          <span className="bg-flame flex h-9 w-9 items-center justify-center rounded-lg">
            <Clapperboard size={18} className="text-white" />
          </span>
          <span className="font-display text-lg font-bold text-ink">
            CINE<span className="text-flame">LIST</span>
          </span>
        </div>

        <h1 className="font-display text-2xl font-bold text-ink">Create your account</h1>
        <p className="mt-1 mb-6 text-sm text-ink2">
          Start building a watchlist that's actually yours.
        </p>

        {serverError && (
          <p className="mb-4 rounded-lg border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Rahul"
            autoComplete="name"
            error={errors.name}
          />
          <FormField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email}
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            error={errors.password}
          />
          <FormField
            label="Confirm password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-flame focus-ring w-full rounded-full py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink2">
          Already have an account?{" "}
          <Link to="/login" className="focus-ring font-semibold text-ink underline-offset-2 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
