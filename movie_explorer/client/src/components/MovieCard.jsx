import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  const title = movie.title || movie.name || "Untitled";
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const rating =
    typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : null;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750?text=No+Image";

  const storageKey = "watchlist";

  // track whether this movie is in watchlist
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setSaved(list.some((m) => m.id === movie.id));
    } catch {
      setSaved(false);
    }
  }, [movie.id]);

  const handleAdd = (e) => {
    e.preventDefault(); // prevent navigating to detail page
    try {
      const list = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!list.find((m) => m.id === movie.id)) {
        localStorage.setItem(storageKey, JSON.stringify([movie, ...list]));
        setSaved(true);
      }
    } catch {
      // first save
      localStorage.setItem(storageKey, JSON.stringify([movie]));
      setSaved(true);
    }
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      state={{ movie }}
      className="group block card card-hover overflow-hidden"
      aria-label={title}
    >
      <div className="relative">
        <img
          src={poster}
          alt={title}
          className="h-72 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {rating && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold">
            ⭐ {rating}
          </div>
        )}

        {/* Watchlist heart button */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label="Add to watchlist"
          className={`absolute left-2 top-2 rounded-full p-1 transition 
            ${saved ? "bg-red-600" : "bg-black/50 opacity-0 group-hover:opacity-100"}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-white"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 21s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 12c0 4.65-7 9-7 9z" />
          </svg>
        </button>
      </div>

      <div className="p-3">
        <h3 className="line-clamp-1 font-semibold">{title}</h3>
        {year && <p className="text-sm text-slate-400">{year}</p>}
      </div>
    </Link>
  );
}

export default MovieCard;
