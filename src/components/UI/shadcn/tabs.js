import React from 'react';
import styled from 'styled-components';

const TabsContext = React.createContext();

export const TabsContainer = styled.div`
  width: 100%;
`;

export const TabsList = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: var(--radius);
  background: hsl(var(--muted));
  padding: 4px;
  color: hsl(var(--muted-foreground));
  transition: background-color 0.3s ease;
  gap: 4px;
  position: relative;
  z-index: 1;
  margin-bottom: 16px;
`;

export const TabsTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: calc(var(--radius) - 2px);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: transparent;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 2;
  pointer-events: auto;
  user-select: none;
  
  &:hover:not(:disabled) {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
  
  &[data-state="active"] {
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const TabsContent = styled.div`
  margin-top: 0;
  position: relative;
  z-index: 0;
  
  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
  
  &[data-state="inactive"] {
    display: none;
  }
`;

// Main Tabs component with context
export function Tabs({ defaultValue, value: controlledValue, onValueChange, children }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleValueChange = React.useCallback((newValue) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  }, [controlledValue, onValueChange]);
  
  const contextValue = React.useMemo(() => ({
    value,
    onValueChange: handleValueChange
  }), [value, handleValueChange]);
  
  return (
    <TabsContext.Provider value={contextValue}>
      <TabsContainer>
        {children}
      </TabsContainer>
    </TabsContext.Provider>
  );
}

// Hook to use tabs context
export function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
}

// Re-export styled components for external use
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

