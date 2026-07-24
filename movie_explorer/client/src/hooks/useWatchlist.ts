import { useCallback, useSyncExternalStore } from 'react';
import type { Movie } from '@/api/types';

const KEY = 'watchlist';
const listeners = new Set<() => void>();

function read(): Movie[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

let cache: Movie[] = read();

function write(next: Movie[]) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Single source of truth for the localStorage watchlist, shared across all components. */
export function useWatchlist() {
  const list = useSyncExternalStore(subscribe, () => cache);

  const add = useCallback((movie: Movie) => {
    if (!cache.some((m) => m.id === movie.id)) write([movie, ...cache]);
  }, []);

  const remove = useCallback((id: number) => {
    write(cache.filter((m) => m.id !== id));
  }, []);

  const clear = useCallback(() => write([]), []);

  return { list, add, remove, clear };
}
