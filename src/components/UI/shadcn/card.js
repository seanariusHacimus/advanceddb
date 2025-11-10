import styled from "styled-components";

export const Card = styled.div`
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--card));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

export const CardHeader = styled.div`
  padding: 16px 20px 0 20px;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: hsl(var(--card-foreground));
  transition: color 0.3s ease;
`;

export const CardContent = styled.div`
  padding: 16px 20px;
  color: hsl(var(--card-foreground));
  transition: color 0.3s ease;
`;

export const CardFooter = styled.div`
  border-top: 1px solid hsl(var(--border));
  padding: 12px 20px;
  background: hsl(var(--muted));
  transition: background-color 0.3s ease, border-color 0.3s ease;

  a.content {
    display: block;
    text-decoration: none;
    color: hsl(var(--card-foreground));
    transition: color 0.3s ease;
    
    &:hover {
      color: hsl(var(--primary));
    }
  }
`;


