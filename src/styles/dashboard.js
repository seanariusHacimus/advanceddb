import styled from "styled-components";

export default styled.div`
  #dashboard-radial-bar-chart {
    svg:focus {
      outline: none;
    }
  }
  box-shadow: none !important;
  margin-top: -35px !important;

  .ant-row > div {
    display: flex;
  }
  .inner-block {
    padding: 20px;
    background: #fff;
    width: 100%;
    /* height: 100%; */
    border-radius: 10px;
    box-shadow: var(--box-shadow);

    &.col-left {
      margin-left: 0;
      margin-right: 16px;
    }
    &.col-right {
      margin-right: 0;
      margin-left: 16px;
    }
    /* &:first-of-type {
      margin-left: 0;
      margin-right: 16px;
    }
    &:last-of-type {
      margin-right: 0;
      margin-left: 16px;
    } */
  }

  .statistic-row {
    border-bottom: 1px solid var(--border-grey);
  }
  /* .col-left {
    border-right: 1px solid var(--border-grey);
    padding: 0 30px 30px 0;
  }
  .col-right {
    padding: 0 0 30px 30px;
  }
  .col-right.pt-30,
  .col-left.pt-30{
    padding-top: 30px;
  } */
  .chart-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .customize-btn {
    height: 34px;
    width: auto;
    margin-left: auto;
    background: #fcfdff;
    border: 1px solid #d6d9e4;
    border-radius: 5px;
    font-weight: 500;
    font-size: 12px;
    line-height: 17px;
    color: #828a9d;
    padding: 0 10px;

    &:hover {
      background: #f3f3f4;
      color: #656f87;
      border-color: #8f96a5;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #f3f4f9;
    border-radius: 8px;
    overflow: hidden;
    width: 100% !important;
    min-width: 200px;
    min-height: 200px;
  }

  .info .ant-card-body {
    display: flex;
    align-items: center;
    margin-top: auto;
    margin-bottom: auto;
    justify-content: space-between;
    padding: 10px 12px;
  }

  .info .ant-card-actions {
    background-color: #e5e7ef;
  }

  .info .ant-card-actions > li,
  .info .ant-card-actions > li:hover {
    color: #394f85;
  }

  .info .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    color: #394f85;
    flex-direction: column;

    svg {
      vertical-align: middle;
    }
    .text-center {
      margin-top: -5px;
    }
    small {
      font-size: 10px;
    }
  }
  .info .content:hover {
    color: #394f85;
  }

  .statistic {
    flex: 1;
  }

  .statistic-icon {
    display: inline-block;
    width: 30px;
    height: 6px;
    background-color: #dfe2ec;
    border-radius: 19px;
  }

  .statistic h2 {
    font-size: 30px;
    font-weight: 700;
    line-height: 1.35;
    color: var(--title);
    margin: 0;
  }
  .statistic.blue h2 {
    color: #394f85;
  }

  .statistic h5 {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: #595968;
    margin: 0;
  }

  .statistic.blue h5 {
    color: #394f85;
  }

  .recharts-dot.recharts-area-dot {
    fill: #527bdd;
    fill-opacity: 1;
  }

  .has-right-divider {
    border-right: 1px solid var(--border-grey);
    padding-right: 20px;
  }
  .has-left-divider {
    /* border-left: 1px solid var(--border-grey); */
    padding-left: 20px;
  }

  .progress {
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    .inner-block {
      &.col-left {
        margin-right: 0;
      }
      &.col-right {
        margin-top: 20px;
        margin-left: 0;
      }
    }

    .has-right-divider {
      border-right: none;
      padding-right: 0;
    }
    .has-left-divide {
      padding-left: 0;
    }
  }
`;
