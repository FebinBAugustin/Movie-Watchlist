import axios from "axios";

const API_KEY = "5ab5a6b3";
const BASE_URL = "https://www.omdbapi.com/";

// Search movies
export const searchMovies = async (movieName) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        s: movieName,
      },
    });

    return response.data.Search || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

// Get full movie details
export const getMovieDetails = async (imdbID) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        i: imdbID,
        plot: "full",
      },
    });

    if (response.data.Response === "False") {
      throw new Error(response.data.Error);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};