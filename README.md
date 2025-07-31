
# 🎬 Movie Explorer

**Movie Explorer** is a modern React web app that allows users to discover trending, top-rated, and obscure movies using the TMDB API. It includes AI-powered movie summaries using OpenAI and a user-friendly interface built with Tailwind CSS.

---

## Features

- 🔍 **Search movies** by name with instant filtering
- 🧠 **AI summaries**: GPT-powered bullet-point summaries of each movie
- 🏆 **Trending & top-rated** listings from TMDB
- 🖼️ Responsive **movie cards** with posters, titles, and ratings
- 🚀 Smooth routing and UI animations

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React, React Router, Tailwind CSS |
| APIs | [TMDB](https://www.themoviedb.org/documentation/api), [OpenAI GPT-3.5](https://platform.openai.com/) |
| Hosting | Vercel |
| Dev Tools | Vite, Axios |

---

## Dependencies

### Core Frameworks & Libraries

| Package | Description |
|--------|-------------|
| [`react`](https://reactjs.org/) | JavaScript library for building user interfaces |
| [`react-dom`](https://reactjs.org/docs/react-dom.html) | Provides DOM-specific methods for React |
| [`react-router-dom`](https://reactrouter.com/) | Declarative routing for React apps |
| [`vite`](https://vitejs.dev/) | Fast development build tool and dev server |

---

### Styling

| Package | Description |
|--------|-------------|
| [`tailwindcss`](https://tailwindcss.com/) | Utility-first CSS framework for fast UI styling |
| [`postcss`](https://postcss.org/) | Used with Tailwind for processing CSS |
| [`autoprefixer`](https://github.com/postcss/autoprefixer) | Adds vendor prefixes to CSS automatically |

---

### APIs & External Services

| API | Description |
|-----|-------------|
| [TMDB API](https://developer.themoviedb.org/docs) | Fetches trending, top-rated, and detailed movie data |
| [OpenAI API](https://platform.openai.com/docs) | Provides GPT-3.5 model for AI-generated movie summaries |

---

### Dev Dependencies

| Package | Description |
|--------|-------------|
| [`@vitejs/plugin-react`](https://www.npmjs.com/package/@vitejs/plugin-react) | Official React plugin for Vite |
| [`eslint`](https://eslint.org/) *(optional)* | Linter for catching JavaScript errors |

---

## Project Structure Overview

```
movie_explorer/
├── client/
│   ├── public/                # index.html
│   ├── src/
│   │   ├── components/        # SearchBar, MovieCard, etc.
│   │   ├── pages/             # Home.jsx, MovieDetail.jsx
│   │   ├── services/          # TMDB and OpenAI logic
│   │   ├── styles/            # Tailwind global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env                   # VITE_TMDB_API_KEY & VITE_OPENAI_API_KEY
```

---

## Environment Variables

Create a `.env` file inside the `client/` folder with:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

> ⚠️ Dont commit `.env` to GitHub. Use Vercel’s Environment Variables section for deployment.

---

## Deployment

Deployed on **Vercel**  
➤ [Live Demo](https://movie-explorer-tau-lemon.vercel.app/)

---

## Future Improvements

- Authenticated user accounts
- Save ratings and watchlist to a backend
- Genre filters and custom movie recommendations
- Infinite scroll on search results
- Dark/light theme toggle
