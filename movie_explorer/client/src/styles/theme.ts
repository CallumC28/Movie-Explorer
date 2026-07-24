/**
 * Bridges AntD's generated design tokens into the styled-components theme shape,
 * so bespoke styled components (hero, movie card, page chrome) recolor in lockstep
 * with AntD on dark/light toggle. AntD's ConfigProvider is the single source of truth;
 * this only remaps its tokens into the shape our styled components already expect.
 */
import type { theme as antdTheme } from "antd";

type AntToken = ReturnType<typeof antdTheme.useToken>["token"];

const radii = {
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  xxl: "1.5rem",
  full: "9999px",
};

const bp = {
  sm: "@media (min-width: 640px)",
  md: "@media (min-width: 768px)",
  lg: "@media (min-width: 1024px)",
  xl: "@media (min-width: 1280px)",
};

export interface AppTheme {
  mode: "dark" | "light";
  radii: typeof radii;
  bp: typeof bp;
  colors: {
    bg: string;
    surface: string;
    surfaceRaised: string;
    surfaceHover: string;
    border: string;
    borderFaint: string;
    text: string;
    textSoft: string;
    textMuted: string;
    accent: string;
    accentHover: string;
    onAccent: string;
    star: string;
    danger: string;
    dangerBg: string;
    overlay: string;
    onOverlay: string;
    skeleton: string;
  };
  shadows: { md: string; lg: string; xl: string };
}

export function buildTheme(t: AntToken, mode: "dark" | "light"): AppTheme {
  return {
    mode,
    radii,
    bp,
    colors: {
      bg: t.colorBgLayout,
      surface: t.colorBgContainer,
      surfaceRaised: t.colorBgElevated,
      surfaceHover: t.colorFillTertiary,
      border: t.colorBorderSecondary,
      borderFaint: t.colorFillQuaternary,
      text: t.colorText,
      textSoft: t.colorTextSecondary,
      textMuted: t.colorTextTertiary,
      accent: t.colorPrimary,
      accentHover: t.colorPrimaryHover,
      // gold accent needs dark text on top in both modes — AntD has no matching token
      onAccent: "#1b1c1f",
      star: t.colorWarning,
      danger: t.colorError,
      dangerBg: t.colorErrorBg,
      overlay: mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.45)",
      onOverlay: "#ffffff",
      skeleton: t.colorFillSecondary,
    },
    shadows: {
      md: t.boxShadowTertiary,
      lg: t.boxShadowSecondary,
      xl: t.boxShadow,
    },
  };
}
