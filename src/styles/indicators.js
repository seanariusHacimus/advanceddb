import styled from 'styled-components';

export const IndicatorsPage = styled.div`

  .ant-modal-mask {
    z-index: 1080;
  }

  .ant-modal {
    width: 80%;
    max-width: 720px;
  }

  .ant-modal-wrap {
    z-index: 1080;
  }

  .title {
    font-size: 24px;
    font-weight: 400;
    line-height: 30px;
    color: #252A32;
    margin-bottom: 10px;
  }

  .sub-title {
    color: #7E829D;
    font-weight: 400;
  }

  .switch {
    padding: 10px 12px;
    background: #F0F2F6;
    height: 41px;
    border-radius: 5px;
    color: #7E829D;
  }

  .ant-switch {
    width: 34px;
    background-color: #CDD5DE;
  }

  .ant-switch-checked {
    background-color: var(--blue);
  }

  .switch-item-title {
    color: var(--text);
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
  }
  
  .switch.checked {
    background: #E7EAF0;
    color: var(--text);
  }
`;