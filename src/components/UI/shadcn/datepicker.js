import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar } from 'lucide-react';
import moment from 'moment';

const DatePickerContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  padding-right: 40px;
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  font-size: 14px;
  color: hsl(var(--foreground));
  transition: all 0.15s ease;
  min-height: 40px;
  
  &::placeholder {
    color: hsl(var(--muted-foreground));
  }
  
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
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: hsl(var(--muted-foreground));
  pointer-events: none;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export function DatePicker({
  value,
  onChange,
  format = 'YYYY-MM-DD',
  placeholder,
  disabled = false,
  className,
  style,
  ...props
}) {
  const [inputValue, setInputValue] = useState(
    value ? moment(value).format(format) : ''
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Try to parse the date
    const parsedDate = moment(newValue, format, true);
    if (parsedDate.isValid()) {
      onChange?.(parsedDate);
    } else if (!newValue) {
      onChange?.(null);
    }
  };

  const handleBlur = () => {
    // Reformat on blur if valid
    if (value) {
      setInputValue(moment(value).format(format));
    }
  };

  // Update input value when external value changes
  React.useEffect(() => {
    if (value) {
      setInputValue(moment(value).format(format));
    } else {
      setInputValue('');
    }
  }, [value, format]);

  return (
    <DatePickerContainer className={className} style={style}>
      <DateInput
        type="date"
        value={value ? moment(value).format('YYYY-MM-DD') : ''}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder || format}
        {...props}
      />
      <IconWrapper>
        <Calendar />
      </IconWrapper>
    </DatePickerContainer>
  );
}

export default DatePicker;

