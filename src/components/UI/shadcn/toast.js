import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';

// Toast Container
const toastSlideIn = keyframes`
  from {
    transform: translateX(calc(100% + 16px));
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const toastSlideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(calc(100% + 16px));
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  width: calc(100% - 32px);
  pointer-events: none;
  
  @media (max-width: 768px) {
    top: auto;
    bottom: 16px;
    left: 16px;
    right: 16px;
    max-width: none;
  }
`;

const toastVariants = {
  default: css`
    background: hsl(var(--background));
    border-color: hsl(var(--border));
    color: hsl(var(--foreground));
  `,
  destructive: css`
    background: hsl(var(--destructive));
    border-color: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
  `,
  success: css`
    background: hsl(var(--chart-2));
    border-color: hsl(var(--chart-2));
    color: white;
  `,
  warning: css`
    background: hsl(var(--chart-4));
    border-color: hsl(var(--chart-4));
    color: hsl(var(--foreground));
  `,
  info: css`
    background: hsl(var(--primary));
    border-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  `,
};

const ToastItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  animation: ${toastSlideIn} 0.3s ease;
  pointer-events: auto;
  transition: all 0.3s ease;
  
  ${(props) => toastVariants[props.variant || 'default']}
  
  &[data-removing="true"] {
    animation: ${toastSlideOut} 0.3s ease;
  }
`;

const ToastContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ToastTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
`;

const ToastDescription = styled.div`
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.9;
`;

const ToastClose = styled.button`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--radius) - 4px);
  
  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.1);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

// Close icon
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Toast Context
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, removing: true } : toast
      )
    );
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback(({ title, description, variant = 'default', duration = 5000 }) => {
    const id = Date.now().toString();
    
    setToasts((prev) => [...prev, { id, title, description, variant, removing: false }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, [removeToast]);

  const toast = useCallback(
    (options) => {
      if (typeof options === 'string') {
        return addToast({ description: options });
      }
      return addToast(options);
    },
    [addToast]
  );

  // Add helper methods
  toast.success = (options) =>
    addToast(typeof options === 'string' ? { description: options, variant: 'success' } : { ...options, variant: 'success' });
  
  toast.error = (options) =>
    addToast(typeof options === 'string' ? { description: options, variant: 'destructive' } : { ...options, variant: 'destructive' });
  
  toast.warning = (options) =>
    addToast(typeof options === 'string' ? { description: options, variant: 'warning' } : { ...options, variant: 'warning' });
  
  toast.info = (options) =>
    addToast(typeof options === 'string' ? { description: options, variant: 'info' } : { ...options, variant: 'info' });

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toastItem) => (
          <ToastItem
            key={toastItem.id}
            variant={toastItem.variant}
            data-removing={toastItem.removing}
          >
            <ToastContent>
              {toastItem.title && <ToastTitle>{toastItem.title}</ToastTitle>}
              {toastItem.description && (
                <ToastDescription>{toastItem.description}</ToastDescription>
              )}
            </ToastContent>
            <ToastClose onClick={() => removeToast(toastItem.id)}>
              <CloseIcon />
            </ToastClose>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}

