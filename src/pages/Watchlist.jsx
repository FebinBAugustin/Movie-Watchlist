export default function Watchlist() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">Your Watchlist</h1>
      <p className="mt-2 text-sm text-ink2">
        Saved movies, watch status, and ratings will render here.
      </p>
      <div className="mt-6 rounded-2xl border border-dashed border-line bg-stub/40 px-6 py-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink2">
          Watchlist table goes here
        </p>
        <p className="mt-1 text-sm text-ink2/70">
          (Member 2 — Movie Search &amp; Watchlist UI)
        </p>
      </div>
    </div>
  );
}
