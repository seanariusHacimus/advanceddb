import styled from "styled-components";
import { Link } from "react-router-dom";

export const Sidebar = styled.aside`
  width: 256px;
  min-width: 256px;
  max-width: 256px;
  height: 100vh;
  max-height: 100vh;
  border-right: 1px solid hsl(var(--border));
  background: hsl(var(--card));
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1050;
  overflow: hidden;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  @media (max-width: 991px) {
    &.collapsed {
      width: 0;
      min-width: 0;
      max-width: 0;
      border-right: none;
    }
  }
`;

export const SidebarHeader = styled.div`
  height: 65px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  background-color: hsl(var(--card));
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 1px solid hsl(var(--border));
  transition: background-color 0.3s ease, border-color 0.3s ease;

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  img {
    height: 42px;
  }
`;

export const SidebarContent = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.3);
    border-radius: 3px;
    transition: background-color 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground) / 0.5);
  }
`;

export const SidebarFooter = styled.div`
  padding: 16px 12px;
  border-top: 1px solid hsl(var(--border));
  background: hsl(var(--card));
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
`;

export const SidebarDivider = styled.div`
  height: 1px;
  background: hsl(var(--border));
  margin: 12px 0;
  transition: background-color 0.3s ease;
`;

export const SidebarNavItem = styled.div`
  position: relative;
`;

export const SidebarNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: calc(var(--radius) - 2px);
  font-size: 14px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  min-height: 40px;
  position: relative;

  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
    
    .menu-icon {
      fill: hsl(var(--accent-foreground));
      color: hsl(var(--accent-foreground));
    }
  }

  &.active {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    font-weight: 500;

    .menu-icon {
      fill: hsl(var(--primary-foreground));
      color: hsl(var(--primary-foreground));
    }

    svg {
      fill: hsl(var(--primary-foreground));
      color: hsl(var(--primary-foreground));
    }

    img.menu-icon {
      opacity: 1;
    }
    
    &.stroke .menu-icon {
      stroke: hsl(var(--primary-foreground));
    }
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &.is-assigned {
    background: hsl(var(--accent) / 0.5);
    border-radius: calc(var(--radius) - 2px);

    .menu-icon {
      fill: hsl(var(--foreground));
      color: hsl(var(--foreground));
    }

    &:hover {
      background: hsl(var(--accent));
    }

    &.active {
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));

      .menu-icon {
        fill: hsl(var(--primary-foreground));
        color: hsl(var(--primary-foreground));
      }
    }
  }

  .menu-icon {
    width: 20px;
    height: 20px;
    min-width: 20px;
    flex-shrink: 0;
    fill: hsl(var(--muted-foreground));
    color: hsl(var(--muted-foreground));
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;

    &.anticon {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    &.stroke {
      stroke: hsl(var(--muted-foreground));
      fill: none;
    }
  }

  img.menu-icon {
    width: 20px;
    height: 20px;
    min-width: 20px;
    object-fit: contain;
    display: block;
  }

  svg.menu-icon {
    width: 20px;
    height: 20px;
    min-width: 20px;
    display: block;
  }

  .active .menu-icon.stroke {
    stroke: hsl(var(--primary-foreground));
  }

  .more-icons {
    height: 8px;
    width: 8px;
    background: hsl(var(--destructive) / 0.6);
    border-radius: 50%;
    position: absolute;
    transition: background-color 0.3s ease;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

