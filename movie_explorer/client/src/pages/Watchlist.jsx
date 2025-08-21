import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";

function Watchlist({ items }) {
  const headerRef = useRef(null);

  const [stored, setStored] = useState(() => {
    if (items?.length) return items;
    try {
      return JSON.parse(localStorage.getItem("watchlist") || "[]");
    } catch {
      return [];
    }
  });

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("added_desc");

  useEffect(() => {
    if (!items) {
      localStorage.setItem("watchlist", JSON.stringify(stored));
    }
  }, [stored, items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = (items?.length ? items : stored).slice();

    if (q) {
      rows = rows.filter((m) => {
        const title = (m.title || m.name || "").toLowerCase();
        const year = (m.release_date || m.first_air_date || "").slice(0, 4);
        return title.includes(q) || year.includes(q);
      });
    }

    const getYear = (m) => Number((m.release_date || m.first_air_date || "").slice(0, 4)) || 0;
    const getRating = (m) => Number(m.vote_average || 0);

    switch (sort) {
      case "title_asc":
        rows.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
        break;
      case "rating_desc":
        rows.sort((a, b) => getRating(b) - getRating(a));
        break;
      case "year_desc":
        rows.sort((a, b) => getYear(b) - getYear(a));
        break;
      default:
        break;
    }

    return rows;
  }, [query, sort, stored, items]);

  const removeOne = useCallback((id) => {
    if (items?.length) return;
    setStored((prev) => prev.filter((m) => m.id !== id));
  }, [items]);

  const clearAll = useCallback(() => {
    if (items?.length) return;
    setStored([]);
  }, [items]);

  const exportJson = useCallback(() => {
    const data = JSON.stringify(filtered, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "watchlist.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const count = filtered.length;

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(70%_40%_at_50%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(40%_30%_at_80%_20%,rgba(56,189,248,0.15),transparent)] bg-slate-950 text-white">
      {/* Sticky top bar*/}
      <div
        ref={headerRef}
        className="sticky top-0 z-20 py-4 mb-6 border-b border-white/10 backdrop-blur-xl bg-slate-950/60"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow ring-1 ring-white/30" />
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold m-0 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Movie Explorer
              </h1>
              <p className="text-xs text-slate-300/80 m-0">Find trending & hidden gems</p>
            </div>
          </div>
          <div className="flex-1 max-w-xl w-full">
            <SearchBar search={query} setSearch={setQuery} placeholder="Search in watchlist..." />
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md
                         transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <header className="mb-6 mt-6 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">My Watchlist</h2>
            <p className="text-slate-400">
              {count} saved {count === 1 ? "title" : "titles"}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg bg-slate-800/70 px-3 py-2 text-sm ring-1 ring-slate-700 focus:ring-2 focus:ring-brand-600"
            >
              <option value="added_desc">Recently added</option>
              <option value="title_asc">Title (A–Z)</option>
              <option value="rating_desc">Rating (high → low)</option>
              <option value="year_desc">Year (new → old)</option>
            </select>

            <div className="flex gap-2">
              <button onClick={exportJson} className="btn-ghost" type="button">
                Export
              </button>
              <button
                onClick={clearAll}
                className="btn-ghost"
                type="button"
                disabled={items?.length || (stored.length === 0)}
              >
                Clear
              </button>
            </div>
          </div>
        </header>

        {/* Empty state */}
        {count === 0 && <EmptyState />}

        {/* Grid */}
        {count > 0 && (
          <section className="mb-12">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filtered.map((m) => (
                <div key={m.id} className="relative group">
                  <MovieCard movie={m} />
                  {!items?.length && (
                    <button
                      type="button"
                      onClick={() => removeOne(m.id)}
                      className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white opacity-0 transition
                                 group-hover:opacity-100 hover:bg-black/80 focus:opacity-100"
                      aria-label={`Remove ${m.title || m.name} from watchlist`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="card mx-auto my-16 max-w-2xl p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 text-slate-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 7h16M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M9 7V5a3 3 0 0 1 3-3 3 3 0 0 1 3 3v2" />
        </svg>
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold">No titles saved</h2>
      <p className="mt-2 text-slate-400">
        Add movies to your watchlist from the home or movie pages, then return here to track them.
      </p>
      <div className="mt-6">
        <Link to="/" className="btn-primary">
          Browse movies
        </Link>
      </div>
    </div>
  );
}

export default Watchlist;
