import styled from "styled-components";

export const StyledTopicDetails = styled.div`
  padding: 40px 48px;
  min-height: 100vh;
  margin: 0 auto;
  max-width: 1400px;

  .header-section {
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 8px;
    color: hsl(var(--primary));
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: hsl(var(--accent));
      border-color: hsl(var(--primary));
    }
  }

  .main-title {
    color: hsl(var(--primary));
    font-size: 32px;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
  }

  .subtitle {
    color: hsl(var(--muted-foreground));
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    line-height: 1.4;
  }

  .topic-section {
    background: hsl(var(--card));
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 24px;
    border: 1px solid hsl(var(--border));
    transition: all 0.2s ease;
  }

  .topic-title {
    color: hsl(var(--foreground));
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .chart-section {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 24px;
    gap: 24px;
    background: hsl(var(--muted) / 0.3);
    border-radius: 12px;
    border: 1px solid hsl(var(--border));

    p {
      margin-top: 16px;
      color: hsl(var(--muted-foreground));
    }

    & > div:first-of-type {
      flex: 1;
    }

    .topic-description {
      max-width: 800px;
    }
  }

  .pillar-filter {
    display: flex;
    gap: 0;
    margin-bottom: 24px;
    background: hsl(var(--muted) / 0.5);
    border-radius: 8px;
    padding: 4px;
  }

  .filter-item {
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s ease;
    color: hsl(var(--muted-foreground));

    &.active {
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
    }

    &:hover:not(.active) {
      background: hsl(var(--accent));
      color: hsl(var(--foreground));
    }
  }

  .category-section {
    background: hsl(var(--card));
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
    border: 1px solid hsl(var(--border));
    transition: all 0.2s ease;
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .category-title {
    color: hsl(var(--foreground));
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .category-score {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .score-text {
    color: hsl(var(--foreground));
    font-size: 16px;
    font-weight: 600;
  }

  .progress-container {
    width: 200px;
  }

  .subcategory-item {
    background: hsl(var(--muted) / 0.3);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 12px;
    border: 1px solid hsl(var(--border));
    transition: all 0.2s ease;

    &:hover {
      background: hsl(var(--muted) / 0.5);
      border-color: hsl(var(--primary));
    }
  }

  .subcategory-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }

  .subcategory-title {
    color: hsl(var(--foreground));
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .subcategory-score {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .subcategory-score-text {
    color: hsl(var(--foreground));
    font-size: 14px;
    font-weight: 600;
  }

  .subcategory-progress {
    width: 150px;
  }

  .expand-icon {
    color: hsl(var(--muted-foreground));
    font-size: 16px;
    transition: transform 0.2s ease;
  }

  .indicators-list {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid hsl(var(--border));
  }

  .indicator-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid hsl(var(--border) / 0.5);

    &:last-child {
      border-bottom: none;
    }
  }

  .indicator-name {
    color: hsl(var(--foreground));
    font-size: 14px;
    font-weight: 500;
  }

  .indicator-score {
    color: hsl(var(--primary));
    font-size: 14px;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 20px 15px;

    .header-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }

    .main-title {
      font-size: 24px;
    }

    .topic-title {
      font-size: 22px;
    }

    .chart-section {
      padding: 15px;
    }

    .pillar-filter {
      flex-direction: column;
    }

    .category-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }

    .subcategory-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .subcategory-score {
      width: 100%;
      justify-content: space-between;
    }
  }
`;
