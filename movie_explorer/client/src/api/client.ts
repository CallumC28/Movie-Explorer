import axios from 'axios';

// All TMDB traffic goes through /api/tmdb so the API key stays server-side
// (Vercel function in prod, vite dev proxy locally).
export const tmdb = axios.create({
  baseURL: '/api/tmdb',
  params: {
    language: 'en-US',
  },
});
