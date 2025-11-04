import styled from "styled-components";

export const StyledCountryReport = styled.div`
  padding: 40px 20px;
  background-color: #ffffff;
  min-height: 100vh;
  margin: 0 auto;

  .header-section {
    margin-bottom: 50px;
    text-align: center;
  }

  .main-title {
    color: #527bdd;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 12px;
    font-family: "Montserrat", sans-serif;
    line-height: 1.2;
  }

  .subtitle {
    color: #717a8f;
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 0;
    line-height: 1.4;
  }

  .legend-section {
    margin-bottom: 40px;
    padding: 25px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e4ed;
  }

  .legend-title {
    font-weight: 700;
    font-size: 18px;
    color: #0d0c21;
    margin-bottom: 20px;
    letter-spacing: 0.5px;
  }

  .legend-items {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .legend-color {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &.pillar-1 {
      background-color: #ff8c00;
    }

    &.pillar-2 {
      background-color: #ffd700;
    }

    &.pillar-3 {
      background-color: #daa520;
    }
  }

  .legend-text {
    font-size: 16px;
    color: #252a32;
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
    margin-bottom: 20px;
  }

  .section-title {
    font-weight: 700;
    font-size: 20px;
    color: #0d0c21;
    margin-bottom: 25px;
    letter-spacing: 0.5px;
  }

  .scores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
  }

  .score-card {
    background: #fff;
    border-radius: 12px;
    padding: 24px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-align: center;
    transition: all 0.3s ease;
    border: 1px solid #e2e4ed;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      border-color: #527bdd;
    }
  }

  .score-card-title {
    color: #527bdd;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 1.3;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .pillar-label {
    color: #717a8f;
    font-size: 11px;
    font-weight: 400;
    margin-bottom: 16px;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .score-value {
    font-size: 42px;
    font-weight: 700;
    color: #0d0c21;
    margin: 0;
    line-height: 1;
    font-family: "Montserrat", sans-serif;
  }

  @media (max-width: 1200px) {
    .scores-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    padding: 20px 15px;

    .main-title {
      font-size: 28px;
    }

    .subtitle {
      font-size: 16px;
    }

    .scores-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
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
      gap: 15px;
    }

    .legend-section {
      padding: 20px;
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
