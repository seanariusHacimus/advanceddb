import styled from "styled-components";

export const StyledCountryReport = styled.div`
  padding: 40px 48px;
  min-height: 100vh;
  margin: 0 auto;
  max-width: 1400px;

  .header-section {
    margin-bottom: 40px;
    text-align: center;
  }

  .main-title {
    color: hsl(var(--primary));
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 12px;
    line-height: 1.2;
  }

  .subtitle {
    color: hsl(var(--muted-foreground));
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 0;
    line-height: 1.4;
  }

  .legend-section {
    margin-bottom: 32px;
    padding: 24px 32px;
    background: hsl(var(--card));
    border-radius: 12px;
    border: 1px solid hsl(var(--border));
    transition: all 0.2s ease;
  }

  .legend-title {
    font-weight: 600;
    font-size: 14px;
    color: hsl(var(--foreground));
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .legend-items {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid hsl(var(--border));

    &.pillar-1 {
      background-color: hsl(221 83% 53%);
    }

    &.pillar-2 {
      background-color: hsl(142 76% 36%);
    }

    &.pillar-3 {
      background-color: hsl(25 95% 53%);
    }
  }

  .legend-text {
    font-size: 14px;
    color: hsl(var(--muted-foreground));
    font-weight: 500;
    line-height: 1.4;
  }

  .topic-scores-section {
    margin-bottom: 40px;
    margin-top: 20px;
  }

  .topic-scores-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }

  .section-title {
    font-weight: 600;
    font-size: 20px;
    color: hsl(var(--foreground));
    margin-bottom: 0;
  }

  .scores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .score-card {
    background: hsl(var(--card));
    border-radius: 12px;
    padding: 24px 20px;
    text-align: center;
    transition: all 0.2s ease;
    border: 1px solid hsl(var(--border));
    min-height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      border-color: hsl(var(--primary));
    }
  }

  .score-card-title {
    color: hsl(var(--primary));
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 1.3;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pillar-label {
    color: hsl(var(--muted-foreground));
    font-size: 11px;
    font-weight: 500;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .score-value {
    font-size: 42px;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0;
    line-height: 1;
  }

  @media (max-width: 1200px) {
    .scores-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
  }

  @media (max-width: 768px) {
    padding: 24px 20px;

    .main-title {
      font-size: 28px;
    }

    .subtitle {
      font-size: 16px;
    }

    .scores-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .score-card {
      padding: 20px 15px;
      min-height: 140px;
    }

    .score-value {
      font-size: 32px;
    }

    .legend-items {
      flex-direction: column;
      gap: 12px;
    }

    .legend-section {
      padding: 20px 24px;
    }
  }

  @media (max-width: 480px) {
    .scores-grid {
      grid-template-columns: 1fr;
    }

    .main-title {
      font-size: 24px;
    }
  }
`;
