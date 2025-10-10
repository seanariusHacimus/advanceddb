import styled from 'styled-components';
import { MeetingMinutesEmpty } from './startBusiness';

export default styled.div`
  .sub-title {
    margin-bottom: 12px;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #717A8F;
  }
  .graph-wrapper {
    margin-bottom: 35px;
    
    &.empty {
      opacity: 0.1;
    }
    .ant-col {
      padding: 15px;
    }
    .col-1, .col-2 {
      padding-top: 0;
      margin-top: 16px;
      display: flex;
    }

    .inner-block {
      padding: 20px;
      background: #fff;
      width: 100%;
      border-radius: 10px;
      box-shadow: var(--box-shadow);
    }
  }
  .country-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 7px;
    margin-right: 6px;
    background: #FAFBFC;
    border: 1px dashed #C5C9D2;
    box-sizing: border-box;
    border-radius: 18px;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #717A8F;

    .color {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: ${(props) => props.color || 'yellow'};
      border-radius: 50%;
      margin-right: 4px;
    }
    button {
      width: 13px;
      height: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 4px;
      border: none;
      background: #BEC2CD;
      border-radius: 50%;
      font-size: 8px;
      cursor: pointer;
    }
  }
  .border-bottom {
    border-bottom: 1px solid var(--border-grey);
  }
  .border-right {
    border-right: 1px solid var(--border-grey);
  }
  #search {
    margin-left: 22px;
    align-items: center;
    display: flex;
    border: none;
  }
  .filter-btn {
    justify-content: flex-end;
    margin-top: 15px;
  }
  .btn-group {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px;

    & svg {
      margin-right: 4px;
      vertical-align: text-bottom;
    }
  }

  @media (max-width: 991px) {
    .border-right {
      border-right: none;
    }
    .col-3 {
      border-bottom: 1px solid var(--border-grey);
    }
  }
  @media (max-width: 768px) {
    .filter-btn {
      justify-content: center;
    }
  }
`;

export const EmptyData = styled(MeetingMinutesEmpty)`border-bottom
  #empty-data-wrapper {
    top: 50vh;
  }

  @media (max-width: 768px) {

    #empty-data-wrapper {
      top: 50vh;
    }
  }
  @media (max-width: 520px) {
    #empty-data-wrapper {
      top: 50vh;
    }
  }
  @media (max-width: 450px) {
    .ant-table-wrapper {
      display: none;
    }
    #empty-data-wrapper {
      top: 50vh;
    }
    #arrow-icon {
      top: 50vh;
    }
  }
`;
