import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../services/movieService';
import { getMovieSummary } from '../services/openaiService';

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

const formatDuration = (minutes) => {
  if (minutes == null) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

const Badge = ({ children, className = '' }) => (
  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800/70 ring-1 ring-white/10 text-slate-200 ${className}`}>
    {children}
  </div>
);

const StarRating = ({ rating = 0 }) => {
  const normalized = (rating / 10) * 5;
  const fullStars = Math.floor(normalized);
  const halfStar = normalized - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5 text-yellow-400" aria-label={`Rating ${rating?.toFixed?.(1) ?? '0.0'} out of 10`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`} aria-hidden="true">★</span>
      ))}
      {halfStar && (
        <span aria-hidden="true" className="relative">
          <span className="absolute overflow-hidden text-yellow-400" style={{ width: '50%' }}>★</span>
          <span className="text-slate-500">★</span>
        </span>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`empty-${i}`} aria-hidden="true" className="text-slate-500">★</span>
      ))}
      <span className="sr-only">{rating?.toFixed?.(1) ?? '0.0'} / 10</span>
    </div>
  );
};

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [summary, setSummary] = useState('');
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState('');
  const [summaryError, setSummaryError] = useState('');
  const [showFullSummary, setShowFullSummary] = useState(false);

  // Back via ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') navigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;
    setLoadingMovie(true);
    setError('');
    getMovieById(id)
      .then((m) => {
        if (!cancelled) setMovie(m);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load movie. Please try again later.');
      })
      .finally(() => {
        if (!cancelled) setLoadingMovie(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!movie?.overview) return;
    let active = true;
    setLoadingSummary(true);
    setSummaryError('');
    getMovieSummary(movie.title, movie.overview)
      .then((s) => {
        if (active) setSummary(s);
      })
      .catch(() => {
        if (active) setSummaryError('Summary unavailable at the moment.');
      })
      .finally(() => {
        if (active) setLoadingSummary(false);
      });
    return () => {
      active = false;
    };
  }, [movie]);

  const backdropUrl = useMemo(() => {
    if (movie?.backdrop_path) return `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    if (movie?.poster_path) return `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    return null;
  }, [movie]);

  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie-poster.png';

  const copySummary = useCallback(() => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
  }, [summary]);

  if (loadingMovie) {
    return (
      <div className="min-h-screen w-full bg-[radial-gradient(70%_40%_at_50%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(40%_30%_at_80%_20%,rgba(56,189,248,0.15),transparent)] bg-slate-950 text-slate-300 px-4">
        <div className="max-w-7xl mx-auto py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 rounded bg-slate-700/70" />
            <div className="h-[50vh] rounded-2xl bg-slate-800/70 ring-1 ring-white/10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="h-80 rounded-2xl bg-slate-800/70 ring-1 ring-white/10" />
              <div className="col-span-2 space-y-4">
                <div className="h-8 w-3/4 rounded bg-slate-800/70" />
                <div className="h-6 w-full rounded bg-slate-800/70" />
                <div className="h-6 w-full rounded bg-slate-800/70" />
                <div className="h-6 w-2/3 rounded bg-slate-800/70" />
              </div>
            </div>
          </div>
          <p className="mt-8 text-sm text-slate-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white grid place-items-center p-6">
        <div className="text-center">
          <p className="mb-4 text-slate-300">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-slate-800/70 hover:bg-slate-700/80 ring-1 ring-white/10 px-5 py-2 rounded-xl transition shadow"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(70%_40%_at_50%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(40%_30%_at_80%_20%,rgba(56,189,248,0.15),transparent)] bg-slate-950 text-slate-100">
      {/* Sticky header */}
      
       <div className="absolute top-4 left-4 z-30"> 
        <button onClick={() => navigate(-1)} 
        aria-label="Go back" 
        className="flex items-center gap-1 text-sm font-medium text-slate-200 hover:text-white transition" > 
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" > 
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /> 
          </svg> Back </button> 
          </div>
       
      {/* Hero / Banner */}
      <section className="relative w-full">
        {backdropUrl && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          />
        )}
        {/* Overlays for readability */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12 flex flex-col lg:flex-row gap-10">
          {/* Poster */}
          <div className="flex-shrink-0 w-full lg:w-1/3">
            <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-slate-900/50">
              <img
                src={posterUrl}
                alt={movie.title || 'Movie poster'}
                className="w-full h-auto object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-movie-poster.png';
                }}
              />
            </div>
          </div>

          {/* Primary info */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-3">{movie.title}</h1>
            <div className="flex flex-wrap gap-2.5 items-center mb-4">
              <div className="flex items-center gap-2">
                <StarRating rating={movie.vote_average} />
                <span className="text-sm text-slate-200/90">{movie.vote_average?.toFixed?.(1) ?? '0.0'} / 10</span>
              </div>
              <Badge>Duration: {formatDuration(movie.runtime)}</Badge>
              <Badge>Language: {movie.original_language?.toUpperCase() || 'N/A'}</Badge>
              <Badge>Release: {formatDate(movie.release_date)}</Badge>
              {movie.genres?.length > 0 && (
                <Badge className="truncate max-w-full md:max-w-[50ch]">{movie.genres.map((g) => g.name).join(', ')}</Badge>
              )}
            </div>
            {(movie.tagline || movie.overview) && (
              <p className="text-base md:text-lg leading-relaxed max-w-2xl text-slate-200/90">
                {movie.tagline || movie.overview}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content + sidebar */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16">
        <div className="space-y-12">
          {/* Overview */}
          <div className="rounded-2xl bg-slate-900/40 ring-1 ring-white/10 p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-2xl font-semibold mb-1 tracking-tight">Overview</h2>
            <div className="w-20 h-[2px] bg-slate-600/60 mb-4 rounded" />
            <p className="text-base leading-relaxed text-slate-200/90">{movie.overview || '—'}</p>
          </div>

          {/* AI Summary */}
          <div className="rounded-2xl bg-slate-900/40 ring-1 ring-white/10 p-6 backdrop-blur-md shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-2xl font-semibold tracking-tight">AI‑Generated Summary</h2>
              {summary && (
                <div className="flex gap-2">
                  <button
                    onClick={copySummary}
                    className="text-xs px-3 py-1 bg-slate-800/70 hover:bg-slate-700/80 ring-1 ring-white/10 rounded-lg transition"
                    aria-label="Copy summary"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => setShowFullSummary((f) => !f)}
                    className="text-xs px-3 py-1 bg-slate-800/70 hover:bg-slate-700/80 ring-1 ring-white/10 rounded-lg transition"
                  >
                    {showFullSummary ? 'Show less' : 'Show more'}
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              {loadingSummary ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-3/4 bg-slate-800/70 rounded" />
                  <div className="h-4 w-full bg-slate-800/70 rounded" />
                  <div className="h-4 w-5/6 bg-slate-800/70 rounded" />
                  <div className="h-4 w-2/3 bg-slate-800/70 rounded" />
                </div>
              ) : summaryError ? (
                <div className="text-sm text-rose-300/90">{summaryError}</div>
              ) : summary ? (
                <p
                  className={`text-slate-200 text-base leading-relaxed whitespace-pre-line ${!showFullSummary ? 'line-clamp-4' : ''}`}
                >
                  {summary}
                </p>
              ) : (
                <p className="text-slate-400 italic text-sm">No summary available.</p>
              )}
              {!showFullSummary && summary && (
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950/80 pointer-events-none" />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar metadata */}
        <aside className="space-y-8 sticky top-24 self-start">
          <div className="bg-slate-900/40 ring-1 ring-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md">
            <h3 className="text-lg font-semibold mb-3 tracking-tight">Details</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-300/90">Original Title:</span>
                <span className="truncate">{movie.original_title || '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-300/90">Release Date:</span>
                <span>{formatDate(movie.release_date)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-300/90">Vote Count:</span>
                <span>{movie.vote_count ?? '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-300/90">Popularity:</span>
                <span>{Math.round(movie.popularity || 0)}</span>
              </div>
              {movie.status && (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-300/90">Status:</span>
                  <span>{movie.status}</span>
                </div>
              )}
              {movie.production_countries?.length > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-300/90">Country:</span>
                  <span className="truncate">{movie.production_countries.map((c) => c.iso_3166_1).join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {(movie.budget || movie.revenue) && (
            <div className="bg-slate-900/40 ring-1 ring-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md">
              <h3 className="text-lg font-semibold mb-3 tracking-tight">Financials</h3>
              <div className="flex flex-col gap-2 text-sm">
                {movie.budget ? (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-300/90">Budget:</span>
                    <span>${Number(movie.budget).toLocaleString()}</span>
                  </div>
                ) : null}
                {movie.revenue ? (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-300/90">Revenue:</span>
                    <span>${Number(movie.revenue).toLocaleString()}</span>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default MovieDetail;
