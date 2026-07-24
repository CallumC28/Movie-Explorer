import { tmdb } from "./client";
import type { Genre, Movie, MovieDetails } from "./types";

export const PAGE_SIZE = 20;

export async function getTrendingMovies(page = 1): Promise<Movie[]> {
  const { data } = await tmdb.get("/trending/movie/week", { params: { page } });
  return data.results ?? [];
}

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  if (!query) return [];
  const { data } = await tmdb.get("/search/movie", {
    params: { query, page, include_adult: false },
  });
  return data.results ?? [];
}

export interface DiscoverFilters {
  genre?: string;
  year?: string;
  minRating?: number;
  sortBy: string;
}

export async function discoverMovies(
  filters: DiscoverFilters,
  page = 1,
): Promise<Movie[]> {
  const { data } = await tmdb.get("/discover/movie", {
    params: {
      page,
      include_adult: false,
      sort_by: filters.sortBy,
      "vote_count.gte": 100, // keeps 10.0-with-3-votes junk out of rating sorts
      ...(filters.genre && { with_genres: filters.genre }),
      ...(filters.year && { primary_release_year: filters.year }),
      ...(filters.minRating && { "vote_average.gte": filters.minRating }),
    },
  });
  return data.results ?? [];
}

const FALLBACK_GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10749, name: "Romance" },
  { id: 27, name: "Horror" },
];

export async function getGenres(): Promise<Genre[]> {
  try {
    const { data } = await tmdb.get("/genre/movie/list");
    return data.genres ?? [];
  } catch {
    return FALLBACK_GENRES;
  }
}

export async function getMovieById(id: string): Promise<MovieDetails> {
  const { data } = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: "credits,videos,similar,watch/providers" },
  });
  return data;
}
