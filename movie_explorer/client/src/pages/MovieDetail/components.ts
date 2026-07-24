import styled, { css } from 'styled-components';

export const Main = styled.main`
  min-height: 100vh;
  width: 100%;
`;

export const BackWrap = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const BackButton = styled.button<{ $onBackdrop: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $onBackdrop, theme }) => ($onBackdrop ? theme.colors.onOverlay : theme.colors.text)};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

/* ---- Hero ---- */

export const Hero = styled.section`
  position: relative;
  width: 100%;
`;

export const Backdrop = styled.div<{ $url: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${({ $url }) => $url});
  background-size: cover;
  background-position: center;
`;

export const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: ${({ theme }) => theme.colors.overlay};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 8rem;
    background: linear-gradient(to top, ${({ theme }) => theme.colors.bg}, transparent);
  }
`;

export const HeroInner = styled.div<{ $onBackdrop: boolean }>`
  position: relative;
  max-width: 80rem;
  margin: 0 auto;
  padding: 4rem 1.5rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  color: ${({ $onBackdrop, theme }) => ($onBackdrop ? theme.colors.onOverlay : theme.colors.text)};

  ${({ theme }) => theme.bp.md} {
    padding-top: 6rem;
  }

  ${({ theme }) => theme.bp.lg} {
    flex-direction: row;
  }
`;

export const PosterCol = styled.div`
  flex-shrink: 0;
  width: 100%;

  ${({ theme }) => theme.bp.lg} {
    width: 33.333%;
  }
`;

export const PosterFrame = styled.div`
  border-radius: ${({ theme }) => theme.radii.xxl};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  background: ${({ theme }) => theme.colors.surface};

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

export const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const MovieTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
  margin-bottom: 0.75rem;

  ${({ theme }) => theme.bp.md} {
    font-size: 3rem;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  align-items: center;
  margin-bottom: 1rem;
`;

export const RatingWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

export const Tagline = styled.p`
  font-size: 1rem;
  line-height: 1.625;
  max-width: 42rem;

  ${({ theme }) => theme.bp.md} {
    font-size: 1.125rem;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
`;

/* ---- Cast / Similar rows ---- */

export const Section = styled.section`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 0;
`;

export const SectionHeading = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin-bottom: 1rem;
`;

export const ScrollRow = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
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

export const CastCard = styled.div`
  flex-shrink: 0;
  width: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const CastName = styled.span`
  margin-top: 0.5rem;
  max-width: 100%;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CastRole = styled.span`
  max-width: 100%;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SimilarItem = styled.div`
  flex-shrink: 0;
  width: 160px;
`;

/* ---- Where to watch ---- */

export const ProviderGroup = styled.div`
  & + & {
    margin-top: 0.75rem;
  }
`;

export const ProviderLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.5rem;
`;

export const ProviderLogos = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ProviderLink = styled.a`
  display: block;
  line-height: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }

  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
  }
`;

export const JustWatchNote = styled.p`
  margin-top: 0.75rem;
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ---- Content ---- */

export const ContentGrid = styled.section`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem 5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;

  ${({ theme }) => theme.bp.lg} {
    grid-template-columns: 2fr 1fr;
  }
`;

export const Stack = styled.div`
  > * + * {
    margin-top: 3rem;
  }
`;

export const BodyText = styled.p`
  font-size: 1rem;
  line-height: 1.625;
  color: ${({ theme }) => theme.colors.textSoft};
`;

/* ---- AI summary ---- */

export const SummaryWrap = styled.div`
  position: relative;
`;

export const SummaryText = styled.ul<{ $expanded: boolean }>`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 1rem;
  line-height: 1.625;
  list-style: none;

  li + li {
    margin-top: 0.75rem;
  }

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }

  ${({ $expanded }) =>
    !$expanded &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    `}
`;

export const SummaryFade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2.5rem;
  background: linear-gradient(to top, ${({ theme }) => theme.colors.surface}, transparent);
  pointer-events: none;
`;

export const MutedItalic = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  font-size: 0.875rem;
`;

export const ErrorText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.danger};
`;

/* ---- Error screen ---- */

export const CenterScreen = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  text-align: center;

  p {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.textSoft};
  }
`;
