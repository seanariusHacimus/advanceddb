import styled from "styled-components";

export default styled.div`
  padding: 40px 0;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 24px 0;
  }

  #dashboard-radial-bar-chart {
    svg:focus {
      outline: none;
    }
  }

  .ant-row {
    width: 100%;
  }

  .ant-row > div {
    display: flex;
    height: 100%;
  }

  .chart-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .statistic {
    flex: 1;
  }

  .statistic h2 {
    font-size: 30px;
    font-weight: 700;
    line-height: 1.35;
    color: hsl(var(--foreground));
    margin: 0;
    transition: color 0.3s ease;
  }

  .statistic h5 {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: hsl(var(--muted-foreground));
    margin: 0;
    transition: color 0.3s ease;
  }

  .recharts-dot.recharts-area-dot {
    fill: hsl(var(--primary));
    fill-opacity: 1;
  }

  .progress {
    cursor: pointer;
  }

  .dashboard-header {
    @media screen and (max-width: 768px) {
      padding: 0 20px !important;
    }
  }

  @media screen and (max-width: 992px) {
    padding: 20px 0;
  }

  @media screen and (max-width: 768px) {
    padding: 16px 0;
  }
`;
