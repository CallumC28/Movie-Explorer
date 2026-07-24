import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import {
  discoverMovies,
  getTrendingMovies,
  searchMovies,
  PAGE_SIZE,
  type DiscoverFilters,
} from '@/api/movies';
import { useDebouncedValue } from './useDebouncedValue';

/**
 * Infinite movie list: search results when a term is present, /discover when
 * filters are active (server-side, whole catalogue), trending otherwise.
 */
export function useMovies(searchTerm: string, discover: DiscoverFilters | null = null) {
  const query = useDebouncedValue(searchTerm.trim(), 500);
  const isSearching = Boolean(query);

  const result = useInfiniteQuery({
    queryKey: ['movies', query, discover],
    queryFn: ({ pageParam }) =>
      query
        ? searchMovies(query, pageParam)
        : discover
          ? discoverMovies(discover, pageParam)
          : getTrendingMovies(pageParam),
    initialPageParam: 1,
    // keep showing the previous results while a new search loads — no flash of empty grid
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length < PAGE_SIZE ? undefined : pages.length + 1,
  });

  // TMDB can return the same movie on consecutive pages — dedupe by id
  const seen = new Set<number>();
  const movies = (result.data?.pages.flat() ?? []).filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  return {
    movies,
    loadingInitial: result.isLoading,
    loadingMore: result.isFetchingNextPage,
    error: result.isError ? 'Failed to load movies. Please try again.' : '',
    isSearching,
    rawQuery: query,
    hasMore: result.hasNextPage,
    loadMore: result.fetchNextPage,
  };
}
