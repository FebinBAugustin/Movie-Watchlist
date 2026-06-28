import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

export default function Profile() {
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">Profile</h1>
      <div className="mt-6 rounded-2xl border border-line bg-stub/60 p-8">
        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-ink2">Movies watched</dt>
            <dd className="text-2xl text-ink">—</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-ink2">Average rating</dt>
            <dd className="text-2xl text-ink">—</dd>
          </div>
        </dl>
        <p className="mt-2 text-sm text-ink2/70">
          (Member 4 — wire these up to the watchlist stats endpoint.)
        </p>
        <button
          onClick={handleLogout}
          className="bg-flame focus-ring mt-6 rounded-full px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
