import { useEffect, useRef } from "react";
import MovieCard from "@/components/MovieCard";
import { Grid, Card } from "./components";
import { MIN_COL } from "./config";
import type { Props } from "./types/types";

export type { Density } from "./types/types";

/** Responsive movie grid: native CSS columns + content-visibility for offscreen perf. */
function MovieGrid({
  movies,
  hasMore,
  loadMore,
  loadingMore,
  density = "comfy",
}: Props) {
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!hasMore || !el) return;
    // react-query dedupes overlapping fetchNextPage; loadingMore guard is belt-and-braces
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingMore) loadMore();
      },
      { rootMargin: "600px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  return (
    <>
      <Grid $min={MIN_COL[density]}>
        {movies.map((m) => (
          <Card key={m.id}>
            <MovieCard movie={m} />
          </Card>
        ))}
      </Grid>
      <div ref={sentinel} aria-hidden="true" />
    </>
  );
}

export default MovieGrid;
