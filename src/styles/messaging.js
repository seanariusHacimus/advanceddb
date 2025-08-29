import styled from 'styled-components';

const StyledCommunications = styled.section`
  background-color: #fff;

  #chat-wrapper {
    /* background-color: #fff; */
    border: 1px solid #e7e7e7;
  }

  #chat-area {
    border-left: 1px solid #e7e7e7;
    border-top: none;
    border-bottom: none;
    max-height: calc(100vh - 120px);
  }

  .scrollable-area {
    height: 100%;
    /* max-height: calc(100vh - 120px);
    min-height: calc(100vh - 120px); */
    overflow: auto;
    /* border-bottom: 1px solid #e7e7e7; */
  }

  .members-header {
    padding: 7px;
  }
  
  .ant-dropdown-menu-item {
    color: #252a32;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f3f44f;
    flex-direction: column;
  }
`;

const StyledMembersList = styled.div`
  
  #members-list-head {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e7e7e7;
    padding: 15px;
    height: 60px;
  }

  .username-wrapper {
    white-space: nowrap;
    overflow: hidden;

    &::after {
      content: '...';
      position: absolute;
      width: 10px;
      height: 12px;
      right: 0;
      top: 5px;
    }
  }

  .scrollable-area {
    height: 100%;
    max-height: calc(100vh - 180px);
    min-height: calc(100vh - 180px);
    overflow: auto;
    border-bottom: none;
  }
  
  .accounts-ul .ant-list-items {
    display: flex;
    flex-direction: column;
    position: relative;
    
    &>div {
      position: relative;
    }
    .new-message {
      position: absolute;
      right: 7px;
      bottom: -9px;
      background: var(--blue);
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      line-height: 16px;
    }
    .time-ago {
      font-size: 8px;
      position: absolute;
      right: 10px;
      top: -10px;
    }
  }
  .ant-list-item {
    padding: 5px;
    height: 65px;
  }
  .ant-list-item-meta {
    cursor: pointer;
    padding: 7px 5px;
    border-radius: 4px;
  }

  .user-initials {
    width: 35px;
    height: 35px;
    background: aliceblue;
    border-radius: 50%;
    font-weight: 700;
    letter-spacing: 2px;
    text-align: center;
    line-height: 35px;
  }

  .ant-list-item.active {
    background-color: #edf7fb;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      width: 3px;
      background: var(--blue);
      height: 100%;
      left: 0;
    }

    .ant-list-item-meta-description, .ant-list-item-meta-title {
      position: relative;
      color: #000000;
    }
  }

  .ant-list-item-meta-title {
    font-size: 13px;
    line-height: 1;
    font-weight: 400; 

    &>div {
      position: relative;
    }
  }
  .ant-list-item-meta-description {
    line-height: 1;
    font-size: 10px;
    position: relative;
  }
  .ant-list-item-meta {
    align-items: center;
  }
`;

const StyledChatHeader = styled.div`
  #chat-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e7e7e7;
    padding: 15px;
    height: 60px;

    .meta-wrapper {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      overflow: hidden;

      div {
        font-weight: 600;
      }
      small {
        color: #9d9d9d;
      }
    }
    h4 {
      margin-bottom: 0;
    }   
  }

  .actions-wrapper {
    display: flex;
    margin-left: auto;

    & > div {
      cursor: pointer;
      color: var(--text-light);
      margin: 0 5px;

      &:hover {
        color: var(--blue);
      }
      &.danger:hover {
        color: red;
      }
    }
  }
  .settings-button {
    margin-left: auto;
    border: none;
    box-shadow: none;
    font-size: 20px;
    color: #b4b4b4;
  }
`;

