import { useState } from "react";
import { Sparkles, Search } from "lucide-react";
import toast from "react-hot-toast";

import MovieCard from "../components/MovieCard";
import MovieDetailsModal from "../components/MovieDetailsModal";

import {
  searchMovies,
  getMovieDetails,
} from "../services/movieService";

import { addToWatchlist } from "../services/watchlistService";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Movie selected for popup
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a movie name.");
      return;
    }

    setLoading(true);

    try {
      const results = await searchMovies(query);
      setMovies(results);

      if (results.length === 0) {
        toast("No movies found.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to search movies.");
    }

    setLoading(false);
  };

  const handleAddToWatchlist = (movie) => {
    addToWatchlist(movie);

    toast.success(`🎬 "${movie.title}" added to Watchlist!`, {
      duration: 2500,
      style: {
        borderRadius: "12px",
        background: "#1E1E24",
        color: "#fff",
        border: "1px solid #ff6b35",
      },
    });
  };

  const handleViewDetails = async (imdbID) => {
    try {
      const movie = await getMovieDetails(imdbID);

      if (movie) {
        setSelectedMovie(movie);
      } else {
        toast.error("Movie details not found.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load movie details.");
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2A0A12] via-[#1A0A0B] to-paper px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-stub/80 px-4 py-1.5 text-sm text-ink2">
            <Sparkles size={14} className="text-flame" />
            Your cinema, organised.
          </span>

          <h1 className="font-display max-w-2xl text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Every story
            <br />
            worth <span className="text-flame">watching.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-ink2">
            Search thousands of films, build your personal watchlist, and rate
            every movie you've experienced.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-line bg-stub/80 p-1.5 pl-4"
          >
            <Search size={18} className="text-ink2" />

            <input
              type="text"
              placeholder="Search for Interstellar, Leo, Dune..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent py-2 text-sm text-ink placeholder:text-ink2/70 outline-none"
            />

            <button
              type="submit"
              className="rounded-full bg-flame px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Search Results */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="mb-8 text-3xl font-bold text-ink">
          Search Results
        </h2>

        {loading ? (
          <div className="py-10 text-center">
            <p className="text-lg text-ink2">Loading movies...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-stub/40 px-6 py-10 text-center">
            <p className="text-lg font-semibold text-ink">
              Search for your favourite movies 🎬
            </p>

            <p className="mt-2 text-sm text-ink2">
              Results will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                imdbID={movie.imdbID}
                title={movie.Title}
                year={movie.Year}
                poster={movie.Poster}
                onAddToWatchlist={handleAddToWatchlist}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Movie Details Popup */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}