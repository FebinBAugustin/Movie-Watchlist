const STORAGE_KEY = "movie_watchlist";

// Get all movies
export const getWatchlist = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

// Add movie
export const addToWatchlist = (movie) => {
  const watchlist = getWatchlist();

  const exists = watchlist.find(
    (item) => item.imdbID === movie.imdbID
  );

  if (!exists) {
    watchlist.push({
      ...movie,
      status: "Plan to Watch",
      rating: 0,
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }
};

// Remove movie
export const removeFromWatchlist = (imdbID) => {
  const updated = getWatchlist().filter(
    (movie) => movie.imdbID !== imdbID
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// Update movie status
export const updateMovieStatus = (imdbID) => {
  const watchlist = getWatchlist();

  const updated = watchlist.map((movie) => {
    if (movie.imdbID === imdbID) {
      let nextStatus = "Plan to Watch";

      if (movie.status === "Plan to Watch") {
        nextStatus = "Watching";
      } else if (movie.status === "Watching") {
        nextStatus = "Watched";
      }

      return {
        ...movie,
        status: nextStatus,
      };
    }

    return movie;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// Update movie rating
export const updateMovieRating = (imdbID, rating) => {
  const updated = getWatchlist().map((movie) =>
    movie.imdbID === imdbID
      ? {
          ...movie,
          rating,
        }
      : movie
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};