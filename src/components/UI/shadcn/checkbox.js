import React from 'react';
import styled from 'styled-components';

const CheckboxContainer = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  
  &[data-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CheckboxBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: calc(var(--radius) - 2px);
  border: 2px solid hsl(var(--primary));
  background: hsl(var(--background));
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  ${CheckboxInput}:checked + & {
    background: hsl(var(--primary));
    border-color: hsl(var(--primary));
  }
  
  ${CheckboxInput}:focus-visible + & {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
  
  ${CheckboxInput}:disabled + & {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${CheckboxContainer}:hover ${CheckboxInput}:not(:disabled) + & {
    border-color: hsl(var(--primary) / 0.8);
  }
  
  svg {
    width: 14px;
    height: 14px;
    color: hsl(var(--primary-foreground));
    opacity: 0;
    transform: scale(0);
    transition: all 0.2s ease;
  }
  
  ${CheckboxInput}:checked + & svg {
    opacity: 1;
    transform: scale(1);
  }
`;

const CheckboxLabel = styled.span`
  font-size: 14px;
  color: hsl(var(--foreground));
  transition: color 0.3s ease;
  
  &[data-disabled="true"] {
    color: hsl(var(--muted-foreground));
  }
`;

// Check icon
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function Checkbox({ 
  id, 
  checked, 
  defaultChecked,
  onChange,
  onCheckedChange, // Support shadcn-style API
  disabled, 
  label, 
  children,
  className,
  ...props 
}) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
  
  const isChecked = checked !== undefined ? checked : internalChecked;
  
  const handleChange = (e) => {
    const newChecked = e.target.checked;
    
    if (checked === undefined) {
      setInternalChecked(newChecked);
    }
    
    // Support both onChange (React standard) and onCheckedChange (shadcn/Radix style)
    onChange?.(e);
    onCheckedChange?.(newChecked);
  };
  
  return (
    <CheckboxContainer data-disabled={disabled} htmlFor={id} className={className}>
      <CheckboxInput
        id={id}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <CheckboxBox>
        <CheckIcon />
      </CheckboxBox>
      {(label || children) && (
        <CheckboxLabel data-disabled={disabled}>
          {label || children}
        </CheckboxLabel>
      )}
    </CheckboxContainer>
  );
}

