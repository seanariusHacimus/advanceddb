import React from 'react';
import styled from 'styled-components';

export const DropdownMenu = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius);
  border: none;
  background: transparent;
  color: hsl(var(--muted-foreground));
  padding: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
  
  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export const DropdownContent = styled.div`
  position: absolute;
  z-index: 50;
  min-width: 200px;
  margin-top: 4px;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  padding: 4px;
  animation: slideDown 0.2s ease;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  
  &[data-align="end"] {
    right: 0;
  }
  
  &[data-align="start"] {
    left: 0;
  }
  
  &[data-align="center"] {
    left: 50%;
    transform: translateX(-50%);
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DropdownItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: calc(var(--radius) - 2px);
  padding: 8px 8px 8px 32px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  color: hsl(var(--popover-foreground));
  
  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
  
  &:focus {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
    outline: none;
  }
  
  &[data-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }
  
  svg {
    position: absolute;
    left: 8px;
    width: 16px;
    height: 16px;
  }
`;

export const DropdownSeparator = styled.div`
  height: 1px;
  margin: 4px 0;
  background: hsl(var(--border));
  transition: background-color 0.3s ease;
`;

export const DropdownLabel = styled.div`
  padding: 6px 8px 6px 32px;
  font-size: 12px;
  font-weight: 600;
  color: hsl(var(--muted-foreground));
  transition: color 0.3s ease;
`;

export const DropdownShortcut = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  transition: color 0.3s ease;
`;

// Helper component for managing dropdown state
export function DropdownMenuWrapper({ children, trigger, align = 'start' }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);
  
  // Close dropdown when an item is clicked
  const handleItemClick = () => {
    setOpen(false);
  };

  return (
    <DropdownMenu ref={containerRef}>
      <DropdownTrigger onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
        {trigger}
      </DropdownTrigger>
      {open && (
        <DropdownContent data-align={align} onClick={handleItemClick}>
          {children}
        </DropdownContent>
      )}
    </DropdownMenu>
  );
}

