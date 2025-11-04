import styled from "styled-components";

export const StyledTopicDetails = styled.div`
  padding: 40px 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
  margin: 0 auto;

  .header-section {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #fff;
    border: 1px solid #e2e4ed;
    border-radius: 8px;
    color: #527bdd;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f3f4f9;
      border-color: #527bdd;
    }
  }

  .main-title {
    color: #527bdd;
    font-size: 32px;
    font-weight: 700;
    margin: 0;
    font-family: "Montserrat", sans-serif;
    line-height: 1.2;
  }

  .subtitle {
    color: #717a8f;
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    line-height: 1.4;
  }

  .topic-section {
    background: #fff;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e4ed;
  }

  .topic-title {
    color: #527bdd;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
    font-family: "Montserrat", sans-serif;
  }

  .chart-section {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    gap: 24px;
    background: #f8f9fa;
    border-radius: 12px;
    border: 1px solid #e2e4ed;

    p {
      margin-top: 20px;
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
    margin-bottom: 30px;
    background: #f3f4f9;
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
    color: #717a8f;

    &.active {
      background: #717a8f;
      color: #fff;
    }

    &:hover:not(.active) {
      background: #e5e7ef;
      color: #252a32;
    }
  }

  .category-section {
    background: #fff;
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e4ed;
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .category-title {
    color: #0d0c21;
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .category-score {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .score-text {
    color: #252a32;
    font-size: 16px;
    font-weight: 600;
  }

  .progress-container {
    width: 200px;
  }

  .subcategory-item {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
    border: 1px solid #e2e4ed;
    transition: all 0.2s ease;

    &:hover {
      background: #f3f4f9;
      border-color: #527bdd;
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
    color: #252a32;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .subcategory-score {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .subcategory-score-text {
    color: #252a32;
    font-size: 14px;
    font-weight: 600;
  }

  .subcategory-progress {
    width: 150px;
  }

  .expand-icon {
    color: #717a8f;
    font-size: 16px;
    transition: transform 0.2s ease;
  }

  .indicators-list {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e2e4ed;
  }

  .indicator-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }

  .indicator-name {
    color: #252a32;
    font-size: 14px;
    font-weight: 500;
  }

  .indicator-score {
    color: #527bdd;
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
