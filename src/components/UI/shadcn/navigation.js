import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  height: 100%;
  background: hsl(var(--background));
  padding: 0;
  gap: 0;
  
  &.horizontal {
    flex-direction: row;
  }
  
  &.vertical {
    flex-direction: column;
    align-items: stretch;
    border-bottom: 1px solid hsl(var(--border));
  }
`;

const NavItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  color: hsl(var(--muted-foreground));
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;

  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  &:hover {
    color: hsl(var(--foreground));
    background: hsl(var(--accent));
  }

  &.active {
    color: hsl(var(--primary));
    font-weight: 600;
    background: hsl(var(--accent) / 0.5);
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: hsl(var(--primary));
      border-radius: 2px 2px 0 0;
    }
  }

  &.vertical {
    padding: var(--spacing-2, 0.5rem) var(--spacing-4, 1rem);
    height: auto;
    border-radius: var(--radius);

    &.active::after {
      display: none;
    }

    &.active {
      background: hsl(var(--accent));
    }
  }

  ${props => props.$minWidth && `min-width: ${props.$minWidth}px;`}
`;

const NavSpacer = styled.div`
  flex: 1;
`;

export const Navigation = ({ 
  items = [], 
  selectedKeys = [], 
  mode = 'horizontal',
  className = '',
  style = {},
  id,
  children
}) => {
  return (
    <NavContainer 
      className={`${mode} ${className}`} 
      style={style}
      id={id}
    >
      {items.map((item) => {
        const isActive = selectedKeys.includes(item.key);
        return (
          <NavItem
            key={item.key}
            className={`${isActive ? 'active' : ''} ${mode}`}
            style={item.style}
            $minWidth={item.minWidth}
          >
            {item.label}
          </NavItem>
        );
      })}
      {children}
    </NavContainer>
  );
};

export const NavigationItem = styled(NavItem)``;
export const NavigationSpacer = NavSpacer;

export default Navigation;

