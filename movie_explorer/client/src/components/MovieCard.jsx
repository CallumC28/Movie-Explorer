import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="transform hover:scale-105 transition-all duration-200 shadow-md rounded-xl overflow-hidden bg-gray-800"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto object-cover"
      />
      <div className="p-3 text-center">
        <h2 className="font-semibold text-lg truncate">{movie.title}</h2>
      </div>
    </Link>
  );
}

export default MovieCard;