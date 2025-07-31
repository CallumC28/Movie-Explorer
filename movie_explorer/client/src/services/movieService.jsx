import axios from 'axios';

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';

export const getTrendingMovies = async () => {
  const res = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  return res.data.results;
};

export const searchMovies = async (query) => {
  const res = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  return res.data.results;
};

export const getMovieById = async (id) => {
  const res = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return res.data;
};
