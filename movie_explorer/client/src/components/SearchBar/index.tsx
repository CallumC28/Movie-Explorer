import { forwardRef } from "react";
import { Input } from "./components";
import type { Props } from "./types/types";

const SearchBar = forwardRef<HTMLInputElement, Props>(function SearchBar(
  { search, setSearch, placeholder = "Search movies..." },
  ref,
) {
  return (
    <Input
      ref={ref}
      type="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder={placeholder}
    />
  );
});

export default SearchBar;
