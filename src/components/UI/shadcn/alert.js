import React from 'react';
import styled, { css } from 'styled-components';

// First, declare the styled components without using them in variants
export const AlertIcon = styled.div`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const AlertContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AlertTitle = styled.h5`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  transition: color 0.3s ease;
`;

export const AlertDescription = styled.div`
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.9;
  transition: color 0.3s ease;
`;

// Now define variants that reference the components
const alertVariants = {
  default: css`
    background: hsl(var(--background));
    border-color: hsl(var(--border));
    color: hsl(var(--foreground));
  `,
  destructive: css`
    background: hsl(var(--destructive) / 0.1);
    border-color: hsl(var(--destructive) / 0.5);
    color: hsl(var(--destructive));
    
    ${AlertTitle}, ${AlertDescription} {
      color: hsl(var(--destructive));
    }
  `,
  success: css`
    background: hsl(var(--chart-2) / 0.1);
    border-color: hsl(var(--chart-2) / 0.5);
    color: hsl(var(--chart-2));
    
    ${AlertTitle}, ${AlertDescription} {
      color: hsl(var(--chart-2));
    }
  `,
  warning: css`
    background: hsl(var(--chart-4) / 0.1);
    border-color: hsl(var(--chart-4) / 0.5);
    color: hsl(var(--chart-4));
    
    ${AlertTitle}, ${AlertDescription} {
      color: hsl(var(--chart-4));
    }
  `,
  info: css`
    background: hsl(var(--primary) / 0.1);
    border-color: hsl(var(--primary) / 0.5);
    color: hsl(var(--primary));
    
    ${AlertTitle}, ${AlertDescription} {
      color: hsl(var(--primary));
    }
  `,
};

// Main Alert component using the variants
export const Alert = styled.div`
  position: relative;
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid;
  padding: 16px;
  display: flex;
  gap: 12px;
  transition: all 0.3s ease;
  
  ${(props) => alertVariants[props.variant || 'default']}
`;

// Icon components
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

// Helper component with predefined icons
export function AlertWithIcon({ variant = 'default', title, description, children, icon }) {
  const getIcon = () => {
    if (icon) return icon;
    
    switch (variant) {
      case 'success':
        return <CheckCircleIcon />;
      case 'warning':
        return <AlertTriangleIcon />;
      case 'destructive':
        return <XCircleIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <InfoIcon />;
    }
  };
  
  return (
    <Alert variant={variant}>
      <AlertIcon>{getIcon()}</AlertIcon>
      <AlertContent>
        {title && <AlertTitle>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
        {children}
      </AlertContent>
    </Alert>
  );
}

// Export both Alert and AlertWithIcon
Alert.Icon = AlertIcon;
Alert.Content = AlertContent;
Alert.Title = AlertTitle;
Alert.Description = AlertDescription;
Alert.WithIcon = AlertWithIcon;

