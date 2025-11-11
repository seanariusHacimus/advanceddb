import React from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

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
  position: relative;
  z-index: 1;
  
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
  
  &[data-state="open"] {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export const DropdownContent = styled.div`
  position: fixed;
  z-index: 9999;
  min-width: 180px;
  max-width: 300px;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  padding: 4px;
  animation: slideDown 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  transition: background-color 0.3s ease, border-color 0.3s ease;
  overflow: hidden;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
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
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  color: hsl(var(--popover-foreground));
  white-space: nowrap;
  
  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
    outline: none;
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
  
  ${props => props.variant === 'destructive' && css`
    color: hsl(var(--destructive));
    
    &:hover {
      background: hsl(var(--destructive));
      color: hsl(var(--destructive-foreground));
    }
    
    &:focus {
      background: hsl(var(--destructive));
      color: hsl(var(--destructive-foreground));
    }
    
    svg {
      color: hsl(var(--destructive));
    }
    
    &:hover svg,
    &:focus svg {
      color: hsl(var(--destructive-foreground));
    }
  `}
  
  svg {
    position: absolute;
    left: 8px;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
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

// Helper component for managing dropdown state with portal rendering
export function DropdownMenuWrapper({ children, trigger, align = 'end' }) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef(null);
  const contentRef = React.useRef(null);

  // Calculate position
  const updatePosition = React.useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      
      setPosition({
        top: rect.bottom + scrollY + 4,
        left: rect.right + scrollX - (align === 'end' ? 180 : 0) // 180 = min-width of dropdown
      });
    }
  }, [align]);

  // Handle toggle
  const handleToggle = React.useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!open) {
      updatePosition();
    }
    setOpen(!open);
  }, [open, updatePosition]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(event.target) &&
        !contentRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [open, updatePosition]);

  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open]);

  // Handle item click - close dropdown
  const handleItemClick = React.useCallback((e) => {
    // Don't close if clicking on Popconfirm or its children
    if (!e.target.closest('[role="dialog"]')) {
      setOpen(false);
    }
  }, []);

  return (
    <DropdownMenu ref={triggerRef}>
      <DropdownTrigger 
        onClick={handleToggle}
        data-state={open ? 'open' : 'closed'}
        type="button"
      >
        {trigger}
      </DropdownTrigger>
      {open && ReactDOM.createPortal(
        <DropdownContent
          ref={contentRef}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          onClick={handleItemClick}
        >
          {children}
        </DropdownContent>,
        document.body
      )}
    </DropdownMenu>
  );
}

