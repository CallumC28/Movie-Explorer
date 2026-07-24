import styled from "styled-components";

export const Grid = styled.div<{ $min: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${(p) => p.$min}px, 1fr));
  gap: 1.5rem;
  padding: 0 0.5rem;
`;

export const Card = styled.div`
  min-width: 0;
  content-visibility: auto; /* browser skips offscreen layout/paint — replaces react-window virtualization */
  contain-intrinsic-size: auto 360px;

  @media (prefers-reduced-motion: no-preference) {
    transition: transform 0.3s ease;
    &:hover {
      transform: translateY(-2px);
    }
  }
`;
