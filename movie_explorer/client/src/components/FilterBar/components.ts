import styled from 'styled-components';
import { Button } from 'antd';

export const Panel = styled.div`
  position: sticky;
  top: 72px;
  z-index: 10;
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.md};

  ${({ theme }) => theme.bp.md} {
    padding: 1.25rem;
  }
`;

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

export const HeadTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  color: ${({ theme }) => theme.colors.textSoft};
`;

export const HeadActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const MobileOnlyButton = styled(Button)`
  ${({ theme }) => theme.bp.md} {
    display: none;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  ${({ theme }) => theme.bp.sm} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${({ theme }) => theme.bp.lg} {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;

export const Field = styled.div<{ $wide?: boolean }>`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.bp.lg} {
    grid-column: ${({ $wide }) => ($wide ? 'span 2 / span 2' : 'auto')};
  }
`;

export const Label = styled.label`
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.25rem;
`;
