import { Skeleton } from "antd";
import styled from "styled-components";

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;

  .ant-skeleton-image {
    width: 100%;
    height: 16rem;
    border-radius: 0;
  }
`;

const Body = styled.div`
  padding: 1rem;
`;

/** Card-shaped loading placeholder built from AntD Skeleton primitives. */
function SkeletonCard() {
  return (
    <Card aria-hidden="true">
      <Skeleton.Image active />
      <Body>
        <Skeleton
          active
          title={{ width: "75%" }}
          paragraph={{ rows: 1, width: "50%" }}
        />
      </Body>
    </Card>
  );
}

export default SkeletonCard;
