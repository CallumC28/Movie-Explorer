import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { getTrendingMovies, searchMovies, getGenres } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

/** Debounce helper */
function useDebouncedValue(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Skeleton placeholder */
const SkeletonCard = () => (
  <div className="animate-pulse bg-slate-800 rounded-2xl overflow-hidden flex flex-col" aria-hidden="true">
    <div className="h-64 bg-slate-700" />
    <div className="p-4 space-y-2">
      <div className="h-4 w-3/4 bg-slate-700 rounded" />
      <div className="h-3 w-1/2 bg-slate-700 rounded" />
    </div>
  </div>
);

/** Filter & sort bar component */
const FilterBar = ({
  genres = [],
  availableYears = [],
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  minRating,
  setMinRating,
  sortOption,
  setSortOption,
  resetFilters,
}) => (
  <div className="flex flex-wrap gap-4 items-end bg-slate-800 rounded-lg p-4 mb-6">
    <div className="flex flex-col">
      <label htmlFor="genre" className="text-xs text-slate-300 mb-1">
        Genre
      </label>
      <select
        id="genre"
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        className="bg-slate-900 text-white px-3 py-2 rounded text-sm outline-none"
      >
        <option value="all">All</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </div>

    <div className="flex flex-col">
      <label htmlFor="year" className="text-xs text-slate-300 mb-1">
        Release Year
      </label>
      <select
        id="year"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="bg-slate-900 text-white px-3 py-2 rounded text-sm outline-none"
      >
        <option value="all">All</option>
        {availableYears.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>

    <div className="flex flex-col">
      <label htmlFor="rating" className="text-xs text-slate-300 mb-1">
        Min Rating
      </label>
      <select
        id="rating"
        value={minRating}
        onChange={(e) => setMinRating(Number(e.target.value))}
        className="bg-slate-900 text-white px-3 py-2 rounded text-sm outline-none"
      >
        <option value={0}>Any</option>
        <option value={9}>9+</option>
        <option value={8}>8+</option>
        <option value={7}>7+</option>
        <option value={6}>6+</option>
        <option value={5}>5+</option>
      </select>
    </div>

    <div className="flex flex-col flex-1 min-w-[160px]">
      <label htmlFor="sort" className="text-xs text-slate-300 mb-1">
        Sort By
      </label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="bg-slate-900 text-white px-3 py-2 rounded text-sm outline-none"
      >
        <option value="pop_desc">Popularity ↓</option>
        <option value="pop_asc">Popularity ↑</option>
        <option value="date_desc">Release Date ↓</option>
        <option value="date_asc">Release Date ↑</option>
        <option value="rating_desc">Rating ↓</option>
        <option value="rating_asc">Rating ↑</option>
      </select>
    </div>

    <div className="ml-auto">
      <button
        onClick={resetFilters}
        className="text-xs bg-slate-700 px-4 py-2 rounded hover:bg-slate-600 transition"
      >
        Reset
      </button>
    </div>
  </div>
);

/** Hook to fetch movie list with paging */
function useMovieList(searchTerm) {
  const PAGE_SIZE = 20;
  const debounced = useDebouncedValue(searchTerm.trim(), 500);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const isSearching = Boolean(debounced);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [debounced]);

  useEffect(() => {
    let cancelled = false;
    async function fetchPage() {
      if (page === 1) setLoadingInitial(true);
      else setLoadingMore(true);
      setError('');
      try {
        const results = debounced
          ? await searchMovies(debounced, page)
          : await getTrendingMovies(page);
        if (cancelled) return;

        if (!Array.isArray(results)) {
          setMovies(results || []);
          setHasMore(false);
        } else {
          setMovies((prev) => (page === 1 ? results : [...prev, ...results]));
          if (results.length < PAGE_SIZE) setHasMore(false);
        }
      } catch {
        if (!cancelled) setError('Failed to load movies. Please try again.');
      } finally {
        if (!cancelled) {
          setLoadingInitial(false);
          setLoadingMore(false);
        }
      }
    }
    fetchPage();
    return () => {
      cancelled = true;
    };
  }, [debounced, page]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loadingInitial) return;
    setPage((p) => p + 1);
  }, [hasMore, loadingMore, loadingInitial]);

  return {
    movies,
    loadingInitial,
    loadingMore,
    error,
    isSearching,
    rawQuery: debounced,
    hasMore,
    loadMore,
  };
}

