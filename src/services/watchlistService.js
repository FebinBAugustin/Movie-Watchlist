const STORAGE_KEY = "movie_watchlist";

export const getWatchlist = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const addToWatchlist = (movie) => {
  const watchlist = getWatchlist();

  const exists = watchlist.find(
    (item) => item.imdbID === movie.imdbID
  );

  if (!exists) {
    watchlist.push(movie);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }
};

export const removeFromWatchlist = (imdbID) => {
  const watchlist = getWatchlist().filter(
    (movie) => movie.imdbID !== imdbID
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
};