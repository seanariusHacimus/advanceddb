import styled from 'styled-components';

export const Input = styled.input`
  display: flex;
  height: 40px;
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--input));
  background: hsl(var(--background));
  padding: 8px 12px;
  font-size: 14px;
  color: hsl(var(--foreground));
  transition: all 0.2s ease;
  
  &::placeholder {
    color: hsl(var(--muted-foreground));
  }
  
  &:hover:not(:disabled) {
    border-color: hsl(var(--ring) / 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  &[type="file"] {
    padding: 6px 12px;
    cursor: pointer;
  }
`;

export const Textarea = styled.textarea`
  display: flex;
  min-height: 80px;
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--input));
  background: hsl(var(--background));
  padding: 8px 12px;
  font-size: 14px;
  color: hsl(var(--foreground));
  transition: all 0.2s ease;
  resize: vertical;
  font-family: inherit;
  
  &::placeholder {
    color: hsl(var(--muted-foreground));
  }
  
  &:hover:not(:disabled) {
    border-color: hsl(var(--ring) / 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: hsl(var(--foreground));
  margin-bottom: 8px;
  transition: color 0.3s ease;
  
  &[data-required="true"]::after {
    content: " *";
    color: hsl(var(--destructive));
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormError = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: hsl(var(--destructive));
  transition: color 0.3s ease;
`;

export const FormDescription = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  transition: color 0.3s ease;
`;

// Input with Icon wrapper
export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  ${Input} {
    ${props => props.hasIcon && props.iconPosition === 'left' && 'padding-left: 40px;'}
    ${props => props.hasIcon && props.iconPosition === 'right' && 'padding-right: 40px;'}
  }
`;

export const InputIcon = styled.div`
  position: absolute;
  ${props => props.position === 'left' ? 'left: 12px;' : 'right: 12px;'}
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsl(var(--muted-foreground));
  transition: color 0.3s ease;
  pointer-events: none;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

