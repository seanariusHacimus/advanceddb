import React, { useState, createContext, useContext } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Button } from './button';

// Animations
const overlayShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const contentShow = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const AlertDialogContext = createContext();

// Overlay (backdrop)
const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  z-index: 9998;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(2px);
`;

// Content container
const Content = styled.div`
  background-color: hsl(var(--background));
  border-radius: calc(var(--radius) + 2px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  padding: 24px;
  z-index: 9999;
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  transition: background-color 0.3s ease;
  
  &:focus {
    outline: none;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
  line-height: 1;
  transition: color 0.3s ease;
`;

const Description = styled.p`
  font-size: 14px;
  color: hsl(var(--muted-foreground));
  margin: 0;
  line-height: 1.5;
  transition: color 0.3s ease;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`;

// AlertDialog Component
export function AlertDialog({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  cancelText = 'Cancel', 
  confirmText = 'Confirm',
  onConfirm,
  onCancel,
  variant = 'default', // 'default' or 'destructive'
  children 
}) {
  if (!open) return null;

  const handleCancel = () => {
    if (onCancel) onCancel();
    if (onOpenChange) onOpenChange(false);
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    if (onOpenChange) onOpenChange(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <>
      <Overlay onClick={handleOverlayClick} />
      <Content>
        <Header>
          {title && <Title>{title}</Title>}
          {description && <Description>{description}</Description>}
        </Header>
        {children}
        <Footer>
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </Footer>
      </Content>
    </>
  );
}

// Hook-based AlertDialog for easier usage
export function useAlertDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({});

  const showAlert = (alertConfig) => {
    setConfig(alertConfig);
    setIsOpen(true);
  };

  const hideAlert = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    showAlert,
    hideAlert,
    AlertDialog: () => (
      <AlertDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        {...config}
      />
    ),
  };
}

// Popconfirm replacement (for Ant Design compatibility)
export function Popconfirm({
  title,
  description,
  onConfirm,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
  okType = 'primary',
  children,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    if (!disabled) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setOpen(false);
  };

  return (
    <>
      <span onClick={handleClick} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {children}
      </span>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        confirmText={okText}
        cancelText={cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        variant={okType === 'danger' ? 'destructive' : 'default'}
      />
    </>
  );
}

export default AlertDialog;

