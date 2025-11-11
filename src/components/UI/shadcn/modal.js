import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { Button } from './button';

// Modal Overlay
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${props => props.zIndex || 1050};
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
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

// Modal Container
export const ModalContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${props => props.zIndex || 1050};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  pointer-events: none;
`;

// Modal Content
export const ModalContent = styled.div`
  position: relative;
  width: 100%;
  max-width: ${props => props.width ? `${props.width}px` : '520px'};
  max-height: 90vh;
  background: hsl(var(--card));
  border-radius: var(--radius);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transition: background-color 0.3s ease;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

// Modal Header
export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.padding || '24px 24px 16px'};
  border-bottom: 1px solid hsl(var(--border));
  transition: border-color 0.3s ease;
`;

// Modal Title
export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
  transition: color 0.3s ease;
`;

// Modal Close Button
export const ModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius);
  border: none;
  background: transparent;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
  
  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

// Modal Body
export const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.padding || '24px'};
  color: hsl(var(--foreground));
  transition: color 0.3s ease;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.3);
    border-radius: 4px;
    
    &:hover {
      background: hsl(var(--muted-foreground) / 0.5);
    }
  }
`;

// Modal Footer
export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: ${props => props.padding || '16px 24px 24px'};
  border-top: 1px solid hsl(var(--border));
  transition: border-color 0.3s ease;
`;

// Modal Component
export function Modal({
  open,
  visible, // Ant Design compatibility
  onCancel,
  onOk,
  title,
  children,
  footer,
  width,
  zIndex = 1050,
  closable = true,
  maskClosable = true,
  styles = {},
  ...props
}) {
  const isOpen = open || visible;

  React.useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape' && onCancel) {
          onCancel(e);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (maskClosable && e.target === e.currentTarget && onCancel) {
      onCancel(e);
    }
  };

  // Apply custom styles from Ant Design styles prop
  const contentStyle = styles?.content || {};
  const bodyPadding = contentStyle.padding;

  return (
    <>
      <ModalOverlay zIndex={zIndex} onClick={handleOverlayClick} />
      <ModalContainer zIndex={zIndex + 1} onClick={handleOverlayClick}>
        <ModalContent width={width} style={contentStyle} {...props}>
          {title && (
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
              {closable && (
                <ModalCloseButton onClick={onCancel}>
                  <X />
                </ModalCloseButton>
              )}
            </ModalHeader>
          )}
          
          <ModalBody padding={bodyPadding}>
            {children}
          </ModalBody>
          
          {footer !== null && (
            <ModalFooter>
              {footer !== undefined ? (
                footer
              ) : (
                <>
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button onClick={onOk}>
                    OK
                  </Button>
                </>
              )}
            </ModalFooter>
          )}
        </ModalContent>
      </ModalContainer>
    </>
  );
}

export default Modal;

