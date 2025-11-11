import React from 'react';
import styled from 'styled-components';
import { Inbox } from 'lucide-react';

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  text-align: center;
  color: hsl(var(--muted-foreground));
`;

const EmptyIcon = styled.div`
  margin-bottom: 16px;
  opacity: 0.5;
  
  svg {
    width: 64px;
    height: 64px;
    color: hsl(var(--muted-foreground));
  }
`;

const EmptyDescription = styled.div`
  font-size: 14px;
  color: hsl(var(--muted-foreground));
  margin-top: 8px;
`;

const SimpleImage = styled.div`
  width: 64px;
  height: 41px;
  margin: 0 auto 16px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.5;
`;

export const Empty = ({ 
  description = 'No data', 
  image, 
  children,
  className = '',
  ...props 
}) => {
  const isSimpleImage = image === Empty.PRESENTED_IMAGE_SIMPLE;
  
  return (
    <EmptyContainer className={className} {...props}>
      {isSimpleImage ? (
        <SimpleImage />
      ) : image ? (
        <EmptyIcon>
          {typeof image === 'string' ? (
            <img src={image} alt="Empty" style={{ width: 64, height: 64 }} />
          ) : (
            image
          )}
        </EmptyIcon>
      ) : (
        <EmptyIcon>
          <Inbox />
        </EmptyIcon>
      )}
      <EmptyDescription>
        {description}
      </EmptyDescription>
      {children}
    </EmptyContainer>
  );
};

// Static property for simple image
Empty.PRESENTED_IMAGE_SIMPLE = 'SIMPLE';

export default Empty;

