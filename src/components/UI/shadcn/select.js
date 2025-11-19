import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronDown, X, Check } from 'lucide-react';

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  font-size: 14px;
  color: hsl(var(--foreground));
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 40px;
  text-align: left;
  
  &:hover {
    border-color: hsl(var(--ring));
  }
  
  &:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 3px hsl(var(--ring) / 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.$error && `
    border-color: hsl(var(--destructive));
    
    &:focus {
      border-color: hsl(var(--destructive));
      box-shadow: 0 0 0 3px hsl(var(--destructive) / 0.1);
    }
  `}
`;

const SelectValue = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => props.$placeholder ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))'};
`;

const SelectIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  color: hsl(var(--muted-foreground));
  
  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
    transform: ${props => props.$open ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  background: transparent;
  border: none;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  border-radius: 2px;
  
  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--foreground));
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1100;
  background: hsl(var(--popover));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  max-height: 300px;
  overflow-y: auto;
  padding: 4px;
  display: ${props => props.$open ? 'block' : 'none'};
  animation: slideDown 0.2s ease;
  
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
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.5);
  }
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: calc(var(--radius) - 4px);
  cursor: pointer;
  font-size: 14px;
  color: hsl(var(--foreground));
  transition: all 0.15s ease;
  
  &:hover {
    background: hsl(var(--accent));
  }
  
  ${props => props.$selected && `
    background: hsl(var(--primary) / 0.1);
    color: hsl(var(--primary));
    font-weight: 500;
  `}
  
  ${props => props.$disabled && `
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

const CheckIcon = styled(Check)`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

export function Select({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  allowClear = false,
  showSearch = false,
  mode, // 'multiple' for multi-select
  multiple, // Alternative: boolean for multi-select
  className,
  style,
  error,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const isMultiple = mode === 'multiple' || multiple === true;
  const selectedValues = isMultiple ? (Array.isArray(value) ? value : []) : value;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open, showSearch]);

  const handleSelect = (optionValue) => {
    if (isMultiple) {
      const newValue = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(newValue);
    } else {
      onChange?.(optionValue);
      setOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(isMultiple ? [] : undefined);
  };

  const getDisplayValue = () => {
    if (isMultiple) {
      if (selectedValues.length === 0) return null;
      const labels = selectedValues
        .map(v => options.find(opt => opt.value === v)?.label || v)
        .join(', ');
      return labels;
    }
    
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption?.label || value;
  };

  const filteredOptions = showSearch && searchTerm
    ? options.filter(opt => 
        opt.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const displayValue = getDisplayValue();

  return (
    <SelectContainer ref={containerRef} className={className} style={style}>
      <SelectTrigger
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        $error={error}
        {...props}
      >
        <SelectValue $placeholder={!displayValue}>
          {displayValue || placeholder}
        </SelectValue>
        <SelectIcon $open={open}>
          {allowClear && displayValue && !disabled && (
            <ClearButton onClick={handleClear} type="button">
              <X />
            </ClearButton>
          )}
          <ChevronDown />
        </SelectIcon>
      </SelectTrigger>

      <Dropdown $open={open}>
        {showSearch && (
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            style={{
              width: '100%',
              padding: '8px 12px',
              marginBottom: '4px',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'calc(var(--radius) - 4px)',
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        )}
        
        {filteredOptions.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '14px' }}>
            No options found
          </div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = isMultiple 
              ? selectedValues.includes(option.value)
              : value === option.value;
            
            return (
              <Option
                key={option.value}
                onClick={() => !option.disabled && handleSelect(option.value)}
                $selected={isSelected}
                $disabled={option.disabled}
              >
                <span>{option.label || option.value}</span>
                {isSelected && <CheckIcon />}
              </Option>
            );
          })
        )}
      </Dropdown>
    </SelectContainer>
  );
}

export default Select;
