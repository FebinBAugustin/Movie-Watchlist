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

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    setWatchlist(getWatchlist());
  };

  const handleRemove = (imdbID) => {
    if (window.confirm("Remove this movie from your watchlist?")) {
      removeFromWatchlist(imdbID);
      loadWatchlist();
      toast.success("Movie removed!");
    }
  };

  const handleStatus = (imdbID) => {
    updateMovieStatus(imdbID);
    loadWatchlist();
    toast.success("Status updated!");
  };

  const handleRating = (imdbID, rating) => {
    updateMovieRating(imdbID, rating);
    loadWatchlist();
    toast.success("Rating updated!");
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

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold text-white">
          🎬 My Watchlist
        </h1>

        <span className="rounded-full bg-flame px-4 py-2 font-semibold text-white">
          {watchlist.length} Movies
        </span>
      </div>

      {/* Filter Buttons */}
      <div className="mt-8 flex flex-wrap gap-3">
        {["All", "Plan to Watch", "Watching", "Watched"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-lg px-4 py-2 font-semibold transition ${
              filter === item
                ? "bg-flame text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredMovies.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-gray-600 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">
            No Movies Found
          </h2>

          <p className="mt-2 text-gray-400">
            Try changing the filter or add movies from the Home page.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((movie) => (
            <div
              key={movie.imdbID}
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
                <h2 className="text-xl font-bold text-white">
                  {movie.title}
                </h2>

                <p className="mt-1 text-gray-400">
                  {movie.year}
                </p>

                {/* Status */}
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
                  onClick={() => handleStatus(movie.imdbID)}
                  className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Change Status
                </button>

                {/* Rating */}
                <div className="mt-5">
                  <p className="mb-2 font-semibold text-white">
                    Your Rating
                  </p>

                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        handleRating(movie.imdbID, star)
                      }
                      className="text-3xl transition hover:scale-125"
                    >
                      {star <= movie.rating ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(movie.imdbID)}
                  className="mt-6 w-full rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
                >
                  🗑 Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}