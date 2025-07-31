import React from 'react';

function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search movies..."
      className="w-full md:w-1/2 p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mx-auto block"
    />
  );
}

export default SearchBar;