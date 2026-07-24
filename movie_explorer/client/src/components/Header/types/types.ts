import type { ReactNode, Ref } from 'react';

export interface Props {
  search: string;
  setSearch: (value: string) => void;
  searchPlaceholder?: string;
  searchRef?: Ref<HTMLInputElement>;
  subtitle?: string;
  /** Right-hand actions (links / buttons). */
  children?: ReactNode;
}
