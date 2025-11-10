import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

export const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SelectTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--input));
  background: hsl(var(--background));
  padding: 8px 12px;
  font-size: 14px;
  color: hsl(var(--foreground));
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: hsl(var(--ring) / 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  &[data-placeholder="true"] {
    color: hsl(var(--muted-foreground));
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: hsl(var(--muted-foreground));
    transition: transform 0.2s ease;
  }
  
  &[data-state="open"] svg {
    transform: rotate(180deg);
  }
`;

export const SelectContent = styled.div`
  position: absolute;
  z-index: 50;
  width: 100%;
  margin-top: 4px;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--popover));
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  max-height: 300px;
  overflow-y: auto;
  animation: slideDown 0.2s ease;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.5);
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

export const SelectItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 12px 8px 32px;
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
  
  &[data-selected="true"] {
    background: hsl(var(--accent));
    font-weight: 500;
    
    &::before {
      content: "✓";
      position: absolute;
      left: 8px;
      font-size: 14px;
    }
  }
  
  &[data-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const SelectSeparator = styled.div`
  height: 1px;
  margin: 4px 0;
  background: hsl(var(--border));
  transition: background-color 0.3s ease;
`;

export const SelectLabel = styled.div`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: hsl(var(--muted-foreground));
  transition: color 0.3s ease;
`;

// Chevron Down Icon
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// Select component with state management
export function Select({ value, onValueChange, placeholder = "Select an option", disabled, children }) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
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

  // Update selected value when prop changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  // Get display text for selected value
  const getDisplayText = () => {
    if (!selectedValue) return placeholder;
    
    // Find the selected item's label
    const items = React.Children.toArray(children);
    for (const child of items) {
      if (React.isValidElement(child) && child.props.value === selectedValue) {
        return child.props.children;
      }
    }
    return selectedValue;
  };

  return (
    <SelectContainer ref={containerRef}>
      <SelectTrigger
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        data-state={open ? 'open' : 'closed'}
        data-placeholder={!selectedValue}
      >
        <span>{getDisplayText()}</span>
        <ChevronDownIcon />
      </SelectTrigger>
      {open && (
        <SelectContent>
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
                  selected: child.props.value === selectedValue,
                  onClick: () => handleSelect(child.props.value),
                })
              : child
          )}
        </SelectContent>
      )}
    </SelectContainer>
  );
}

// SelectItem component with selection state
Select.Item = ({ value, children, disabled, selected, onClick }) => (
  <SelectItem
    data-selected={selected}
    data-disabled={disabled}
    onClick={!disabled ? onClick : undefined}
  >
    {children}
  </SelectItem>
);

Select.Label = SelectLabel;
Select.Separator = SelectSeparator;

