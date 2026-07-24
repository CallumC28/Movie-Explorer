import type { Movie } from "@/api/types";

export type Density = "compact" | "comfy" | "spacious";

export interface Props {
  movies: Movie[];
  hasMore?: boolean;
  loadMore: () => void;
  loadingMore?: boolean;
  density?: Density;
}
