import type { SortOption } from "@/components/FilterBar";
import type { Density } from "@/components/MovieGrid";

const DENSITIES: Density[] = ["compact", "comfy", "spacious"];
export const DENSITY_OPTIONS = DENSITIES.map((d) => ({
  label: d[0].toUpperCase() + d.slice(1),
  value: d,
}));

export const SORT_BY: Record<SortOption, string> = {
  pop_desc: "popularity.desc",
  pop_asc: "popularity.asc",
  date_desc: "primary_release_date.desc",
  date_asc: "primary_release_date.asc",
  rating_desc: "vote_average.desc",
  rating_asc: "vote_average.asc",
};

const THIS_YEAR = new Date().getFullYear();
export const YEARS = Array.from(
  { length: THIS_YEAR - 1949 },
  (_, i) => THIS_YEAR - i,
);

// omitting a param from the URL means "default" — keeps shared links clean
export const PARAM_DEFAULTS = {
  q: "",
  genre: "all",
  year: "all",
  rating: "0",
  sort: "pop_desc",
} as const;
