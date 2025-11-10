import React from 'react';
import styled from 'styled-components';

export const DialogOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.2s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const DialogContent = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 1001;
  transform: translate(-50%, -50%);
  width: calc(100% - 32px);
  max-width: ${props => props.maxWidth || '500px'};
  max-height: calc(100vh - 32px);
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  animation: slideIn 0.2s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

export const DialogHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 24px 16px;
  border-bottom: 1px solid hsl(var(--border));
  transition: border-color 0.3s ease;
`;

export const DialogTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
  transition: color 0.3s ease;
`;

export const DialogDescription = styled.p`
  font-size: 14px;
  color: hsl(var(--muted-foreground));
  margin: 8px 0 0;
  transition: color 0.3s ease;
`;

export const DialogBody = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  color: hsl(var(--foreground));
  transition: color 0.3s ease;
  
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
`;

export const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid hsl(var(--border));
  transition: border-color 0.3s ease;
`;

export const DialogClose = styled.button`
  position: absolute;
  right: 16px;
  top: 16px;
  border-radius: calc(var(--radius) - 2px);
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
  
  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Dialog wrapper component
export function Dialog({ open, onClose, children, maxWidth }) {
  React.useEffect(() => {
    if (open) {
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
      
      // Handle ESC key
      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose?.();
      };
      document.addEventListener('keydown', handleEsc);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [open, onClose]);
  
  if (!open) return null;
  
  return (
    <>
      <DialogOverlay onClick={onClose} />
      <DialogContent maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
        {children}
      </DialogContent>
    </>
  );
}

// Re-export components
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogClose;

