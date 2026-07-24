import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Card = styled(Link)`
  display: block;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const PosterWrap = styled.div`
  position: relative;
  overflow: hidden;
`;

export const Poster = styled.img`
  aspect-ratio: 2 / 3; /* TMDB posters are natively 2:3 — no cropping at any column width */
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.03);
  }
`;

export const RatingBadge = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.overlay};
  color: ${({ theme }) => theme.colors.onOverlay};
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;

  svg {
    color: ${({ theme }) => theme.colors.star};
  }
`;

export const HeartButton = styled.button<{ $saved: boolean }>`
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.full};
  padding: 0.25rem;
  transition: opacity 0.15s ease, background 0.15s ease;
  background: ${({ $saved, theme }) => ($saved ? theme.colors.danger : theme.colors.overlay)};
  opacity: ${({ $saved }) => ($saved ? 1 : 0)};

  ${Card}:hover &,
  &:focus-visible {
    opacity: 1;
  }

  svg {
    height: 1.25rem;
    width: 1.25rem;
    color: ${({ theme }) => theme.colors.onOverlay};
  }
`;

export const Body = styled.div`
  padding: 0.75rem;
`;

export const CardTitle = styled.h3`
  font-weight: 600;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Year = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;
