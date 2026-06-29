export default function MovieDetailsModal({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-gray-900 shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-white hover:bg-red-700"
        >
          ✕
        </button>

        <div className="grid gap-8 p-8 md:grid-cols-2">

          {/* Poster */}
          <img
            src={
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/400x600?text=No+Image"
            }
            alt={movie.Title}
            className="w-full rounded-xl shadow-lg"
          />

          {/* Details */}
          <div>

            <h1 className="text-4xl font-bold text-white">
              {movie.Title}
            </h1>

            <p className="mt-2 text-gray-400">
              {movie.Year} • {movie.Runtime}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {movie.Genre?.split(", ").map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-brass/20 text-violet-200 border border-brass/30 px-3 py-1 text-sm font-semibold"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-gray-300">

              <p>
                <strong>⭐ IMDb:</strong> {movie.imdbRating}
              </p>

              <p>
                <strong>🎬 Director:</strong> {movie.Director}
              </p>

              <p>
                <strong>✍ Writer:</strong> {movie.Writer}
              </p>

              <p>
                <strong>🎭 Actors:</strong> {movie.Actors}
              </p>

              <p>
                <strong>🌍 Language:</strong> {movie.Language}
              </p>

              <p>
                <strong>🏆 Awards:</strong> {movie.Awards}
              </p>

            </div>

            <div className="mt-6">
              <h2 className="mb-2 text-xl font-bold text-white">
                Plot
              </h2>

              <p className="leading-7 text-gray-300">
                {movie.Plot}
              </p>
            </div>

            {/* Trailer Button */}
            <div className="mt-6">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${movie.Title} official trailer`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                ▶ Watch Trailer
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}