export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  overview?: string;
  genre_ids?: number[];
  genres?: Genre[];
}

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
}

export interface Video {
  key: string;
  site: string;
  type: string;
  name: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface ProviderRegion {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface MovieDetails extends Movie {
  tagline?: string;
  runtime?: number | null;
  original_language?: string;
  original_title?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  production_countries?: { iso_3166_1: string; name: string }[];
  // via append_to_response=credits,videos,similar,watch/providers
  credits?: { cast: CastMember[] };
  videos?: { results: Video[] };
  similar?: { results: Movie[] };
  'watch/providers'?: { results: Record<string, ProviderRegion> };
}
