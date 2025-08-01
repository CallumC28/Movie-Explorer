import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.jpg'; // fallback image if poster_path is missing

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block transform hover:scale-105 transition-transform duration-300 shadow-md rounded-xl overflow-hidden bg-gray-800 hover:shadow-lg"
      aria-label={`View details for ${movie.title}`}
    >
      <div className="relative w-full aspect-[2/3] bg-slate-700">
        <img
          src={posterUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          loading="lazy"
        />
      </div>
      <div className="p-3 text-center">
        <h2 className="font-semibold text-md md:text-lg truncate text-white">
          {movie.title || 'Untitled'}
        </h2>
      </div>
    </Link>
  );
}

export default MovieCard;
