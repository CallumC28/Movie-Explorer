import React, { useEffect, useState } from 'react';
import { getTrendingMovies, searchMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (search === '') {
      getTrendingMovies().then(setMovies);
    } else {
      searchMovies(search).then(setMovies);
    }
  }, [search]);

  return (
    <div className="flex flex-col items-center gap-6">
      <SearchBar search={search} setSearch={setSearch} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Home;
