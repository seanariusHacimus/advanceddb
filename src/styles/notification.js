import styled from 'styled-components';

export const NotificationWidget = styled.div`
  position: relative;
  margin: 0 15px;
  
  .no-permissions {
    text-align: center;
  }
  .no-permissions h3{
    color: #FCFDFF
  }
  .ant-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    border-radius: 5px;
    border: 1px solid #888797;
    color: #BABAC1;
    background-color: #535263;
  }

  .ant-btn:hover{
    background-color: #6A6A78;
    color: #DCDBDF;
  }

  button svg {
    margin-right: 5px;
  }
  .bell-icon-parent {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .notifications-length {
    position: absolute;
    top: -4px;
    right: -5px;
    width: 15px;
    height: 15px;
    background-color: #E15488;
    border-radius: 50%;
    line-height: 15px;
    font-size: 8px;
    color: #fff;
    text-align: center;
  }
  .notification-icon {
    fill: #BEC2CD;
  }
  .notification-type-icon {
    min-width: 20px;
    max-width: 20px;
    margin-right: 4px;
    margin-left: 4px;
  }
  .notification-icon:hover,
  .notification-icon.active,
  #indicator:hover,
  .ant-popover-open {
    fill: var(--dark);
  }
  .action-group {
    display: flex;
    margin-top: 10px;

    & > button {
      margin-right: 10px;
      cursor: pointer;

      span {
        color: #fff;
      }
    }
    button:first-of-type {
      background-color: #4CAF50;
      color: #fff;
      border-color: #4CAF50;
    }
    button:last-of-type {
      background-color: #E91E63;
      color: #fff;
      border-color: #E91E63;
    }
  }
  #indicator {
    fill: none;
  }

  .active #indicator {
    fill: #E15488;
  }

  & .profile-popover {
    width: 305px;
  }

  & .ant-popover-arrow {
      border-top-color: var(--dark) !important;
      border-left-color: var(--dark) !important;
  }

  &>div {
      right: 40px;
      left: auto;
      top: -5px !important;
  }

  & .ant-popover-inner {
      padding: 15px;
      border-radius: 5px;
  }

  & .ant-popover-title {
      padding: 0 0 11px;
      border-bottom: 1px solid #72717F;
  }
  
  .custom-switch .ant-radio-button-wrapper {
    background: #7d7d8a;
    border-color: #666575;
  }
  .custom-switch .ant-radio-button-wrapper:first-of-type {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  .custom-switch .ant-radio-button-wrapper:last-of-type {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
    //background-color: none;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within {
    box-shadow: 0 0 0 1px rgb(255 255 255);
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
    background-color: transparent;
  }

  .custom-switch .notification-stats.active {
    background-color: var(--danger);
    border-color: var(--danger) !important;
    transition: 0.4s;
    box-shadow: 0 0 1px 1px rgb(255 255 255);
  }
  .custom-switch .notification-stats.active span {
    color: #fff;
    font-size: 12px;
    line-height: 24px;
  }
  .custom-switch .ant-radio-button-wrapper span {
    color: #BABAC1;
    font-size: 12px;
    line-height: 24px;
  }
  & .ant-popover-title h3 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      font-size: 15px;
      line-height: 1.35;
      font-weight: 700;
      margin-bottom: 0;
  }

  & .ant-popover-title h3 span {
    color: #fff;
  }

  & .ant-popover-title span {
      color: #CAC9CF;
      font-weight: 400;
  }

  & .ant-popover-inner-content {
      padding: 11px 0 0;
  }

  & .ant-popover-inner-content .icon {
      margin-right: 5px;
      width: 18px;
      height: 18px;
  }

  #notification-group {
    height: 40vh;
    overflow: auto;
  }

  .notification-item {
    display: flex;
    align-items: flex-start;
    padding-top: 13px;
    transition: 0.1s ease-in;
  }
  .notification-item.ant-popover-title:first-of-type {
    margin-top: -11px;
  }

  .notification-item h3 {
    font-size: 14px;
  }

  .notification-item:hover {
    background-color: #777685;
    padding: 13px 7px 11px;
    transition: 0.1s ease-in;
    border-radius: 4px;
  }

  .footer {
    margin-top: 13px;
  }
`;
