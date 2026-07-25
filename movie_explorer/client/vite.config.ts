import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      // Mirrors the /api/tmdb Vercel function so `npm run dev` works without `vercel dev`.
      proxy: {
        '/api/tmdb': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          rewrite: (p) =>
            p.replace(/^\/api\/tmdb/, '') +
            (p.includes('?') ? '&' : '?') +
            `api_key=${env.TMDB_API_KEY}`,
        },
      },
    },
  };
});
