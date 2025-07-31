import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById } from '../services/movieService';
import { getMovieSummary } from '../services/openaiService';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    getMovieById(id).then(setMovie);
  }, [id]);

  useEffect(() => {
    if (movie?.overview) {
      getMovieSummary(movie.title, movie.overview).then(setSummary);
    }
  }, [movie]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full md:w-1/3 rounded-xl shadow-lg"
      />
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
        <p className="text-gray-300 mb-6">{movie.overview}</p>
        <div>
          <h2 className="text-xl font-semibold mb-2">AI Summary:</h2>
          <p className="whitespace-pre-line text-sm bg-gray-800 p-4 rounded-lg">{summary || "Generating..."}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
