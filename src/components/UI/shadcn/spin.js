import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Loader2 } from 'lucide-react';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinContainer = styled.div`
  display: ${props => props.$inline ? 'inline-flex' : 'flex'};
  align-items: center;
  justify-content: center;
  ${props => !props.$inline && `
    width: 100%;
    min-height: ${props.$size === 'large' ? '200px' : props.$size === 'small' ? '100px' : '150px'};
  `}
`;

const SpinIcon = styled(Loader2)`
  color: hsl(var(--primary));
  animation: ${rotate} 1s linear infinite;
  width: ${props => 
    props.$size === 'large' ? '48px' : 
    props.$size === 'small' ? '16px' : 
    '24px'
  };
  height: ${props => 
    props.$size === 'large' ? '48px' : 
    props.$size === 'small' ? '16px' : 
    '24px'
  };
`;

const SpinText = styled.div`
  margin-top: 12px;
  color: hsl(var(--muted-foreground));
  font-size: 14px;
`;

const SpinWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export function Spin({
  size = 'default',
  tip,
  spinning = true,
  children,
  className,
  style,
}) {
  if (!spinning && !children) return null;

  if (children) {
    return (
      <div style={{ position: 'relative', ...style }} className={className}>
        {children}
        {spinning && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'hsl(var(--background) / 0.8)',
            zIndex: 10,
            borderRadius: 'calc(var(--radius) - 2px)',
          }}>
            <SpinWrapper>
              <SpinIcon $size={size} />
              {tip && <SpinText>{tip}</SpinText>}
            </SpinWrapper>
          </div>
        )}
      </div>
    );
  }

  return (
    <SpinContainer $inline={false} $size={size} className={className} style={style}>
      <SpinWrapper>
        <SpinIcon $size={size} />
        {tip && <SpinText>{tip}</SpinText>}
      </SpinWrapper>
    </SpinContainer>
  );
}

export default Spin;

