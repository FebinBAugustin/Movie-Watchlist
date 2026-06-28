export default function MovieCard({ title, year, poster }) {
  return (
    <div className="rounded-xl border border-line bg-stub overflow-hidden shadow-lg">
      <img
        src={poster}
        alt={title}
        className="h-72 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-ink2">{year}</p>

        <button className="mt-4 w-full rounded-lg bg-flame py-2 text-white font-semibold hover:opacity-90">
          Add to Watchlist
        </button>
      </div>
    </div>
  );
}