const StyledChatArea = styled.div`
  /* border-right: 1px solid #e7e7e7; */
  height: calc(100vh - 180px);
  /* min-width: 800px; */
  
  .scrollable-area {
    height: 100%;
    max-height: calc(100vh - 270px);
    overflow: auto;
  }

  .conversation {
    overflow: auto;
    display: flex;
    flex-direction: column-reverse;

    &::-webkit-scrollbar {
        width: 1px;
      }
      & ::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb, &::-webkit-scrollbar-thumb:hover {
        background: transparent;
      }
  }

  .conversation-item__message {
    background-color: #f5f8fd;
    color: #626b80;
    padding: 10px 15px;
    border-radius: 20px;
    border-top-left-radius: 0;

    .conversation-item__meta-date {
      color:#626b80;
    }
  }
  .my-message {
    flex-direction: row-reverse;

    span.anticon.anticon-cloud-download {
      color: #fff;
    }
    .conversation-item__message {
      color: #f5f8fd;
      background-color: #577af3;
      border-top-right-radius: 0;
      border-top-left-radius: 20px;
      margin-right: 10px;
    }
    .conversation-item__meta-date {
      color:#fff;
    }
    .conversation-item__avatar {
      margin-right: 20px;
    }
  }

  .empty-user {
    padding: 15px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: calc(100vh - 120px);
    background-color: rgb(237 247 251 / 25%);

    img {
      height: 300px;
    }
  }

  .conversation-item {
    display: flex;
    align-items: flex-start;
    padding: 10px 20px;
    position: relative;
    /* min-height: 60px; */

    &:first-of-type {
      margin-bottom: 28px;
    }

    .delete-button {
      position: absolute;
      right: 10px;
      top: 2px;
      background-color: transparent;
      border: none;
      display: none;
    }

    &:hover {
      background-color:rgb(249 249 249 / 34%);

      .delete-button {
        display: block;
      }
    }
  }
  .conversation-item__avatar {
    width: 35px;
    height: 35px;
    min-width: 35px;
    margin: 0;
    margin-right: 7px;
  }
  .conversation-item__message {
    margin-left: 10px;
    margin-top: 15px;
  }
  .conversation-item p {
    font-size: 14px;
    line-height: 145%;
    word-break: break-word;
    white-space: pre-line;
    overflow-wrap: break-word;
    margin-bottom: 5px;
  }
  .conversation-item__meta {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .conversation-item__meta-date {
    color: #ececec;
    margin-left: 4px;
    font-size: 12px;
  }

  .attachment-file {
    height: auto;
    max-height: 100px;
    background-color: transparent;
    width: auto;
    max-width: 100%;
    object-fit: contain;
  }
  
  .upload-progress {
    display: flex;
    align-items: center;
    width: calc(100% - 20px);
    background:#f8f9f9;
    margin: 10px;
    padding: 10px;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 7px -2px;
    max-width: 500px;

    .meta-info {
      width: 100%;
    }
    .anticon {
      font-size: 50px;
      color: #464646;
      margin-right: 10px;
    }

    .ant-progress-inner {
      background-color: #e4e4e4;
    }
    .ant-progress-bg {
      background-color: #3ba8ff;
    }
  }

    textarea {
      border: none;
      resize: none;
      background: transparent;
      outline: none;
      box-shadow: none;
      max-height: 90px !important;
      min-height: 90px !important;
      margin-right: 5px;
      overflow: auto;
      border-top: 1px solid #e7e7e7;
      padding: 10px;

      &:focus {
        box-shadow: none;
        border-color: #e7e7e7;
      }
      &::-webkit-scrollbar {
        width: 1px;
      }
      & ::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb, &::-webkit-scrollbar-thumb:hover {
        background: transparent;
      }

    }
    .send-button, .attachment-button {
      align-self: flex-end;
      position: absolute;
      right: 10px;
      bottom: -45px;
    }

    .attachment-button {
      bottom: -15px;
      background-color: transparent;
      border: none;
      font-size: 18px;
      padding: 0;
    }
  
`;

const StyledProfileInfo = styled.div`
  overflow: hidden;

  .profile-wrapper {
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    /* box-shadow: var(--box-shadow); */
    b {
      font-size: 12px;
    }
    p {
      font-size: 10px;
    }
  }
  #profile-groups {
    text-align: left;
    align-items: flex-start;
    
    & > * {
      font-size: 12px;
    }
    a {
      border-bottom: 1px solid#e7e7e7;
      display: block;
      width: 100%;
      padding: 3px 0;
      color: #acacac;
    }
  }
  .profile-image {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
  .group-members {
    padding: 15px;
  }
  .group-members__item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e7e7e7;
    padding: 10px 0;
  }
  .group-members__item__name {
    margin: auto auto auto 7px;
  }
  .group-members__item__remove {
    background: transparent;
    border: 1px solid #e6e6e6;
    color: #a5a5a5;
    border-radius: 2px;
    padding: 4px 8px;

    &:hover {
      background-color: red;
      color: #fff;
      border-color: red;
    }
  }
  .inner-scroll-area {
    height: 100%;
    max-height: calc(100vh - 180px);
    overflow-y: scroll;
    background-color: #f3f3f4;
    padding: 30px;
  }
  .group-actions {
    display: flex;
  }
  .group-actions > div {
    font-size: 12px;
    color: var(--blue);
    margin: 10px 15px;
  }
  .group-members {
    height: 100%;
    background-color: #fff;
    margin-top: 20px;
    border-radius: 4px;
  }
  .group-title {
    font-size: 18px;
    font-weight: 600;
  }
  .group-sub-title {
    font-size: 10px;
    margin: 0;
  }

  .member-title {
    font-weight: 600;
  }
  .collapse-wrapper {
    background-color:transparent;
    border: none;
    
    .ant-collapse-item {
      border: none;
      font-size: 12px;
    }
    .ant-collapse-header {
      padding: 0;
      padding-right: 35px;

      span {
        color:#393939;
      }
    }
  }
  .ant-collapse-icon-position-right > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {font-size: 8px;}
  .ant-collapse > .ant-collapse-item.ant-collapse-no-arrow > .ant-collapse-header {padding-left: 0;}

  .ant-collapse-arrow {
    font-size: 9px;
  }
  .ant-collapse-content > .ant-collapse-content-box {
    padding: 3px;

    ul {
      padding-left: 5px;
      list-style: none;
      margin-left: -8px;
    }
  }
  .ant-collapse-item:last-child > .ant-collapse-content {
    border-color: #eaeaea;
  }
`;

const StyledChatHeaderMembers = styled.div`
  position: absolute;
  border: 1px solid;
`;

export { StyledCommunications, StyledMembersList, StyledProfileInfo, StyledChatArea, StyledChatHeader, StyledChatHeaderMembers };