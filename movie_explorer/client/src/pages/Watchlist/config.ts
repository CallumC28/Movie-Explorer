import { WatchlistSort } from "./types/types";

export const SORT_OPTIONS: { value: WatchlistSort; label: string }[] = [
  { value: "added_desc", label: "Recently added" },
  { value: "title_asc", label: "Title (A–Z)" },
  { value: "rating_desc", label: "Rating (high → low)" },
  { value: "year_desc", label: "Year (new → old)" },
];
