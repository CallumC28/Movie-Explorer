import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    color-scheme: ${({ theme }) => theme.mode};
    scrollbar-color: ${({ theme }) => theme.colors.surfaceHover} transparent;
  }

  body {
    min-height: 100vh;
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.bg};
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-radius: ${({ theme }) => theme.radii.full};

    &:hover {
      background: ${({ theme }) => theme.colors.textMuted};
    }
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    cursor: pointer;
  }

  input, select {
    font: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    display: block;
    max-width: 100%;
  }
`;
