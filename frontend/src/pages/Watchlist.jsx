import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getWatchlist,
  removeFromWatchlist,
  updateMovieStatus,
  updateMovieRating,
} from "../services/watchlistService";
import { getMovieDetails } from "../services/movieService";
import MovieDetailsModal from "../components/MovieDetailsModal";
import { Filter, ArrowUpDown, Trash2, Eye, Star, Sparkles, RefreshCw } from "lucide-react";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [filter, setFilter] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [sortOption, setSortOption] = useState("date-desc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

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

  const handleViewDetails = async (imdbID) => {
    try {
      const movie = await getMovieDetails(imdbID);

      if (movie) {
        setSelectedMovie(movie);
      } else {
        toast.error("Unable to load movie details.");
      }
    } catch (err) {
      toast.error("Unable to load movie details.");
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilter("All");
    setGenreFilter("All");
    setYearFilter("All");
    setSortOption("date-desc");
  };

  // Get unique genres present in user's watchlist
  const uniqueGenres = Array.from(
    new Set(
      watchlist
        .flatMap((movie) => (movie.genre ? movie.genre.split(", ").map((g) => g.trim()) : []))
        .filter(Boolean)
    )
  ).sort();

  // Get unique release years present in user's watchlist (4-digit format)
  const uniqueYears = Array.from(
    new Set(
      watchlist
        .map((movie) => {
          const match = movie.year ? movie.year.match(/\d{4}/) : null;
          return match ? match[0] : null;
        })
        .filter(Boolean)
    )
  ).sort((a, b) => b - a);

  // Filter and Sort movies
  let filteredMovies = [...watchlist];

  // 1. Status Filter
  if (filter !== "All") {
    filteredMovies = filteredMovies.filter((movie) => movie.status === filter);
  }

  // 2. Genre Filter
  if (genreFilter !== "All") {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.genre && movie.genre.toLowerCase().includes(genreFilter.toLowerCase())
    );
  }

  // 3. Year Filter
  if (yearFilter !== "All") {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.year && movie.year.includes(yearFilter)
    );
  }

  // 4. Sorting
  filteredMovies.sort((a, b) => {
    if (sortOption === "title-asc") {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === "title-desc") {
      return b.title.localeCompare(a.title);
    }
    if (sortOption === "rating-desc") {
      return b.rating - a.rating;
    }
    if (sortOption === "rating-asc") {
      return a.rating - b.rating;
    }
    if (sortOption === "date-asc") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }
    // default: date-desc
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Watched":
        return "bg-green-600/90 text-white";
      case "Watching":
        return "bg-blue-600/90 text-white";
      default:
        return "bg-yellow-500/90 text-black";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
            🎬 My Watchlist
          </h1>
          <p className="text-sm text-ink2 mt-2">Manage, filter, and rate your personal library</p>
        </div>

        <span className="self-start rounded-full bg-flame px-4 py-2 font-semibold text-white text-sm shadow-lg">
          {watchlist.length} {watchlist.length === 1 ? "Movie" : "Movies"} Total
        </span>
      </div>

      {/* Filter and Sorting Dashboard */}
      {watchlist.length > 0 && (
        <div className="mt-8 rounded-2xl border border-line bg-stub/40 p-6 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Status tabs */}
            <div className="flex flex-wrap gap-2">
              {["All", "Plan to Watch", "Watching", "Watched"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    filter === item
                      ? "bg-flame text-white shadow-md shadow-flame/20"
                      : "bg-gray-800 text-ink2 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Dropdown Filters & Sorting */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Genre filter */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-ink2" />
                <select
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  className="rounded-xl border border-line bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-flame transition"
                >
                  <option value="All">All Genres</option>
                  {uniqueGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year filter */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-ink2" />
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="rounded-xl border border-line bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-flame transition"
                >
                  <option value="All">All Years</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-ink2" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="rounded-xl border border-line bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-flame transition"
                >
                  <option value="date-desc">Date Added (Newest)</option>
                  <option value="date-asc">Date Added (Oldest)</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="rating-desc">Rating (High to Low)</option>
                  <option value="rating-asc">Rating (Low to High)</option>
                </select>
              </div>

              {/* Reset button */}
              {(filter !== "All" || genreFilter !== "All" || yearFilter !== "All" || sortOption !== "date-desc") && (
                <button
                  onClick={resetFilters}
                  className="rounded-xl bg-gray-800 p-2 text-ink2 hover:bg-gray-700 hover:text-white transition"
                  title="Reset Filters"
                >
                  <RefreshCw size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-950/60 p-4 text-red-200 shadow-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-16 text-center text-ink2">Loading your watchlist...</div>
      ) : filteredMovies.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-stub/20 p-12 text-center">
          <h2 className="text-2xl font-bold text-ink">No Movies Found</h2>
          <p className="mt-2 text-sm text-ink2">
            {watchlist.length > 0
              ? "Try broadening your filter criteria or reset them."
              : "Search and add movies from the Home page to build your watchlist."}
          </p>
          {watchlist.length > 0 && (
            <button
              onClick={resetFilters}
              className="mt-4 rounded-xl bg-flame px-4 py-2 font-semibold text-white hover:opacity-90 transition text-sm"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((movie) => {
            const movieId = movie._id || movie.imdbID;

            return (
              <div
                key={movieId}
                className="overflow-hidden rounded-2xl bg-stub border border-line shadow-lg transition hover:scale-[1.02] flex flex-col justify-between"
              >
                <div className="relative">
                  <img
                    src={
                      movie.poster !== "N/A"
                        ? movie.poster
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={movie.title}
                    className="h-96 w-full object-cover"
                  />
                  {/* Rating / Year Tag overlay */}
                  <span className="absolute top-3 left-3 bg-black/75 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                    📅 {movie.year}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-ink line-clamp-1">{movie.title}</h2>
                    
                    {/* Genres tag display */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {movie.genre && movie.genre !== "Unknown" ? (
                        movie.genre.split(", ").map((genre) => (
                          <span
                            key={genre}
                            className="rounded bg-gray-800 border border-line px-2 py-0.5 text-xs text-ink2 font-medium"
                          >
                            {genre}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-ink2/50 italic">Genre unknown</span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                          movie.status
                        )}`}
                      >
                        {movie.status}
                      </span>

                      {/* Interactive rating stars */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(movieId, star)}
                            className="text-xl transition hover:scale-125 focus:outline-none"
                            title={`Rate ${star} Stars`}
                          >
                            {star <= movie.rating ? "★" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 border-t border-line/60 pt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatus(movieId, movie.status)}
                        className="flex-1 rounded-xl bg-blue-600/90 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={14} />
                        Change Status
                      </button>

                      <button
                        onClick={() => handleViewDetails(movie.imdbID)}
                        className="flex-1 rounded-xl bg-indigo-600/90 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition flex items-center justify-center gap-1.5"
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(movieId)}
                      className="w-full rounded-xl bg-red-600/20 border border-red-500/30 py-2 text-xs font-semibold text-red-400 hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-1.5"
                    >
                      <Trash2 size={14} />
                      Remove Movie
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}