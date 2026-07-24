import styled from "styled-components";
import { Button } from "antd";
import Container from "@/components/Container";

export const Main = styled.main`
  min-height: 100vh;
  width: 100%;
`;

export const SkipLink = styled.a`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;

  &:focus {
    position: fixed;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 50;
    width: auto;
    height: auto;
    clip: auto;
    padding: 0.5rem 1rem;
    background: ${({ theme }) => theme.colors.surface};
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    border-radius: ${({ theme }) => theme.radii.md};
  }
`;

/* ---- Hero ---- */

export const HeroSection = styled(Container)`
  margin-bottom: 1rem;
`;

export const HeroCard = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.xxl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  ${({ theme }) => theme.bp.md} {
    padding: 2rem;
  }
`;

export const HeroGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  align-items: center;

  ${({ theme }) => theme.bp.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const HeroTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 900;
  letter-spacing: -0.025em;

  ${({ theme }) => theme.bp.md} {
    font-size: 2.25rem;
  }
`;

export const HeroText = styled.p`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSoft};

  ${({ theme }) => theme.bp.md} {
    font-size: 1rem;
  }
`;

export const HeroActions = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const GenreList = styled.div`
  display: none;

  ${({ theme }) => theme.bp.md} {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: flex-end;
  }
`;

/* ---- Layout ---- */

export const Content = styled(Container)`
  > * + * {
    margin-top: 2rem;
  }
`;

export const DesktopOnly = styled.div`
  display: none;

  ${({ theme }) => theme.bp.md} {
    display: block;
  }
`;

/* ---- Toolbar ---- */

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const ToolGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ToolLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const MobileFilterButton = styled(Button)`
  ${({ theme }) => theme.bp.md} {
    display: none;
  }
`;

export const CountText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ---- Sections ---- */

export const FeaturedSection = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 1rem;

  ${({ theme }) => theme.bp.md} {
    padding: 1.5rem;
  }
`;

export const SectionHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const SectionSub = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.25rem;
`;

export const FeaturedItem = styled.div`
  flex-shrink: 0;
  width: 180px;
  transition: transform 0.3s ease;

  ${({ theme }) => theme.bp.md} {
    width: 220px;
  }

  @media (prefers-reduced-motion: no-preference) {
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

/** Horizontal scroll strip with a themed thin scrollbar. */
export const ScrollRow = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 0.5rem 0 0.75rem;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.surfaceHover} transparent;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-radius: ${({ theme }) => theme.radii.full};
  }
`;

/* ---- States ---- */

export const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
`;

export const CenterRow = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
`;

export const EndText = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const EmptyWrap = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSoft};
  padding: 4rem 0;

  p {
    margin-bottom: 0.75rem;
    font-size: 1.125rem;
  }
`;

export const Footer = styled.footer`
  padding: 1.5rem 0 2.5rem;
  text-align: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;
