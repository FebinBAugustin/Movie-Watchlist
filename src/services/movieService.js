import axios from "axios";

const API_KEY = "5ab5a6b3";
const BASE_URL = "https://www.omdbapi.com/";

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