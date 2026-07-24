import type { MouseEvent } from "react";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa6";
import { useQueryClient } from "@tanstack/react-query";
import { getMovieById } from "@/api/movies";
import { useWatchlistToggle } from "@/hooks/useWatchlistToggle";
import {
  Card,
  PosterWrap,
  Poster,
  RatingBadge,
  HeartButton,
  Body,
  CardTitle,
  Year,
} from "./components";
import type { Props } from "./types/types";

function MovieCard({ movie }: Props) {
  const { saved, toggle } = useWatchlistToggle(movie);
  const queryClient = useQueryClient();

  const title = movie.title || movie.name || "Untitled";
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : null;
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750?text=No+Image";

  const handleToggle = (e: MouseEvent) => {
    e.preventDefault(); // prevent navigating to detail page
    toggle();
  };

  // warm the detail-page cache so navigation feels instant
  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["movie", String(movie.id)],
      queryFn: () => getMovieById(String(movie.id)),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <Card
      to={`/movie/${movie.id}`}
      aria-label={title}
      onMouseEnter={prefetch}
      onFocus={prefetch}
    >
      <PosterWrap>
        <Poster src={poster} alt={title} loading="lazy" />

        {rating && (
          <RatingBadge>
            <FaStar aria-hidden="true" /> {rating}
          </RatingBadge>
        )}

        <HeartButton
          type="button"
          onClick={handleToggle}
          aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
          aria-pressed={saved}
          $saved={saved}
        >
          {saved ? (
            <FaHeart aria-hidden="true" />
          ) : (
            <FaRegHeart aria-hidden="true" />
          )}
        </HeartButton>
      </PosterWrap>

      <Body>
        <CardTitle>{title}</CardTitle>
        {year && <Year>{year}</Year>}
      </Body>
    </Card>
  );
}

export default MovieCard;
