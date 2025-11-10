import React, { useState } from 'react';
import styled from 'styled-components';

export const TooltipContent = styled.div`
  position: absolute;
  z-index: 1100;
  border-radius: calc(var(--radius) - 2px);
  background: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border: 1px solid hsl(var(--border));
  max-width: 300px;
  word-wrap: break-word;
  pointer-events: none;
  animation: fadeIn 0.15s ease;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  
  &[data-side="top"] {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }
  
  &[data-side="bottom"] {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }
  
  &[data-side="left"] {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }
  
  &[data-side="right"] {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const TooltipTrigger = styled.div`
  position: relative;
  display: inline-flex;
  cursor: help;
`;

// Tooltip component with hover functionality
export function Tooltip({ children, content, side = 'top', delay = 200 }) {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setVisible(false);
  };

  return (
    <TooltipTrigger
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && content && (
        <TooltipContent data-side={side}>
          {content}
        </TooltipContent>
      )}
    </TooltipTrigger>
  );
}

