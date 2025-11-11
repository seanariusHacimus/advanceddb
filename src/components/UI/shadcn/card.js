import styled from 'styled-components';

export const Card = styled.div`
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  box-shadow: 0 1px 3px hsl(var(--foreground) / 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 12px hsl(var(--foreground) / 0.08);
  }
`;

export const CardHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid hsl(var(--border));
  flex-shrink: 0;
`;

export const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
  line-height: 1.3;
`;

export const CardDescription = styled.p`
  font-size: 14px;
  color: hsl(var(--muted-foreground));
  margin: 4px 0 0;
  line-height: 1.4;
`;

export const CardContent = styled.div`
  padding: 20px;
  flex: 1;
  overflow: auto;

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

export const CardFooter = styled.div`
  padding: 12px 20px;
  border-top: 1px solid hsl(var(--border));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
`;

// Stat Card специально для статистики
export const StatCard = styled(Card)``;

export const StatCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

export default Card;
