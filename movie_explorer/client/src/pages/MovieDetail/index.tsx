import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaHeart,
  FaHouse,
  FaPlay,
  FaRegHeart,
} from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  App,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Descriptions,
  Image,
  Rate,
  Skeleton,
  Space,
  Tag,
  Tooltip,
} from "antd";
import type { DescriptionsProps } from "antd";
import { getMovieById } from "@/api/movies";
import { getMovieSummary } from "@/api/summary";
import { useWatchlistToggle } from "@/hooks/useWatchlistToggle";
import MovieCard from "@/components/MovieCard";
import {
  Main,
  BackWrap,
  BackButton,
  Hero,
  Backdrop,
  HeroOverlay,
  HeroInner,
  PosterCol,
  PosterFrame,
  Info,
  MovieTitle,
  MetaRow,
  RatingWrap,
  Tagline,
  HeroActions,
  Section,
  SectionHeading,
  ScrollRow,
  CastCard,
  CastName,
  CastRole,
  SimilarItem,
  ProviderGroup,
  ProviderLabel,
  ProviderLogos,
  ProviderLink,
  JustWatchNote,
  ContentGrid,
  Stack,
  BodyText,
  SummaryWrap,
  SummaryText,
  SummaryFade,
  MutedItalic,
  ErrorText,
  CenterScreen,
} from "./components";
import { PLACEHOLDER } from "./config";

// the summary prompt only ever yields "- **lead**: text" bullets — this beats a markdown dep
const renderSummary = (text: string) =>
  text
    .split("\n")
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean)
    .map((line, i) => (
      <li key={i}>
        {line
          .split("**")
          .map((part, j) => (j % 2 ? <strong key={j}>{part}</strong> : part))}
      </li>
    ));