/** Responsive column count util */
function useColumnCount() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  if (width >= 1280) return 6;
  if (width >= 1024) return 5;
  if (width >= 768) return 4;
  if (width >= 640) return 3;
  return 2;
}

/** Virtualized grid */
const VirtualizedMovieGrid = ({ movies, hasMore, loadMore, loadingMore }) => {
  const columns = useColumnCount();
  const rowCount = Math.ceil(movies.length / columns);
  const rowHeight = 360;
  const listHeight = Math.min(rowCount * rowHeight, 800);

  const itemData = useMemo(() => ({ movies, columns }), [movies, columns]);

  const Row = ({ index, style, data }) => {
    const { movies: all, columns: cols } = data;
    const from = index * cols;
    const to = Math.min(from + cols, all.length);
    const rowItems = all.slice(from, to);
    const empties = cols - rowItems.length;

    return (
      <div style={style} className="flex gap-6 px-2">
        {rowItems.map((m) => (
          <div key={m.id} className="flex-1 min-w-0">
            <MovieCard movie={m} />
          </div>
        ))}
        {empties > 0 &&
          Array.from({ length: empties }).map((_, i) => (
            <div key={`empty-${i}`} className="flex-1 min-w-0" aria-hidden="true" />
          ))}
      </div>
    );
  };

  const handleItemsRendered = useCallback(
    ({ visibleStopIndex }) => {
      if (hasMore && !loadingMore && visibleStopIndex >= rowCount - 2) {
        loadMore();
      }
    },
    [hasMore, loadingMore, rowCount, loadMore]
  );

  return (
    <List
      height={listHeight}
      itemCount={rowCount}
      itemSize={rowHeight}
      width="100%"
      onItemsRendered={handleItemsRendered}
      itemData={itemData}
      overscanCount={2}
    >
      {Row}
    </List>
  );
};

