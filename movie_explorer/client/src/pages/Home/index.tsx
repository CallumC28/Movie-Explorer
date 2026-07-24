import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Drawer, FloatButton, Segmented, Tag } from "antd";
import { getGenres } from "@/api/movies";
import { useMovies } from "@/hooks/useMovies";
import Header from "@/components/Header";
import FilterBar, { type SortOption } from "@/components/FilterBar";
import MovieGrid, { type Density } from "@/components/MovieGrid";
import MovieCard from "@/components/MovieCard";
import SectionTitle from "@/components/SectionTitle";
import SkeletonCard from "@/components/SkeletonCard";
import {
  Main,
  ScrollRow,
  SkipLink,
  HeroSection,
  HeroCard,
  HeroGrid,
  HeroTitle,
  HeroText,
  HeroActions,
  GenreList,
  Content,
  DesktopOnly,
  Toolbar,
  ToolGroup,
  ToolLabel,
  MobileFilterButton,
  CountText,
  FeaturedSection,
  SectionHead,
  SectionSub,
  FeaturedItem,
  SkeletonGrid,
  CenterRow,
  EndText,
  EmptyWrap,
  Footer,
} from "./components";
import { DENSITY_OPTIONS, SORT_BY, YEARS, PARAM_DEFAULTS } from "./config";

