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

// Fetch details of trending movies
export const getTrendingMovies = async () => {
  const trendingIDs = [
    "tt15239678", // Dune: Part Two
    "tt15398776", // Oppenheimer
    "tt0816692",  // Interstellar
    "tt9362722",  // Spider-Man: Across the Spider-Verse
    "tt6710474",  // Everything Everywhere All at Once
    "tt0468569",  // The Dark Knight
  ];

  try {
    const promises = trendingIDs.map(id => getMovieDetails(id));
    const results = await Promise.all(promises);
    return results.filter(movie => movie !== null);
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};