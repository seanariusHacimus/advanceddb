import styled from 'styled-components';

export const ProfilePage = styled.div`
  max-width: 680px;
  margin: auto !important;

  .btn-group {
    display: flex;
    align-items: center;
    justify-content: row;
    margin-left: auto;
  }
  .edit-btn {
    height: 34px;
    padding: 8.5px 10px;
    background: #FCFDFF;
    border: 1px solid #D6D9E4;
    border-radius: 5px;
    color: #828A9D;
  }
  .small {
    margin-left: 12px;
    display: flex;
    align-items: center;

    img {
      margin-right: 5px;
    }
  }
  .profile-img {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 24px;

    input {
      display: none;
    }
    .user-avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background-size: cover !important;
    }
    .user-name {
      margin-left: 16px;
    }
    .title {
      margin-bottom: 8px;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 135%;
      color: #0D0C21;
    }
    .sub-title {
      font-weight: 500;
      font-size: 12px;
      line-height: 135%;
      text-transform: uppercase;
      color: #8B8EA0;
    }
  }

  .section-title {
    margin-bottom: 21px;
    font-weight: 500;
    font-size: 17px;
    line-height: 21px;
  }

  .info-wrapper {
    margin-bottom: 15px;
    color: var(--text);
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
  }
  
  .label {
    margin-left: 8.5px;
    margin-right: 6px;
    margin-bottom: 0;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: var(--text-light);
  }

  /* -------- NOtification settings --------- */
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

  .ant-divider-horizontal {
    margin: 18px 0;
  }
`;



export const ProfileEditPage = styled(ProfilePage)`
    .profile-img {
      width: 90px;
      border-radius: 50%;

      &::after {
        content: '';
        width: 90px;
        height: 90px;
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)), url(.png);
      }

      #camera-icon{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
      }
    }
    .dynamic-input {
      max-width: 420px;
    }

    .input-icon {
      /* position: absolute; */
      right: -20px;
      width: 17px;
      height: 17px;
      top: 18px;
    }
    .input-msg {
      font-size: 12px;
      line-height: 15px;
      color: #F181AB;
      margin-top: 6px;
    }
`;

export const ProfileNotification = styled.div`
  & .profile-popover {
    width: 206px;
  }

  & .ant-popover-arrow {
      border-top-color: var(--dark) !important;
      border-left-color: var(--dark) !important;
  }

  .profile-img {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
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

  & .ant-popover-title h3 {
      color: #fff;
      font-size: 15px;
      line-height: 1.35;
      font-weight: 700;
      margin-bottom: 0;
  }

  & .ant-popover-title span {
      color: #CAC9CF;
      font-weight: 400;
  }

  & .ant-popover-inner-content {
      padding: 11px 0 0;
  }

  & .ant-popover-inner-content>div {
      display: flex;
      flex-direction: column;
  }

  & .ant-popover-inner-content>div>* {
      margin: 0px 0 14px;
      color: #FCFDFF;
      cursor: pointer;
  }

  & .ant-popover-inner-content>div>*:last-child {
      margin-bottom: 0px;
  }

  & .ant-popover-inner-content .icon {
      margin-right: 5px;
      width: 18px;
      height: 18px;
  }
`;