import type { Genre } from "@/api/types";

export type SortOption =
  | "pop_desc"
  | "pop_asc"
  | "date_desc"
  | "date_asc"
  | "rating_desc"
  | "rating_asc";

export interface Props {
  genres: Genre[];
  availableYears: number[];
  selectedGenre: string;
  setSelectedGenre: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  minRating: number;
  setMinRating: (value: number) => void;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  resetFilters: () => void;
  onCloseMobile?: () => void;
}
