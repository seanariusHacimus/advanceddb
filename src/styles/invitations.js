import styled from 'styled-components';

export default styled.div`
  .ant-result-title {
    font-size: 21px;
    color: var(--text);
  }

  .ant-tag {
    width: 100%;
    border-radius: 4px;
    text-align: center;
    padding: 5px 10px;
  }

  .canceled {
    background: #FFC6CC;
    color: #9C353D;
    border: none;
  }
  .expired {
    background: #F8DD96 ;
    color: #886710;
    border: none;
  }
  .confirmed {
    background: #C4F5E9;
    color: #0C8A6B;
    border: none;
  }
  .created {
    background: #ECEEF4;
    color: #828A9D;
    border: none;
  }
`;