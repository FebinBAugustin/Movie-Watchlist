export default function MovieCard({
  imdbID,
  title,
  year,
  poster,
  onAddToWatchlist,
  onViewDetails,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-stub shadow-lg">
      <img
        src={
          poster !== "N/A"
            ? poster
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={title}
        className="h-72 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-bold text-ink">{title}</h3>

        <p className="mt-1 text-sm text-ink2">{year}</p>

        <button
          onClick={() =>
            onAddToWatchlist({
              imdbID,
              title,
              year,
              poster,
            })
          }
          className="mt-4 w-full rounded-lg bg-flame py-2 font-semibold text-white hover:opacity-90"
        >
          Add to Watchlist
        </button>

        <button
          onClick={() => onViewDetails(imdbID)}
          className="mt-3 w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
        >
          View Details
        </button>
      </div>
    </div>
  );
}