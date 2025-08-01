import axios from 'axios';

const FALLBACK_API_KEY = 'YOUR_API_KEY';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || FALLBACK_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const client = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
});

let genreCache = null;

/**Fetches and caches the list of movie genres.*/
export async function getGenres() {
  if (genreCache) return genreCache;
  try {
    const { data } = await client.get('/genre/movie/list');
    genreCache = data.genres || [];
    return genreCache;
  } catch (e) {
    console.warn('Failed to fetch genres from TMDB, falling back to static list.', e);
    genreCache = [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' },
      { id: 80, name: 'Crime' },
      { id: 18, name: 'Drama' },
      { id: 10749, name: 'Romance' },
      { id: 27, name: 'Horror' },
    ];
    return genreCache;
  }
}

/**Gets trending movies (weekly) with optional paging.*/
export async function getTrendingMovies(page = 1) {
  try {
    const { data } = await client.get(`/trending/movie/week`, {
      params: { page },
    });
    return data.results || [];
  } catch (e) {
    console.error('getTrendingMovies error:', e);
    return [];
  }
}

/**Searches movies by query */
export async function searchMovies(query, page = 1) {
  if (!query) return [];
  try {
    const { data } = await client.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return data.results || [];
  } catch (e) {
    console.error('searchMovies error:', e);
    return [];
  }
}

/**Fetch a movie by its TMDB ID.*/
export async function getMovieById(id) {
  try {
    const { data } = await client.get(`/movie/${id}`);
    return data;
  } catch (e) {
    console.error('getMovieById error:', e);
    return null;
  }
}
