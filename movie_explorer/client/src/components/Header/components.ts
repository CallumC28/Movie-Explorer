import styled from "styled-components";
import { Link } from "react-router-dom";

export const Bar = styled.div`
  position: sticky;
  top: 0;
  z-index: 30;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};

  ${({ theme }) => theme.bp.md} {
    padding: 0.75rem 0;
  }
`;

export const Inner = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0 0.75rem;
  flex-wrap: wrap;

  ${({ theme }) => theme.bp.md} {
    flex-wrap: nowrap;
  }
`;

export const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  outline: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const Logo = styled.div`
  height: 2.25rem;
  width: 2.25rem;
  display: grid;
  place-items: center;
  font-size: 1.125rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.onAccent};
  transition: transform 0.15s ease;

  ${Brand}:hover & {
    transform: rotate(3deg);
  }
`;

export const Title = styled.span`
  display: block;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.bp.md} {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.span`
  display: block;
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const SearchWrap = styled.div`
  order: 3;
  flex: 1 1 100%;
  width: 100%;

  ${({ theme }) => theme.bp.md} {
    order: 0;
    flex: 1 1 auto;
    max-width: 36rem;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
