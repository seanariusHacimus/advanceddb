import React from 'react';
import styled from 'styled-components';
import { GripVertical } from 'lucide-react';
import { Avatar, Badge } from './index';

// Sub-Action Card Container
export const SubActionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  transition: all 0.15s ease;
  cursor: ${props => props.draggable ? 'move' : 'default'};
  position: relative;

  &:hover {
    background: hsl(var(--accent));
    border-color: hsl(var(--primary) / 0.5);
    box-shadow: 0 2px 4px hsl(var(--primary) / 0.1);
  }

  &.dragging {
    opacity: 0.5;
    box-shadow: 0 4px 8px hsl(var(--primary) / 0.2);
  }

  /* Drop indicators */
  &.drop-over-upward::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: hsl(var(--primary));
    border-radius: 2px;
  }

  &.drop-over-downward::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: hsl(var(--primary));
    border-radius: 2px;
  }
`;

// Drag Handle
export const DragHandle = styled.div`
  display: flex;
  align-items: center;
  color: hsl(var(--muted-foreground));
  cursor: move;
  transition: color 0.15s ease;
  flex-shrink: 0;

  &:hover {
    color: hsl(var(--primary));
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

// Sub-Action Content
export const SubActionContent = styled.div`
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(200px, 2fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(150px, 1.5fr) minmax(120px, 1fr);
  gap: 16px;
  align-items: center;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

// Sub-Action Name Column
export const SubActionName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  .icons-set {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .item-title {
    font-size: 14px;
    font-weight: 500;
    color: hsl(var(--foreground));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: ${props => props.clickable ? 'pointer' : 'default'};
    transition: color 0.15s ease;

    &:hover {
      color: ${props => props.clickable ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'};
    }
  }
`;

// Sub-Action Date Column
export const SubActionDate = styled.div`
  font-size: 13px;
  color: hsl(var(--muted-foreground));
  white-space: nowrap;
  transition: color 0.3s ease;

  @media (max-width: 1200px) {
    font-size: 12px;
  }
`;

// Sub-Action Responsible Column
export const SubActionResponsible = styled.div`
  display: flex;
  align-items: center;
  gap: -8px;

  .avatar-group {
    display: flex;
    align-items: center;
    
    > * {
      margin-left: -8px;
      border: 2px solid hsl(var(--card));
      transition: transform 0.15s ease, border-color 0.3s ease;
      
      &:first-child {
        margin-left: 0;
      }

      &:hover {
        transform: translateY(-2px);
        z-index: 1;
      }
    }
  }

  .more-count {
    margin-left: -8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: hsl(var(--muted));
    border: 2px solid hsl(var(--card));
    font-size: 11px;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    transition: all 0.15s ease;

    &:hover {
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      transform: translateY(-2px);
      z-index: 1;
    }
  }
`;

// Sub-Action Status Column
export const SubActionStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

// Sub-Action Actions Column
export const SubActionActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
`;

// Sub-Actions Container
export const SubActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
`;

// Add Sub-Action Button Container
export const AddSubActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
`;

// Component wrapper with drag and drop
export function SubActionCardItem({
  subAction,
  index,
  parentIndex,
  onViewAction,
  dragHandleProps,
  isDragging,
  dropClassName,
  status,
  actions,
  t
}) {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <SubActionCard
      draggable
      className={`${isDragging ? 'dragging' : ''} ${dropClassName || ''}`}
    >
      {dragHandleProps && (
        <DragHandle {...dragHandleProps}>
          <GripVertical />
        </DragHandle>
      )}
      
      <SubActionContent>
        {/* Name Column */}
        <SubActionName clickable={!!onViewAction}>
          <div className="icons-set">
            {subAction.attachments?.length > 0 && (
              <span>📎</span>
            )}
            <span 
              className="item-title"
              onClick={() => onViewAction && onViewAction(subAction)}
            >
              {parentIndex + 1}.{index + 1}. {subAction.name}
            </span>
          </div>
        </SubActionName>

        {/* Start Date Column */}
        <SubActionDate>
          {subAction.start_at ? new Date(subAction.start_at).toLocaleDateString() : '-'}
        </SubActionDate>

        {/* End Date Column */}
        <SubActionDate>
          {subAction.end_at ? new Date(subAction.end_at).toLocaleDateString() : '-'}
        </SubActionDate>

        {/* Responsible Column */}
        <SubActionResponsible>
          {subAction.responsive_accounts?.length > 0 ? (
            <div className="avatar-group">
              {subAction.responsive_accounts.slice(0, 3).map((account, idx) => (
                <Avatar
                  key={account.id}
                  size="sm"
                  fallback={getInitials(`${account.first_name} ${account.last_name}`)}
                  style={{ zIndex: 3 - idx }}
                />
              ))}
              {subAction.responsive_accounts.length > 3 && (
                <div className="more-count">
                  +{subAction.responsive_accounts.length - 3}
                </div>
              )}
            </div>
          ) : (
            <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
              {t?.('Not assigned') || 'Not assigned'}
            </span>
          )}
        </SubActionResponsible>

        {/* Status Column */}
        <SubActionStatus>
          {status}
        </SubActionStatus>
      </SubActionContent>

      {/* Actions Column */}
      <SubActionActions>
        {actions}
      </SubActionActions>
    </SubActionCard>
  );
}

