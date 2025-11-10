import React from 'react';
import styled, { css } from 'styled-components';

const avatarSizes = {
  sm: '32px',
  default: '40px',
  lg: '56px',
  xl: '80px',
};

export const AvatarContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => avatarSizes[props.size || 'default']};
  height: ${(props) => avatarSizes[props.size || 'default']};
  border-radius: 9999px;
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  font-weight: 500;
  overflow: hidden;
  user-select: none;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  /* Font size based on avatar size */
  font-size: ${(props) => {
    const size = props.size || 'default';
    switch (size) {
      case 'sm':
        return '12px';
      case 'lg':
        return '20px';
      case 'xl':
        return '28px';
      default:
        return '14px';
    }
  }};
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

export const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
  font-weight: 600;
`;

export const AvatarBadge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${(props) => (props.size === 'sm' ? '8px' : props.size === 'lg' ? '14px' : '10px')};
  height: ${(props) => (props.size === 'sm' ? '8px' : props.size === 'lg' ? '14px' : '10px')};
  border-radius: 50%;
  border: 2px solid hsl(var(--background));
  transition: background-color 0.3s ease;
  
  ${(props) => {
    if (props.status === 'online') {
      return css`
        background: #10b981;
      `;
    }
    if (props.status === 'offline') {
      return css`
        background: #6b7280;
      `;
    }
    if (props.status === 'busy') {
      return css`
        background: hsl(var(--destructive));
      `;
    }
    return '';
  }}
`;

// Avatar component with image error handling
export function Avatar({ src, alt, fallback, size, status, children, style }) {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Reset error state when src changes
  React.useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [src]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const shouldShowImage = src && !imageError;
  const shouldShowFallback = !shouldShowImage && (fallback || children);

  return (
    <AvatarContainer size={size} style={style}>
      {shouldShowImage ? (
        <AvatarImage 
          src={src} 
          alt={alt || 'Avatar'} 
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : shouldShowFallback ? (
        <AvatarFallback>
          {children || fallback}
        </AvatarFallback>
      ) : (
        <AvatarFallback>?</AvatarFallback>
      )}
      {status && <AvatarBadge status={status} size={size} />}
    </AvatarContainer>
  );
}

// Avatar group
export const AvatarGroup = styled.div`
  display: inline-flex;
  align-items: center;
  
  ${AvatarContainer} {
    margin-left: ${(props) => (props.overlap ? '-8px' : '0')};
    border: 2px solid hsl(var(--background));
    
    &:first-child {
      margin-left: 0;
    }
  }
  
  ${(props) =>
    props.max &&
    css`
      ${AvatarContainer}:nth-child(n + ${props.max + 1}) {
        display: none;
      }
    `}
`;

