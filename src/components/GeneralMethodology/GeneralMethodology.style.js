import styled from "styled-components";

export const GeneralMethodologyContainer = styled.div`
  padding: 40px 0;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;

  .general-methodology-content {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 12px;
    padding: 48px;
    transition: all 0.2s ease;
    
    @media (max-width: 768px) {
      padding: 32px 24px;
    }
  }

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid hsl(var(--border));
    
    @media (max-width: 768px) {
      font-size: 28px;
      margin-bottom: 24px;
    }
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-top: 32px;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      font-size: 18px;
      margin-top: 24px;
    }
  }

  p {
    font-size: 15px;
    line-height: 1.7;
    color: hsl(var(--muted-foreground));
    margin-bottom: 20px;
    text-align: justify;
  }

  a {
    color: hsl(var(--primary));
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
      text-decoration: underline;
      color: hsl(var(--primary) / 0.8);
    }
  }

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    margin: 32px 0;
    border: 1px solid hsl(var(--border));
    
    @media (max-width: 768px) {
      margin: 24px 0;
    }
  }

  strong {
    font-weight: 600;
    color: hsl(var(--foreground));
  }
`;
