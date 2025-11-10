import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const Skeleton = styled.div`
  display: ${props => props.inline ? 'inline-block' : 'block'};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  border-radius: ${props => {
    if (props.circle) return '50%';
    if (props.radius) return props.radius;
    return 'var(--radius)';
  }};
  background: linear-gradient(
    90deg,
    hsl(var(--muted)) 0%,
    hsl(var(--muted) / 0.7) 50%,
    hsl(var(--muted)) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  transition: background 0.3s ease;
  
  ${props => props.circle && `
    width: ${props.size || props.height || '40px'};
    height: ${props.size || props.height || '40px'};
  `}
`;

// Common skeleton patterns
export const SkeletonText = styled(Skeleton)`
  height: 16px;
  margin-bottom: 8px;
  
  &:last-child {
    width: 60%;
    margin-bottom: 0;
  }
`;

export const SkeletonHeading = styled(Skeleton)`
  height: 24px;
  width: 40%;
  margin-bottom: 16px;
`;

export const SkeletonAvatar = styled(Skeleton).attrs({ circle: true })`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
`;

export const SkeletonButton = styled(Skeleton)`
  height: 40px;
  width: ${props => props.width || '120px'};
`;

export const SkeletonCard = styled.div`
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--card));
  transition: all 0.3s ease;
`;

// Card skeleton pattern
export function SkeletonCardPattern() {
  return (
    <SkeletonCard>
      <SkeletonHeading />
      <SkeletonText />
      <SkeletonText />
      <SkeletonText />
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
        <SkeletonButton width="100px" />
        <SkeletonButton width="100px" />
      </div>
    </SkeletonCard>
  );
}

// User profile skeleton pattern
export function SkeletonProfile() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <SkeletonAvatar size="48px" />
      <div style={{ flex: 1 }}>
        <Skeleton height="16px" width="150px" style={{ marginBottom: '8px' }} />
        <Skeleton height="14px" width="100px" />
      </div>
    </div>
  );
}