function Home() {
  const navigate = useNavigate();

  // URL is the source of truth for search + filters — shareable, refresh- and back-button-safe
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const selectedGenre = params.get("genre") ?? "all";
  const selectedYear = params.get("year") ?? "all";
  const minRating = Number(params.get("rating")) || 0;
  const sortOption = (params.get("sort") as SortOption) || "pop_desc";

  const setParam = useCallback(
    (key: keyof typeof PARAM_DEFAULTS, value: string) =>
      setParams(
        (p) => {
          if (value === PARAM_DEFAULTS[key]) p.delete(key);
          else p.set(key, value);
          return p;
        },
        { replace: true },
      ),
    [setParams],
  );

  const setSearch = useCallback((v: string) => setParam("q", v), [setParam]);
  const setSelectedGenre = (v: string) => setParam("genre", v);
  const setSelectedYear = (v: string) => setParam("year", v);
  const setMinRating = (v: number) => setParam("rating", String(v));
  const setSortOption = (v: SortOption) => setParam("sort", v);

  const clearSearch = useCallback(() => setParam("q", ""), [setParam]);
  const resetFilters = useCallback(
    () =>
      setParams(
        (p) => {
          ["genre", "year", "rating", "sort"].forEach((k) => p.delete(k));
          return p;
        },
        { replace: true },
      ),
    [setParams],
  );

  // any active filter or non-default sort → /discover queries the whole catalogue server-side
  const discover = useMemo(
    () =>
      selectedGenre !== "all" ||
      selectedYear !== "all" ||
      minRating > 0 ||
      sortOption !== "pop_desc"
        ? {
            genre: selectedGenre !== "all" ? selectedGenre : undefined,
            year: selectedYear !== "all" ? selectedYear : undefined,
            minRating: minRating || undefined,
            sortBy: SORT_BY[sortOption],
          }
        : null,
    [selectedGenre, selectedYear, minRating, sortOption],
  );

  const {
    movies,
    loadingInitial,
    loadingMore,
    error,
    isSearching,
    rawQuery,
    hasMore,
    loadMore,
  } = useMovies(search, discover);

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: Infinity,
  });

  const [density, setDensity] = useState<Density>(
    () => (localStorage.getItem("mx_density") as Density) || "comfy",
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("mx_density", density);
  }, [density]);

  // keyboard shortcuts: "/" focus search, "r" reset filters
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        target.tagName !== "INPUT" &&
        target.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (
        (e.key === "r" || e.key === "R") &&
        target.tagName !== "INPUT" &&
        target.tagName !== "TEXTAREA"
      ) {
        resetFilters();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resetFilters]);

  // client-side filters + sort — a no-op pass-through in discover mode (the
  // server already applied them); still needed to filter search results

  const filteredAndSorted = useMemo(() => {
    let filtered = movies;

    if (selectedGenre !== "all") {
      const genreId = Number(selectedGenre);
      filtered = filtered.filter((m) => {
        if (m.genre_ids) return m.genre_ids.includes(genreId);
        if (m.genres) return m.genres.some((g) => g.id === genreId);
        return false;
      });
    }
    if (selectedYear !== "all") {
      filtered = filtered.filter((m) =>
        m.release_date?.startsWith(selectedYear),
      );
    }
    if (minRating > 0) {
      filtered = filtered.filter((m) => (m.vote_average || 0) >= minRating);
    }

    const sorted = filtered.slice();
    switch (sortOption) {
      case "pop_desc":
        sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case "pop_asc":
        sorted.sort((a, b) => (a.popularity || 0) - (b.popularity || 0));
        break;
      case "date_desc":
        sorted.sort(
          (a, b) =>
            +new Date(b.release_date || 0) - +new Date(a.release_date || 0),
        );
        break;
      case "date_asc":
        sorted.sort(
          (a, b) =>
            +new Date(a.release_date || 0) - +new Date(b.release_date || 0),
        );
        break;
      case "rating_desc":
        sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
      case "rating_asc":
        sorted.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
        break;
    }
    return sorted;
  }, [movies, selectedGenre, selectedYear, minRating, sortOption]);

  const featured = useMemo(
    () => (isSearching || discover ? [] : movies.slice(0, 6)),
    [movies, isSearching, discover],
  );
  const totalCount = filteredAndSorted.length;

  const surpriseMe = () => {
    if (movies.length) {
      const r = movies[Math.floor(Math.random() * movies.length)];
      if (r?.id) navigate(`/movie/${r.id}`);
    }
  };

  const filterBarProps = {
    genres,
    availableYears: YEARS,
    selectedGenre,
    setSelectedGenre,
    selectedYear,
    setSelectedYear,
    minRating,
    setMinRating,
    sortOption,
    setSortOption,
    resetFilters,
  };

  return (
    <Main>
      <SkipLink href="#content">Skip to content</SkipLink>

      <Header
        search={search}
        setSearch={setSearch}
        searchRef={searchRef}
        searchPlaceholder="Search movies... (/ to focus)"
      >
        <MobileFilterButton
          onClick={() => setFiltersOpen(true)}
          aria-label="Open filters"
        >
          Filters
        </MobileFilterButton>
        <Link to="/watchlist">
          <Button type="primary">My Watchlist</Button>
        </Link>
      </Header>

      {!isSearching && (
        <HeroSection>
          <HeroCard>
            <HeroGrid>
              <div>
                <HeroTitle>Discover films everyone’s talking about</HeroTitle>
                <HeroText>
                  Browse trending titles, filter by genre, and surface hidden
                  gems. All in a single, blazing-fast view.
                </HeroText>
                <HeroActions>
                  <Button type="primary" href="#movies">
                    Explore trending
                  </Button>
                  <Button onClick={surpriseMe}>Surprise me</Button>
                </HeroActions>
              </div>
              <GenreList>
                {genres.slice(0, 12).map((g) => (
                  <Tag.CheckableTag
                    key={g.id}
                    checked={selectedGenre === String(g.id)}
                    onChange={() =>
                      setSelectedGenre(
                        selectedGenre === String(g.id) ? "all" : String(g.id),
                      )
                    }
                  >
                    {g.name}
                  </Tag.CheckableTag>
                ))}
              </GenreList>
            </HeroGrid>
          </HeroCard>
        </HeroSection>
      )}

      <Content id="content">
        <Drawer
          title="Filters"
          placement="right"
          width={320}
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        >
          <FilterBar
            {...filterBarProps}
            onCloseMobile={() => setFiltersOpen(false)}
          />
        </Drawer>

        {!isSearching && featured.length > 0 && (
          <FeaturedSection aria-label="Featured Picks">
            <SectionHead>
              <div>
                <SectionTitle>Featured Picks</SectionTitle>
                <SectionSub>Trending right now</SectionSub>
              </div>
            </SectionHead>
            <ScrollRow>
              {featured.map((m) => (
                <FeaturedItem key={m.id}>
                  <MovieCard movie={m} />
                </FeaturedItem>
              ))}
            </ScrollRow>
          </FeaturedSection>
        )}

        <Toolbar>
          <ToolGroup>
            <ToolLabel>View</ToolLabel>
            <Segmented
              options={DENSITY_OPTIONS}
              value={density}
              onChange={(v) => setDensity(v as Density)}
            />
          </ToolGroup>

          <ToolGroup>
            <MobileFilterButton onClick={() => setFiltersOpen(true)}>
              Filters
            </MobileFilterButton>
            <CountText>
              {totalCount} title{totalCount === 1 ? "" : "s"}
            </CountText>
          </ToolGroup>
        </Toolbar>

        <DesktopOnly>
          <FilterBar {...filterBarProps} />
        </DesktopOnly>

        <section id="movies" aria-label="Movies list">
          <SectionHead>
            <div>
              <SectionTitle>
                {isSearching
                  ? totalCount
                    ? "Results"
                    : "No matches"
                  : discover
                    ? "Filtered Movies"
                    : "Trending Movies"}
              </SectionTitle>
              {isSearching && rawQuery && (
                <SectionSub>
                  Showing {totalCount} result{totalCount === 1 ? "" : "s"} for{" "}
                  <strong>“{rawQuery}”</strong>
                </SectionSub>
              )}
            </div>
            {isSearching && rawQuery && totalCount === 0 && (
              <Button type="link" onClick={clearSearch}>
                Reset
              </Button>
            )}
          </SectionHead>

          {error && (
            <Alert
              type="error"
              showIcon
              message={error}
              style={{ marginBottom: "1rem" }}
            />
          )}

          {loadingInitial ? (
            <SkeletonGrid>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </SkeletonGrid>
          ) : totalCount > 0 ? (
            <>
              <MovieGrid
                movies={filteredAndSorted}
                hasMore={hasMore}
                loadMore={loadMore}
                loadingMore={loadingMore}
                density={density}
              />
              {loadingMore && (
                <CenterRow aria-live="polite" role="status">
                  <SkeletonCard />
                </CenterRow>
              )}
              {!hasMore && <EndText>You’ve reached the end.</EndText>}
            </>
          ) : (
            <EmptyWrap>
              <p>
                {isSearching
                  ? `No movies found for "${rawQuery}".`
                  : discover
                    ? "No movies match these filters."
                    : "No movies available at the moment."}
              </p>
              {isSearching ? (
                <Button onClick={clearSearch}>Reset search</Button>
              ) : discover ? (
                <Button onClick={resetFilters}>Reset filters</Button>
              ) : null}
            </EmptyWrap>
          )}
        </section>

        <Footer>
          Built by Callum Cummins • <span>Press "/" to search</span>
        </Footer>
      </Content>

      <FloatButton.BackTop />
    </Main>
  );
}

export default Home;
