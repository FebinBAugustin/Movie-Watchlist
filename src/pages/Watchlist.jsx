import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getWatchlist,
  removeFromWatchlist,
  updateMovieStatus,
  updateMovieRating,
} from "../services/watchlistService";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setIsLoading(true);
    setError("");

    try {
      const movies = await getWatchlist();
      setWatchlist(movies || []);
    } catch (err) {
      setError("Unable to load your watchlist right now.");
      toast.error("Failed to load your watchlist.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (movieId) => {
    if (!window.confirm("Remove this movie from your watchlist?")) {
      return;
    }

    try {
      await removeFromWatchlist(movieId);
      await loadWatchlist();
      toast.success("Movie removed!");
    } catch (err) {
      toast.error("Could not remove this movie.");
    }
  };

  const handleStatus = async (movieId, currentStatus) => {
    const nextStatus =
      currentStatus === "Plan to Watch"
        ? "Watching"
        : currentStatus === "Watching"
        ? "Watched"
        : "Plan to Watch";

    try {
      await updateMovieStatus(movieId, nextStatus);
      await loadWatchlist();
      toast.success("Status updated!");
    } catch (err) {
      toast.error("Could not update the movie status.");
    }
  };

  const handleRating = async (movieId, rating) => {
    try {
      await updateMovieRating(movieId, rating);
      await loadWatchlist();
      toast.success("Rating updated!");
    } catch (err) {
      toast.error("Could not update the movie rating.");
    }
  };

  const filteredMovies =
    filter === "All"
      ? watchlist
      : watchlist.filter((movie) => movie.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "Watched":
        return "bg-green-600";
      case "Watching":
        return "bg-blue-600";
      default:
        return "bg-yellow-500 text-black";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold text-white">🎬 My Watchlist</h1>

        <span className="rounded-full bg-flame px-4 py-2 font-semibold text-white">
          {watchlist.length} Movies
        </span>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {['All', 'Plan to Watch', 'Watching', 'Watched'].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-lg px-4 py-2 font-semibold transition ${
              filter === item
                ? 'bg-flame text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-500/40 bg-red-950/60 p-4 text-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-10 text-center text-gray-400">
          Loading your watchlist...
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-gray-600 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">No Movies Found</h2>

          <p className="mt-2 text-gray-400">
            Try changing the filter or add movies from the Home page.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((movie) => {
            const movieId = movie._id || movie.imdbID;

            return (
              <div
                key={movieId}
                className="overflow-hidden rounded-2xl bg-gray-900 shadow-lg transition hover:scale-105"
              >
                <img
                  src={
                    movie.poster !== "N/A"
                      ? movie.poster
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={movie.title}
                  className="h-96 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-bold text-white">{movie.title}</h2>

                  <p className="mt-1 text-gray-400">{movie.year}</p>

                  <div className="mt-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                        movie.status
                      )}`}
                    >
                      {movie.status}
                    </span>
                  </div>

                  <button
                    onClick={() => handleStatus(movieId, movie.status)}
                    className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    Change Status
                  </button>

                  <div className="mt-5">
                    <p className="mb-2 font-semibold text-white">Your Rating</p>

                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(movieId, star)}
                        className="text-3xl transition hover:scale-125"
                      >
                        {star <= movie.rating ? "⭐" : "☆"}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleRemove(movieId)}
                    className="mt-6 w-full rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}