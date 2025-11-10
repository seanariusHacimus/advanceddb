import React from 'react';
import styled from 'styled-components';

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RadioContainer = styled.label`
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

const RadioInput = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const RadioButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid hsl(var(--primary));
  background: hsl(var(--background));
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: hsl(var(--primary));
    opacity: 0;
    transform: scale(0);
    transition: all 0.2s ease;
  }
  
  ${RadioInput}:checked + & {
    border-color: hsl(var(--primary));
    
    &::after {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  ${RadioInput}:focus-visible + & {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
  
  ${RadioInput}:disabled + & {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${RadioContainer}:hover ${RadioInput}:not(:disabled) + & {
    border-color: hsl(var(--primary) / 0.8);
  }
`;

const RadioLabel = styled.span`
  font-size: 14px;
  color: hsl(var(--foreground));
  transition: color 0.3s ease;
  
  &[data-disabled="true"] {
    color: hsl(var(--muted-foreground));
  }
`;

export function Radio({ 
  id, 
  name,
  value,
  checked, 
  onChange, 
  disabled, 
  label, 
  children,
  ...props 
}) {
  return (
    <RadioContainer data-disabled={disabled} htmlFor={id}>
      <RadioInput
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.value, e)}
        disabled={disabled}
        {...props}
      />
      <RadioButton />
      {(label || children) && (
        <RadioLabel data-disabled={disabled}>
          {label || children}
        </RadioLabel>
      )}
    </RadioContainer>
  );
}

// RadioGroup component for managing multiple radios
export function RadioGroupComponent({ 
  value, 
  defaultValue,
  onValueChange, 
  children, 
  orientation = 'vertical',
  ...props 
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };
  
  return (
    <RadioGroup 
      style={{ flexDirection: orientation === 'horizontal' ? 'row' : 'column' }}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              checked: child.props.value === currentValue,
              onChange: handleChange,
            })
          : child
      )}
    </RadioGroup>
  );
}

// Export both Radio and RadioGroup
Radio.Group = RadioGroupComponent;