const formatDate = (dateString?: string) => {
  if (!dateString) return "Unknown";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

const formatDuration = (minutes?: number | null) => {
  if (minutes == null) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [showFullSummary, setShowFullSummary] = useState(false);

  // Back via ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const {
    data: movie,
    isLoading: loadingMovie,
    isError,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id!),
    enabled: Boolean(id),
  });

  const {
    data: summary,
    isLoading: loadingSummary,
    isError: summaryFailed,
  } = useQuery({
    queryKey: ["summary", movie?.id],
    queryFn: () => getMovieSummary(movie!.title ?? "", movie!.overview ?? ""),
    enabled: Boolean(movie?.overview),
    staleTime: Infinity,
    retry: false,
  });

  const { saved, toggle } = useWatchlistToggle(movie);

  if (loadingMovie) {
    return (
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        <Skeleton.Image active style={{ width: "100%", height: "40vh" }} />
        <Skeleton
          active
          paragraph={{ rows: 6 }}
          style={{ marginTop: "2rem" }}
        />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <CenterScreen>
        <div>
          <p>Failed to load movie. Please try again later.</p>
          <Button
            icon={<FaArrowLeft aria-hidden="true" />}
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </div>
      </CenterScreen>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : PLACEHOLDER;
  const hasBackdrop = Boolean(backdropUrl);

  const cast = movie.credits?.cast.slice(0, 15) ?? [];
  const similar =
    movie.similar?.results.filter((m) => m.poster_path).slice(0, 12) ?? [];
  const trailer =
    movie.videos?.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer",
    ) ?? movie.videos?.results.find((v) => v.site === "YouTube");

  // JustWatch availability, UK only — each region's `link` is locale-specific,
  // so a US fallback would send UK users to US sites. Card hides if unavailable here.
  // hardcoded to GB; derive from navigator.language if you go multi-region.
  const region = movie["watch/providers"]?.results?.GB;
  const providerGroups = region
    ? [
        { label: "Stream", items: region.flatrate },
        { label: "Rent", items: region.rent },
        { label: "Buy", items: region.buy },
      ].filter((g) => g.items?.length)
    : [];

  const copySummary = () => {
    if (summary) {
      navigator.clipboard.writeText(summary.replace(/\*\*/g, ""));
      message.success("Summary copied to clipboard");
    }
  };

  const detailItems: DescriptionsProps["items"] = [
    {
      key: "orig",
      label: "Original Title",
      children: movie.original_title || "—",
    },
    {
      key: "date",
      label: "Release Date",
      children: formatDate(movie.release_date),
    },
    { key: "votes", label: "Vote Count", children: movie.vote_count ?? "—" },
    {
      key: "pop",
      label: "Popularity",
      children: Math.round(movie.popularity || 0),
    },
    ...(movie.status
      ? [{ key: "status", label: "Status", children: movie.status }]
      : []),
    ...(movie.production_countries?.length
      ? [
          {
            key: "country",
            label: "Country",
            children: movie.production_countries
              .map((c) => c.iso_3166_1)
              .join(", "),
          },
        ]
      : []),
  ];

  const financialItems: DescriptionsProps["items"] = [
    ...(movie.budget
      ? [
          {
            key: "budget",
            label: "Budget",
            children: `$${Number(movie.budget).toLocaleString()}`,
          },
        ]
      : []),
    ...(movie.revenue
      ? [
          {
            key: "revenue",
            label: "Revenue",
            children: `$${Number(movie.revenue).toLocaleString()}`,
          },
        ]
      : []),
  ];

  return (
    <Main>
      <BackWrap>
        <BackButton
          onClick={() => navigate(-1)}
          aria-label="Go back"
          $onBackdrop={hasBackdrop}
        >
          <FaArrowLeft aria-hidden="true" />
          Back
        </BackButton>
        <BackButton
          as={Link}
          to="/"
          aria-label="Go to home"
          $onBackdrop={hasBackdrop}
        >
          <FaHouse aria-hidden="true" />
          Home
        </BackButton>
      </BackWrap>

      <Hero>
        {backdropUrl && <Backdrop $url={backdropUrl} aria-hidden="true" />}
        {hasBackdrop && <HeroOverlay />}
        <HeroInner $onBackdrop={hasBackdrop}>
          <PosterCol>
            <PosterFrame>
              <Image
                src={posterUrl}
                alt={movie.title || "Movie poster"}
                fallback={PLACEHOLDER}
                width="100%"
              />
            </PosterFrame>
          </PosterCol>

          <Info>
            <MovieTitle>{movie.title}</MovieTitle>
            <MetaRow>
              <RatingWrap>
                <Rate
                  allowHalf
                  disabled
                  value={(movie.vote_average || 0) / 2}
                />
                <span>{movie.vote_average?.toFixed(1) ?? "0.0"} / 10</span>
              </RatingWrap>
              <Tag>Duration: {formatDuration(movie.runtime)}</Tag>
              <Tag>
                Language: {movie.original_language?.toUpperCase() || "N/A"}
              </Tag>
              <Tag>Release: {formatDate(movie.release_date)}</Tag>
              {movie.genres?.map((g) => (
                <Tag key={g.id} color="gold">
                  {g.name}
                </Tag>
              ))}
            </MetaRow>
            {(movie.tagline || movie.overview) && (
              <Tagline>{movie.tagline || movie.overview}</Tagline>
            )}

            <HeroActions>
              <Button
                type="primary"
                icon={
                  saved ? (
                    <FaHeart aria-hidden="true" />
                  ) : (
                    <FaRegHeart aria-hidden="true" />
                  )
                }
                onClick={toggle}
              >
                {saved ? "In Watchlist" : "Add to Watchlist"}
              </Button>
              {trailer && (
                <Button
                  icon={<FaPlay aria-hidden="true" />}
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Trailer
                </Button>
              )}
            </HeroActions>
          </Info>
        </HeroInner>
      </Hero>

      <Breadcrumb
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "1.25rem 1.5rem 0",
        }}
        items={[{ title: <Link to="/">Home</Link> }, { title: movie.title }]}
      />

      {cast.length > 0 && (
        <Section>
          <SectionHeading>Top Cast</SectionHeading>
          <ScrollRow>
            {cast.map((c) => (
              <CastCard key={c.id}>
                <Avatar
                  size={72}
                  src={
                    c.profile_path
                      ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                      : undefined
                  }
                >
                  {c.name?.[0]}
                </Avatar>
                <CastName title={c.name}>{c.name}</CastName>
                {c.character && (
                  <CastRole title={c.character}>{c.character}</CastRole>
                )}
              </CastCard>
            ))}
          </ScrollRow>
        </Section>
      )}

      <ContentGrid>
        <Stack>
          <Card title="Overview">
            <BodyText>{movie.overview || "—"}</BodyText>
          </Card>

          <Card
            title="AI‑Generated Summary"
            extra={
              summary && (
                <Space>
                  <Button
                    size="small"
                    onClick={copySummary}
                    aria-label="Copy summary"
                  >
                    Copy
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setShowFullSummary((f) => !f)}
                  >
                    {showFullSummary ? "Show less" : "Show more"}
                  </Button>
                </Space>
              )
            }
          >
            <SummaryWrap>
              {loadingSummary ? (
                <Skeleton active title={false} paragraph={{ rows: 3 }} />
              ) : summaryFailed ? (
                <ErrorText>Summary unavailable at the moment.</ErrorText>
              ) : summary ? (
                <SummaryText $expanded={showFullSummary}>
                  {renderSummary(summary)}
                </SummaryText>
              ) : (
                <MutedItalic>No summary available.</MutedItalic>
              )}
              {!showFullSummary && summary && <SummaryFade />}
            </SummaryWrap>
          </Card>
        </Stack>

        <aside style={{ position: "sticky", top: "6rem", alignSelf: "start" }}>
          <Space direction="vertical" size="large" style={{ display: "flex" }}>
            {region && providerGroups.length > 0 && (
              <Card title="Where to watch">
                {providerGroups.map((g) => (
                  <ProviderGroup key={g.label}>
                    <ProviderLabel>{g.label}</ProviderLabel>
                    <ProviderLogos>
                      {g.items!.map((p) => (
                        <Tooltip key={p.provider_id} title={p.provider_name}>
                          <ProviderLink
                            href={region.link}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${g.label} ${movie.title} on ${p.provider_name}`}
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                              alt={p.provider_name}
                              loading="lazy"
                            />
                          </ProviderLink>
                        </Tooltip>
                      ))}
                    </ProviderLogos>
                  </ProviderGroup>
                ))}
                <JustWatchNote>Availability data from JustWatch</JustWatchNote>
              </Card>
            )}

            <Card title="Details">
              <Descriptions column={1} size="small" items={detailItems} />
            </Card>

            {financialItems.length > 0 && (
              <Card title="Financials">
                <Descriptions column={1} size="small" items={financialItems} />
              </Card>
            )}
          </Space>
        </aside>
      </ContentGrid>

      {similar.length > 0 && (
        <Section style={{ paddingBottom: "4rem" }}>
          <SectionHeading>More like this</SectionHeading>
          <ScrollRow>
            {similar.map((m) => (
              <SimilarItem key={m.id}>
                <MovieCard movie={m} />
              </SimilarItem>
            ))}
          </ScrollRow>
        </Section>
      )}
    </Main>
  );
}

export default MovieDetail;
