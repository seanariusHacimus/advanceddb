import React from 'react';
import styled from 'styled-components';

const SwitchContainer = styled.label`
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

const SwitchInput = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchTrack = styled.div`
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  background: hsl(var(--input));
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  ${SwitchInput}:checked + & {
    background: hsl(var(--primary));
  }
  
  ${SwitchInput}:focus-visible + & {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
  
  ${SwitchInput}:disabled + & {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${SwitchContainer}:hover ${SwitchInput}:not(:disabled) + & {
    background: hsl(var(--input) / 0.8);
  }
  
  ${SwitchContainer}:hover ${SwitchInput}:checked:not(:disabled) + & {
    background: hsl(var(--primary) / 0.9);
  }
`;

const SwitchThumb = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: hsl(var(--background));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  
  ${SwitchInput}:checked + ${SwitchTrack} & {
    transform: translateX(20px);
  }
`;

const SwitchLabel = styled.span`
  font-size: 14px;
  color: hsl(var(--foreground));
  transition: color 0.3s ease;
  
  &[data-disabled="true"] {
    color: hsl(var(--muted-foreground));
  }
`;

export function Switch({ 
  id, 
  checked, 
  defaultChecked,
  onCheckedChange, 
  disabled, 
  label, 
  children,
  ...props 
}) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
  
  const isChecked = checked !== undefined ? checked : internalChecked;
  
  const handleChange = (e) => {
    if (checked === undefined) {
      setInternalChecked(e.target.checked);
    }
    onCheckedChange?.(e.target.checked);
  };
  
  return (
    <SwitchContainer data-disabled={disabled} htmlFor={id}>
      <SwitchInput
        id={id}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <SwitchTrack>
        <SwitchThumb />
      </SwitchTrack>
      {(label || children) && (
        <SwitchLabel data-disabled={disabled}>
          {label || children}
        </SwitchLabel>
      )}
    </SwitchContainer>
  );
}

