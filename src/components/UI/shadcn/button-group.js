import React from 'react';
import styled from 'styled-components';

export const ButtonGroup = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius);
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  padding: 2px;
  gap: 2px;
  
  &.vertical {
    flex-direction: column;
  }
`;

export const ButtonGroupItem = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: calc(var(--radius) - 2px);
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: transparent;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
  outline: none;

  &:hover:not(:disabled) {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  &.active {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    box-shadow: 0 1px 2px hsl(var(--foreground) / 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0 20px;
  padding: 0;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PageHeaderTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
  line-height: 1.2;
`;

export const PageHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    justify-content: flex-start;
  }
`;

export default ButtonGroup;

