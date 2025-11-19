import React, { createContext, useContext, useState } from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

// Context for managing accordion state
const AccordionContext = createContext();
const AccordionItemContext = createContext();

// Styled Components
const AccordionRoot = styled.div`
  width: 100%;
`;

const AccordionItemWrapper = styled.div`
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  margin-bottom: 12px;
  background: hsl(var(--card));
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    border-color: hsl(var(--primary) / 0.5);
  }

  &[data-state="open"] {
    border-color: hsl(var(--primary));
  }
`;

const AccordionTriggerButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: hsl(var(--foreground));
  font-size: 15px;
  font-weight: 500;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background: hsl(var(--accent) / 0.5);
  }

  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
    color: hsl(var(--muted-foreground));
  }

  &[data-state="open"] svg {
    transform: rotate(180deg);
  }
`;

const AccordionContentWrapper = styled.div`
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &[data-state="closed"] {
    max-height: 0;
    opacity: 0;
  }

  &[data-state="open"] {
    max-height: 10000px;
    opacity: 1;
  }
`;

const AccordionContentInner = styled.div`
  padding: 0 20px 16px 20px;
  color: hsl(var(--muted-foreground));
  font-size: 14px;
  line-height: 1.6;
`;

// Accordion Root Component
export const Accordion = ({ children, type = "multiple", value, onValueChange, defaultValue, className }) => {
  const [internalValue, setInternalValue] = useState(defaultValue || (type === "multiple" ? [] : null));
  
  const activeValue = value !== undefined ? value : internalValue;
  
  const handleValueChange = (itemValue) => {
    let newValue;
    
    if (type === "multiple") {
      const currentArray = Array.isArray(activeValue) ? activeValue : [];
      newValue = currentArray.includes(itemValue)
        ? currentArray.filter(v => v !== itemValue)
        : [...currentArray, itemValue];
    } else {
      newValue = activeValue === itemValue ? null : itemValue;
    }
    
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };
  
  const isItemOpen = (itemValue) => {
    if (type === "multiple") {
      return Array.isArray(activeValue) && activeValue.includes(itemValue);
    }
    return activeValue === itemValue;
  };
  
  return (
    <AccordionContext.Provider value={{ handleValueChange, isItemOpen, type }}>
      <AccordionRoot className={className}>
        {children}
      </AccordionRoot>
    </AccordionContext.Provider>
  );
};

// Accordion Item Component
export const AccordionItem = ({ children, value, className }) => {
  const { isItemOpen } = useContext(AccordionContext);
  const open = isItemOpen(value);
  
  return (
    <AccordionItemContext.Provider value={{ value, open }}>
      <AccordionItemWrapper 
        data-state={open ? "open" : "closed"}
        className={className}
      >
        {children}
      </AccordionItemWrapper>
    </AccordionItemContext.Provider>
  );
};

// Accordion Trigger Component
export const AccordionTrigger = ({ children, className, asChild }) => {
  const { handleValueChange } = useContext(AccordionContext);
  const { value, open } = useContext(AccordionItemContext);
  
  if (asChild) {
    // Allow custom trigger element
    return React.cloneElement(children, {
      onClick: () => handleValueChange(value),
      'data-state': open ? "open" : "closed",
    });
  }
  
  return (
    <AccordionTriggerButton
      type="button"
      onClick={() => handleValueChange(value)}
      data-state={open ? "open" : "closed"}
      className={className}
    >
      {children}
      <ChevronDown size={18} />
    </AccordionTriggerButton>
  );
};

// Accordion Content Component
export const AccordionContent = ({ children, className }) => {
  const { open } = useContext(AccordionItemContext);
  
  return (
    <AccordionContentWrapper 
      data-state={open ? "open" : "closed"}
      className={className}
    >
      <AccordionContentInner>
        {children}
      </AccordionContentInner>
    </AccordionContentWrapper>
  );
};

