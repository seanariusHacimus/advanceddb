import React from 'react';
import styled, { css } from 'styled-components';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const alertVariants = {
  info: css`
    background: hsl(var(--primary) / 0.1);
    border-color: hsl(var(--primary) / 0.3);
    color: hsl(var(--primary));
  `,
  success: css`
    background: hsl(var(--success) / 0.1);
    border-color: hsl(var(--success) / 0.3);
    color: hsl(var(--success));
  `,
  warning: css`
    background: hsl(var(--status-in-progress) / 0.1);
    border-color: hsl(var(--status-in-progress) / 0.3);
    color: hsl(var(--status-in-progress));
  `,
  error: css`
    background: hsl(var(--destructive) / 0.1);
    border-color: hsl(var(--destructive) / 0.3);
    color: hsl(var(--destructive));
  `,
};

const AlertContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.2s ease;
  
  ${props => alertVariants[props.$type || 'info']}
  
  ${props => props.$closable && `
    padding-right: 40px;
    position: relative;
  `}
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const Content = styled.div`
  flex: 1;
`;

const Message = styled.div`
  font-weight: 600;
  margin-bottom: ${props => props.$hasDescription ? '4px' : '0'};
`;

const Description = styled.div`
  opacity: 0.9;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 12px;
  top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: calc(var(--radius) - 4px);
  border: none;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.15s ease;
  
  &:hover {
    opacity: 1;
    background: currentColor;
    color: hsl(var(--background));
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

export function Alert({
  type = 'info',
  message,
  description,
  closable = false,
  onClose,
  showIcon = true,
  icon,
  className,
  style,
  children,
}) {
  const [visible, setVisible] = React.useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  const IconComponent = icon || icons[type];
  const content = children || description;

  return (
    <AlertContainer $type={type} $closable={closable} className={className} style={style}>
      {showIcon && IconComponent && (
        <IconWrapper>
          <IconComponent />
        </IconWrapper>
      )}
      <Content>
        {message && <Message $hasDescription={!!content}>{message}</Message>}
        {content && <Description>{content}</Description>}
      </Content>
      {closable && (
        <CloseButton onClick={handleClose} aria-label="Close">
          <X />
        </CloseButton>
      )}
    </AlertContainer>
  );
}

// Export styled components for flexibility
export const AlertIcon = IconWrapper;
export const AlertContent = Content;
export const AlertTitle = Message;
export const AlertDescription = Description;
export const AlertWithIcon = Alert; // Alias

export default Alert;