function Home() {
  const [search, setSearch] = useState('');
  const {
    movies,
    loadingInitial,
    loadingMore,
    error,
    isSearching,
    rawQuery,
    hasMore,
    loadMore,
  } = useMovieList(search);

  const [genres, setGenres] = useState([]);
  const [genreError, setGenreError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState('pop_desc');
  const clearSearch = useCallback(() => setSearch(''), []);
  const resetFilters = useCallback(() => {
    setSelectedGenre('all');
    setSelectedYear('all');
    setMinRating(0);
    setSortOption('pop_desc');
  }, []);

  // load genres
  useEffect(() => {
    let cancelled = false;
    getGenres()
      .then((list) => {
        if (!cancelled && Array.isArray(list)) setGenres(list);
      })
      .catch(() => {
        if (!cancelled) setGenreError('Failed to load genres.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // derive years from movies
  const availableYears = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => {
      if (m.release_date) {
        set.add(m.release_date.slice(0, 4));
      }
    });
    return Array.from(set)
      .map(Number)
      .sort((a, b) => b - a);
  }, [movies]);

  // apply client-side filters + sort
  const filteredAndSorted = useMemo(() => {
    let filtered = movies;

    if (selectedGenre !== 'all') {
      filtered = filtered.filter((m) => {
        if (m.genre_ids) return m.genre_ids.includes(Number(selectedGenre));
        if (m.genres) return m.genres.some((g) => g.id === Number(selectedGenre));
        return false;
      });
    }
    if (selectedYear !== 'all') {
      filtered = filtered.filter((m) => m.release_date?.startsWith(selectedYear));
    }
    if (minRating > 0) {
      filtered = filtered.filter((m) => m.vote_average >= minRating);
    }

    const sorted = filtered.slice();

    switch (sortOption) {
      case 'pop_desc':
        sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'pop_asc':
        sorted.sort((a, b) => (a.popularity || 0) - (b.popularity || 0));
        break;
      case 'date_desc':
        sorted.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
        break;
      case 'date_asc':
        sorted.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
        break;
      case 'rating_desc':
        sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
      case 'rating_asc':
        sorted.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
        break;
      default:
        break;
    }

    return sorted;
  }, [movies, selectedGenre, selectedYear, minRating, sortOption]);

  // featured picks (when not searching)
  const featured = useMemo(() => {
    if (isSearching) return [];
    return movies.slice(0, 6);
  }, [movies, isSearching]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-8">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 backdrop-blur-sm bg-slate-900/90 py-3 mb-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="text-3xl">
              🎬
            </div>
            <div>
              <h1 className="text-2xl font-extrabold m-0">Movie Explorer</h1>
              <p className="text-xs text-slate-300 m-0">Find trending & hidden gems</p>
            </div>
          </div>
          <div className="flex-1 max-w-md w-full">
            <SearchBar search={search} setSearch={setSearch} placeholder="Search movies..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search pill */}
        {isSearching && rawQuery && (
          <div className="flex flex-wrap items-center gap-2 mb-2 px-2">
            <div className="inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full text-sm">
              Showing results for <span className="font-semibold">&ldquo;{rawQuery}&rdquo;</span>
              <button onClick={clearSearch} aria-label="Clear search" className="ml-2 bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Featured Picks */}
        {!isSearching && featured.length > 0 && (
          <section aria-label="Featured Picks" className="px-2 border-b border-slate-700 pb-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-2xl font-semibold">Featured Picks</h2>
                <p className="text-sm text-slate-400">Trending right now</p>
              </div>
            </div>
            <div className="relative overflow-x-auto no-scrollbar py-2">
              <div className="flex gap-6 min-w-[800px]">
                {featured.map((m) => (
                  <div key={m.id} className="shrink-0 w-[180px] md:w-[220px]">
                    <MovieCard movie={m} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Filters */}
        <FilterBar
          genres={genres}
          availableYears={availableYears}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          minRating={minRating}
          setMinRating={setMinRating}
          sortOption={sortOption}
          setSortOption={setSortOption}
          resetFilters={resetFilters}
        />

        {/* Movie list */}
        <section aria-label="Movies list" className="px-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold">
                {isSearching
                  ? filteredAndSorted.length
                    ? 'Results'
                    : 'No matches'
                  : 'Trending Movies'}
              </h2>
              {isSearching && rawQuery && (
                <p className="text-sm text-slate-400 mt-1">
                  Showing {filteredAndSorted.length} result
                  {filteredAndSorted.length === 1 ? '' : 's'} for{' '}
                  <span className="font-medium">&ldquo;{rawQuery}&rdquo;</span>
                </p>
              )}
            </div>
            {isSearching && rawQuery && filteredAndSorted.length === 0 && (
              <button onClick={clearSearch} className="text-sm underline">
                Reset
              </button>
            )}
          </div>

          {error && (
            <div role="alert" className="mb-6 rounded-lg bg-red-900/70 px-4 py-3 text-sm flex items-center gap-2">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}

          {loadingInitial ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredAndSorted.length > 0 ? (
            <>
              <VirtualizedMovieGrid
                movies={filteredAndSorted}
                hasMore={hasMore}
                loadMore={loadMore}
                loadingMore={loadingMore}
              />
              {loadingMore && (
                <div className="mt-6 flex justify-center">
                  <SkeletonCard />
                </div>
              )}
              {!hasMore && (
                <div className="mt-6 text-center text-sm text-slate-400">
                  You’ve reached the end.
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-slate-300 py-16">
              <p className="mb-3 text-lg">
                {isSearching
                  ? `No movies found for "${rawQuery}".`
                  : 'No movies available at the moment.'}
              </p>
              {isSearching && (
                <button
                  onClick={clearSearch}
                  className="mt-2 inline-flex items-center gap-2 bg-slate-700 px-4 py-2 rounded hover:bg-slate-600 transition"
                >
                  Reset search
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Home;
