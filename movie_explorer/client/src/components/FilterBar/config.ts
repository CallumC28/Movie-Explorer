import type { SortOption } from "./types/types";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "pop_desc", label: "Popularity ↓" },
  { value: "pop_asc", label: "Popularity ↑" },
  { value: "date_desc", label: "Release Date ↓" },
  { value: "date_asc", label: "Release Date ↑" },
  { value: "rating_desc", label: "Rating ↓" },
  { value: "rating_asc", label: "Rating ↑" },
];

export const RATING_MARKS = { 0: "Any", 5: "5", 7: "7", 9: "9" };
