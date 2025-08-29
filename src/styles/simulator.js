import styled from 'styled-components';

export default styled.div`
  .progress-sub-title {
    margin-top: 10px;
  }
  .action-group {
    margin-left: auto;
  }
  .action-group button {
    display: flex;
    align-items: center;
    margin-left: 10px;
    background-color: transparent;
    border: 1px solid #D6D9E4;
    padding: 6px 10px;

    &:hover {
      background-color: #F3F3F4;
    }

    img {
      margin-right: 5px;
    }
  }

  #bar-chart-wrapper {
    overflow: auto;
  }
  
  #bar-chart-wrapper::-webkit-scrollbar {
    /* width: 1px; */
    
  }
  #bar-chart-wrapper::-webkit-scrollbar-track {
    background-color: red;
    color: red;
  }

  .rank-item-title {
    color: var(--text);
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
  }
  
  .rank-item.checked {
    background: #D7E0F8;
    color: var(--text);
    min-height: 30px;
  }

  .score {
    color: #C29009;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    margin-top: 5px;
  }

  .rank-item-subtitle {
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
  }

  .ant-input-number-handler-wrap {
    display: none;
  }
  .rank-item {
    padding: 3px 5px;
    border-radius: 2px;
  }
  .rank-item.form {
    margin-bottom: 2px;
  }

  .ant-input-number-sm input {
    height: 24px;
    text-align: right;
    padding: 0 3px;
  }

  .form-input[type='number'] {
    -moz-appearance:textfield;
  }

  .form-input::-webkit-outer-spin-button,
  .form-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }

  .form-input {
    width: 60px;
    text-align: right;
    padding: 0 3px;
  }

  text.recharts-text.recharts-label {
    transform: translateY(7px);
    font-size: 12px;
  }
`;

