import axios from "axios";
import { getAuthToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const normalizeMovie = (movie) => ({
  ...movie,
  status: movie?.status || (movie?.watched ? "Watched" : "Plan to Watch"),
  rating: typeof movie?.rating === "number" ? movie.rating : 0,
  review: movie?.review || "",
});

export const getWatchlist = async () => {
  const { data } = await api.get("/movies");
  return (data || []).map(normalizeMovie);
};

export const addToWatchlist = async (movie) => {
  const payload = {
    title: movie?.title,
    genre: movie?.genre || movie?.type || "Unknown",
    rating: typeof movie?.rating === "number" ? movie.rating : 0,
    watched: false,
    status: "Plan to Watch",
    review: "",
    poster: movie?.poster || "N/A",
    year: movie?.year || "",
    imdbID: movie?.imdbID || "",
  };

  const { data } = await api.post("/movies", payload);
  return normalizeMovie(data);
};

export const removeFromWatchlist = async (movieId) => {
  await api.delete(`/movies/${movieId}`);
  return true;
};

export const updateMovieStatus = async (movieId, status) => {
  const { data } = await api.put(`/movies/${movieId}`, { status });
  return normalizeMovie(data);
};

export const updateMovieRating = async (movieId, rating) => {
  const { data } = await api.put(`/movies/${movieId}`, { rating });
  return normalizeMovie(data);
};

export const getWatchlistStats = async () => {
  const { data } = await api.get("/movies/stats");
  return data;
};