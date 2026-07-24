import styled from 'styled-components';
import Container from '@/components/Container';

export const Main = styled.main`
  min-height: 100vh;
  width: 100%;
`;

export const Content = styled(Container)``;

export const PageHead = styled.header`
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${({ theme }) => theme.bp.sm} {
    margin-top: 2.5rem;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

export const CountText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Controls = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.75rem;

  ${({ theme }) => theme.bp.sm} {
    width: auto;
    flex-direction: row;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const Grid = styled.div`
  margin-bottom: 3rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  ${({ theme }) => theme.bp.sm} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${({ theme }) => theme.bp.md} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  ${({ theme }) => theme.bp.lg} {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  ${({ theme }) => theme.bp.xl} {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;

export const CardWrap = styled.div`
  position: relative;
`;

export const RemoveButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.overlay};
  padding: 0.5rem;
  color: ${({ theme }) => theme.colors.onOverlay};
  opacity: 0;
  transition: opacity 0.15s ease, background 0.15s ease;

  ${CardWrap}:hover &,
  &:focus-visible {
    opacity: 1;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.danger};
  }
`;
