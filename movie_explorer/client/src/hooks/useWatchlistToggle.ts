import { App } from 'antd';
import { useWatchlist } from './useWatchlist';
import type { Movie } from '@/api/types';

/**
 * The favourite action shared by the card and the detail page: whether a movie
 * is saved, and a toggle that adds/removes it with a toast. Accepts undefined so
 * it can be called before a page's movie data has loaded (rules of hooks).
 */
export function useWatchlistToggle(movie?: Movie) {
  const { list, add, remove } = useWatchlist();
  const { message } = App.useApp();
  const saved = !!movie && list.some((m) => m.id === movie.id);

  const toggle = () => {
    if (!movie) return;
    const label = movie.title || movie.name;
    if (saved) {
      remove(movie.id);
      message.success(`Removed “${label}” from watchlist`);
    } else {
      add(movie);
      message.success(`Added “${label}” to watchlist`);
    }
  };

  return { saved, toggle };
}
