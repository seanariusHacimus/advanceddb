import styled, { css } from 'styled-components';

const badgeVariants = {
  default: css`
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    
    &:hover {
      background: hsl(var(--primary) / 0.8);
    }
  `,
  secondary: css`
    background: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
    
    &:hover {
      background: hsl(var(--secondary) / 0.8);
    }
  `,
  destructive: css`
    background: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
    
    &:hover {
      background: hsl(var(--destructive) / 0.8);
    }
  `,
  outline: css`
    background: transparent;
    border: 1px solid hsl(var(--input));
    color: hsl(var(--foreground));
  `,
  success: css`
    background: hsl(var(--chart-2));
    color: hsl(var(--primary-foreground));
    
    &:hover {
      background: hsl(var(--chart-2) / 0.8);
    }
  `,
  warning: css`
    background: hsl(var(--chart-4));
    color: hsl(var(--foreground));
    
    &:hover {
      background: hsl(var(--chart-4) / 0.8);
    }
  `,
};

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 9999px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  /* Apply variant */
  ${(props) => badgeVariants[props.variant || 'default']}
  
  /* Small size */
  ${(props) =>
    props.size === 'sm' &&
    css`
      padding: 1px 6px;
      font-size: 11px;
    `}
  
  /* Large size */
  ${(props) =>
    props.size === 'lg' &&
    css`
      padding: 4px 14px;
      font-size: 13px;
    `}
  
  /* Dot indicator */
  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

// Badge with dot indicator
export const DotBadge = styled(Badge)`
  padding-left: 6px;
`;

// Badge group
export const BadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

