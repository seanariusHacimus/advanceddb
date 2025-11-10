import styled, { css } from 'styled-components';

const buttonVariants = {
  default: css`
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    
    &:hover:not(:disabled) {
      background: hsl(var(--primary) / 0.9);
    }
  `,
  destructive: css`
    background: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
    
    &:hover:not(:disabled) {
      background: hsl(var(--destructive) / 0.9);
    }
  `,
  outline: css`
    border: 1px solid hsl(var(--input));
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    
    &:hover:not(:disabled) {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
  `,
  secondary: css`
    background: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
    
    &:hover:not(:disabled) {
      background: hsl(var(--secondary) / 0.8);
    }
  `,
  ghost: css`
    background: transparent;
    color: hsl(var(--foreground));
    
    &:hover:not(:disabled) {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
  `,
  link: css`
    background: transparent;
    color: hsl(var(--primary));
    text-decoration: underline;
    text-underline-offset: 4px;
    
    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  `,
};

const buttonSizes = {
  default: css`
    height: 40px;
    padding: 0 16px;
    font-size: 14px;
  `,
  sm: css`
    height: 36px;
    padding: 0 12px;
    font-size: 13px;
  `,
  lg: css`
    height: 44px;
    padding: 0 24px;
    font-size: 15px;
  `,
  icon: css`
    height: 40px;
    width: 40px;
    padding: 0;
  `,
};

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius);
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  
  /* Apply size */
  ${(props) => buttonSizes[props.size || 'default']}
  
  /* Apply variant */
  ${(props) => buttonVariants[props.variant || 'default']}
  
  /* Focus styles */
  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
  
  /* Disabled styles */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Full width */
  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}
`;

// Icon button helper
export const IconButton = styled(Button).attrs({ size: 'icon' })``;

// Button group
export const ButtonGroup = styled.div`
  display: inline-flex;
  gap: 8px;
  
  ${(props) =>
    props.attached &&
    css`
      gap: 0;
      
      ${Button} {
        border-radius: 0;
        
        &:first-child {
          border-top-left-radius: var(--radius);
          border-bottom-left-radius: var(--radius);
        }
        
        &:last-child {
          border-top-right-radius: var(--radius);
          border-bottom-right-radius: var(--radius);
        }
      }
    `}
`;

