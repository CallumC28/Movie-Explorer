import axios from "axios";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

if (!apiKey) {
  console.warn("VITE_TMDB_API_KEY is not set — TMDB requests will fail.");
}

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: apiKey,
    language: "en-US",
  },
});
