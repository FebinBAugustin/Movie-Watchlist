import { useState, useEffect } from "react";
import { Sparkles, Search, TrendingUp, Loader2, Filter, ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";

import MovieCard from "../components/MovieCard";
import MovieDetailsModal from "../components/MovieDetailsModal";

import {
  searchMovies,
  getMovieDetails,
  getTrendingMovies,
} from "../services/movieService";

import { addToWatchlist } from "../services/watchlistService";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Trending state
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  // Filters state
  const [genreFilter, setGenreFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [sortOption, setSortOption] = useState("default");

  // Movie selected for popup
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    async function loadTrending() {
      setTrendingLoading(true);
      try {
        const results = await getTrendingMovies();
        setTrendingMovies(results);
      } catch (err) {
        console.error("Failed to load trending movies:", err);
      } finally {
        setTrendingLoading(false);
      }
    }

    void loadTrending();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a movie name.");
      return;
    }

    setLoading(true);
    resetFilters();

    try {
      const results = await searchMovies(query);
      
      // Concurrently hydrate detailed movie info for all search results to get Genre, Country, IMDb Rating, etc.
      const detailedResults = await Promise.all(
        results.map(async (movie) => {
          try {
            const details = await getMovieDetails(movie.imdbID);
            return details || movie;
          } catch (e) {
            console.error("Failed to fetch details for search result:", movie.Title, e);
            return movie;
          }
        })
      );

      setMovies(detailedResults);

      if (results.length === 0) {
        toast("No movies found.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to search movies.");
    }

    setLoading(false);
  };

  const handleAddToWatchlist = async (movie) => {
    const loadingToast = toast.loading("Adding to watchlist...");
    try {
      let genre = "Unknown";
      
      // Extract genre if already present, otherwise fetch details
      if (movie.genre || movie.Genre) {
        genre = movie.genre || movie.Genre;
      } else {
        try {
          const details = await getMovieDetails(movie.imdbID);
          if (details && details.Genre) {
            genre = details.Genre;
          }
        } catch (err) {
          console.error("Failed to fetch detailed movie genre", err);
        }
      }

      await addToWatchlist({
        imdbID: movie.imdbID,
        title: movie.title || movie.Title,
        year: movie.year || movie.Year,
        poster: movie.poster || movie.Poster,
        genre,
      });

      toast.dismiss(loadingToast);
      toast.success(`🎬 "${movie.title || movie.Title}" added to Watchlist!`, {
        duration: 2500,
        style: {
          borderRadius: "12px",
          background: "#1E1E24",
          color: "#fff",
          border: "1px solid #ff6b35",
        },
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error("Failed to add to Watchlist. Ensure you are logged in.");
    }
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

  // Clear search and return to trending view
  const clearSearch = () => {
    setQuery("");
    setMovies([]);
    resetFilters();
  };

  const resetFilters = () => {
    setGenreFilter("All");
    setCountryFilter("All");
    setYearFilter("All");
    setSortOption("default");
  };

  // Active list determines which set of movies we are currently filtering and sorting
  const activeList = query.trim() && movies.length > 0 ? movies : trendingMovies;

  // Extract unique genres dynamically
  const uniqueGenres = Array.from(
    new Set(
      activeList
        .flatMap((movie) => (movie.Genre ? movie.Genre.split(", ").map((g) => g.trim()) : []))
        .filter(Boolean)
    )
  ).sort();

  // Extract unique countries dynamically
  const uniqueCountries = Array.from(
    new Set(
      activeList
        .flatMap((movie) => (movie.Country ? movie.Country.split(", ").map((c) => c.trim()) : []))
        .filter(Boolean)
    )
  ).sort();

  // Extract unique release years dynamically
  const uniqueYears = Array.from(
    new Set(
      activeList
        .map((movie) => {
          const match = movie.Year ? movie.Year.match(/\d{4}/) : null;
          return match ? match[0] : null;
        })
        .filter(Boolean)
    )
  ).sort((a, b) => b - a);

  // Apply filters and sorting
  let filteredMovies = [...activeList];

  // 1. Genre filter
  if (genreFilter !== "All") {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.Genre && movie.Genre.toLowerCase().includes(genreFilter.toLowerCase())
    );
  }

  // 2. Country filter
  if (countryFilter !== "All") {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.Country && movie.Country.toLowerCase().includes(countryFilter.toLowerCase())
    );
  }

  // 3. Year filter
  if (yearFilter !== "All") {
    filteredMovies = filteredMovies.filter(
      (movie) => movie.Year && movie.Year.includes(yearFilter)
    );
  }

  // 4. Sorting
  if (sortOption !== "default") {
    filteredMovies.sort((a, b) => {
      if (sortOption === "title-asc") {
        return (a.Title || "").localeCompare(b.Title || "");
      }
      if (sortOption === "title-desc") {
        return (b.Title || "").localeCompare(a.Title || "");
      }
      if (sortOption === "year-desc") {
        return (b.Year || "").localeCompare(a.Year || "");
      }
      if (sortOption === "year-asc") {
        return (a.Year || "").localeCompare(b.Year || "");
      }
      if (sortOption === "rating-desc") {
        const rA = parseFloat(a.imdbRating) || 0;
        const rB = parseFloat(b.imdbRating) || 0;
        return rB - rA;
      }
      if (sortOption === "rating-asc") {
        const rA = parseFloat(a.imdbRating) || 0;
        const rB = parseFloat(b.imdbRating) || 0;
        return rA - rB;
      }
      return 0;
    });
  }

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
              className="rounded-full bg-flame px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Section */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-flame mx-auto" />
            <p className="text-lg text-ink2 mt-4">Searching and loading movie details...</p>
          </div>
        ) : (
          <div>
            {/* Heading row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {query.trim() && movies.length > 0 ? (
                  <h2 className="text-3xl font-bold text-ink">Search Results</h2>
                ) : (
                  <>
                    <TrendingUp className="text-flame h-6 w-6" />
                    <h2 className="text-3xl font-bold text-ink">Trending Today</h2>
                  </>
                )}
              </div>

              {query.trim() && movies.length > 0 && (
                <button
                  onClick={clearSearch}
                  className="text-sm font-semibold text-flame hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>

            {/* Filter Dashboard */}
            {activeList.length > 0 && (
              <div className="mb-8 rounded-2xl border border-line bg-stub/40 p-5 backdrop-blur flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-ink2" />
                  <span className="text-sm font-semibold text-ink">Filter & Sort</span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Genre select */}
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="rounded-xl border border-line bg-gray-800 px-3 py-2 text-xs text-white outline-none focus:border-flame transition"
                  >
                    <option value="All">All Genres</option>
                    {uniqueGenres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>

                  {/* Country select */}
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="rounded-xl border border-line bg-gray-800 px-3 py-2 text-xs text-white outline-none focus:border-flame transition"
                  >
                    <option value="All">All Countries</option>
                    {uniqueCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>

                  {/* Year select */}
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="rounded-xl border border-line bg-gray-800 px-3 py-2 text-xs text-white outline-none focus:border-flame transition"
                  >
                    <option value="All">All Years</option>
                    {uniqueYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  {/* Sort selector */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={14} className="text-ink2" />
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="rounded-xl border border-line bg-gray-800 px-3 py-2 text-xs text-white outline-none focus:border-flame transition"
                    >
                      <option value="default">Default Sort</option>
                      <option value="title-asc">Title (A-Z)</option>
                      <option value="title-desc">Title (Z-A)</option>
                      <option value="year-desc">Year (Newest)</option>
                      <option value="year-asc">Year (Oldest)</option>
                      <option value="rating-desc">IMDb Rating (Highest)</option>
                      <option value="rating-asc">IMDb Rating (Lowest)</option>
                    </select>
                  </div>

                  {/* Reset button */}
                  {(genreFilter !== "All" || countryFilter !== "All" || yearFilter !== "All" || sortOption !== "default") && (
                    <button
                      onClick={resetFilters}
                      className="rounded-xl bg-gray-800 px-3 py-2 text-xs font-medium text-ink hover:bg-gray-700 hover:text-white transition"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Movie Grid */}
            {trendingLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-flame mx-auto" />
                <p className="text-sm text-ink2 mt-4">Loading trending movies...</p>
              </div>
            ) : filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    imdbID={movie.imdbID}
                    title={movie.Title}
                    year={movie.Year}
                    poster={movie.Poster}
                    genre={movie.Genre}
                    country={movie.Country}
                    imdbRating={movie.imdbRating}
                    onAddToWatchlist={handleAddToWatchlist}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-stub/40 px-6 py-12 text-center">
                <p className="text-lg font-semibold text-ink">No Movies Match Your Criteria 🎬</p>
                <p className="mt-2 text-sm text-ink2">Try resetting your filters or search query.</p>
                {(genreFilter !== "All" || countryFilter !== "All" || yearFilter !== "All" || sortOption !== "default") && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 rounded-xl bg-flame px-4 py-2 font-semibold text-white hover:opacity-90 transition text-sm"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
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