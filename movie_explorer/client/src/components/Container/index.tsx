import styled from "styled-components";

/** Page-width wrapper used by every page. */
const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 0.75rem;

  ${({ theme }) => theme.bp.md} {
    padding: 0 1.5rem;
  }
`;

export default Container;
