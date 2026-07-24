import { useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, App as AntApp, theme as antdTheme } from "antd";
import { ThemeProvider } from "styled-components";
import { buildTheme } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";
import { useThemeMode } from "./hooks/useThemeMode";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Watchlist from "./pages/Watchlist";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/** Reset scroll to top on every route change (React Router keeps the prior position). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Feeds AntD's generated tokens into styled-components so bespoke UI matches AntD. */
function ThemeBridge({
  mode,
  children,
}: {
  mode: "dark" | "light";
  children: ReactNode;
}) {
  const { token } = antdTheme.useToken();
  return (
    <ThemeProvider theme={buildTheme(token, mode)}>{children}</ThemeProvider>
  );
}

function App() {
  const { mode } = useThemeMode();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#e8b64c",
          // link tokens default to blue independently of colorPrimary — point them at the gold accent
          colorLink: "#e8b64c",
          colorLinkHover: "#f0c469",
          colorLinkActive: "#d9a53f",
          borderRadius: 8,
          fontFamily:
            "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
        },
        components: {
          Segmented: {
            itemSelectedBg: "#e8b64c",
            itemSelectedColor: "#1b1c1f",
          },
        },
      }}
    >
      <AntApp>
        <ThemeBridge mode={mode}>
          <QueryClientProvider client={queryClient}>
            <GlobalStyle />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/watchlist" element={<Watchlist />} />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeBridge>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
