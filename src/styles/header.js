import styled from "styled-components";
import { Layout } from "antd";

export default styled(Layout)`
  aside.sidebar {
    width: ${(props) =>
      window.location?.pathname?.includes("messaging")
        ? "0"
        : "266px !important"};
    max-width: ${(props) =>
      window.location?.pathname?.includes("messaging")
        ? "0"
        : "266px !important"};
    min-width: ${(props) =>
      window.location?.pathname?.includes("messaging")
        ? "0"
        : "266px !important"};
    z-index: 1050;
  }

  .sidebar .ant-layout-sider-children {
    overflow: auto;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sidebar .ant-layout-sider-children::-webkit-scrollbar {
    width: 0px;
  }

  .custom-menu .ant-menu-item {
    color: #8b8ea0;
    font-weight: 600;
  }
  .ant-menu-submenu {
    color: #000;
    font-weight: 600;
  }
  .custom-menu .ant-menu-submenu:hover,
  .custom-menu .ant-menu-submenu-selected {
    color: var(--dark-blue);
    font-size: 14px;
    font-weight: 600;
  }

  .custom-menu .ant-menu-submenu-selected::after,
  .custom-menu .ant-menu-submenu:hover::after {
    border-bottom: 2px solid var(--dark-blue);
  }

  .custom-menu .ant-menu-item-selected,
  .custom-menu .ant-menu-item:hover,
  .custom-menu .ant-menu-submenu-active,
  .custom-menu .ant-menu-submenu-active:hover,
  .custom-menu .ant-menu-submenu-title:hover {
    color: var(--dark-blue);
    font-size: 14px;
    font-weight: 600;
    // border-bottom: 2px solid var(--dark-blue);
  }
  .custom-menu .ant-menu-item-selected::after,
  .custom-menu .ant-menu-item:hover::after {
    border-bottom: 2px solid var(--dark-blue);
  }

  /* .ant-menu-horizontal {
      border-bottom: 1px solid var(--border-grey);
  } */

  .ant-menu-inline {
    border-right: none;
    padding-left: 32px;
    padding-right: 6px;
  }

  .logo {
    height: 65px;
    display: flex;
    align-items: center;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .logo img {
    height: 42px;
    margin-left: 32px;
  }

  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected,
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item:hover {
    background-color: var(--blue);
    /* font-weight: 500; */
    font-size: 15px;
    color: #fff;
    border-radius: 5px;
  }

  .ant-menu-inline .ant-menu-item::after {
    border-right: none;
  }

  .menu-icon {
    fill: #7a7d81;
    color: #7a7d81;
    margin-right: 4px;
    min-width: 15px;
    max-width: 15px;
  }

  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected .menu-icon {
    fill: #fff;
    color: #fff;
  }

  .side-bar-menu {
    color: #8b8ea0;
    padding-top: 16px;
  }

  .side-bar-menu .ant-menu-item {
    display: flex;
    align-items: center;
    height: auto;
    min-height: 40px;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 12px !important;
    padding-right: 12px;
    font-size: 15px;
    transition: 0.3s;
  }

  .ant-menu-item a {
    /* font-weight: 500; */
    white-space: normal;
    align-items: center;
    display: flex;
    line-height: 1.2;
    color: var(--title);
  }

  #header-menu {
    display: flex;
    height: 65px;
    width: calc(100% - 140px);
  }

  #header-menu .ant-menu-item a {
    height: 100%;
  }

  #header-menu .ant-menu-item:hover a {
    color: var(--dark-blue);
  }

  #header-menu .ant-menu-item-selected a {
    color: var(--dark-blue);
  }

  .is-assigned-group {
    background-color: rgb(243 243 244 / 50%);
    border-radius: 5px;
    .menu-icon {
      fill: var(--dark-blue);
    }

    .more-icons {
      height: 10px;
      width: 10px;
      background: #ffdce8;
      border-radius: 50%;
      position: absolute;
      right: 2px;
      top: 50%;
      transform: translateY(-50%);
    }
    a {
      color: var(--dark-blue);
    }
  }
  .ant-menu-item-selected a,
  .ant-menu-item-selected.is-assigned-group a {
    color: #fff;
  }

  .side-bar-menu .ant-menu-item > svg {
    min-width: 20px;
    max-width: 20px;
    width: 20px;
  }

  .side-bar-menu li:hover a,
  .side-bar-menu li:hover .menu-icon {
    color: #fff;
    fill: #fff;
    transition: 0.2s;
  }
  .side-bar-menu li:hover path#flash,
  .ant-menu-item-selected path#flash {
    fill: transparent;
    stroke: #fff;
  }

  .side-bar-menu li:hover .menu-icon.stroke {
    stroke: #fff;
  }

  .menu-icon.stroke {
    stroke: #7a7d81;
  }

  .ant-menu-item-selected .menu-icon.stroke {
    stroke: var(--dark-blue);
  }

  #header-menu .ant-menu {
    background-color: var(--background);
  }

  .ant-layout-header {
    width: 100%;
    padding-left: ${(props) =>
      window.location?.pathname?.includes("messaging")
        ? "0"
        : "40px"};
    outline: 1px solid #e9eaf1;
    z-index: 1040;
    padding-right: 180px;
  }

  /* ---------- Task Bar ------- */

  #task-bar {
    position: fixed;
    right: 40px;
    top: 0;
    height: 65px;
    line-height: 65px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 140px;
  }

  #task-bar > * {
    display: flex;
    align-items: center;
  }

  #indicator {
    position: absolute;
    right: -1px;
    top: -1px;
    width: 7px;
    height: 7px;
    background-color: #e15488;
    border-radius: 50%;
  }

  #top-search-container {
    position: fixed;
    width: ${(props) =>
      window.location?.pathname?.includes("messaging")
        ? "100%"
        : "calc(100% - 256px)"};
    left: ${(props) =>
      window.location?.pathname?.includes("messaging")
        ? "0"
        : "256px"};
    top: 0;
    right: 0;
    height: 64px;
    background: var(--background);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
  }

  .search-open #search-input {
    width: 100%;
    height: 40px;
    border: none;
    margin-right: 5px;
    background: var(--background);
    color: var(--dark-blue);
    outline: none;
  }

  #search-input {
    width: 0px;
    margin-right: 0px;
    padding: 0;
    border: 0;
  }

  #search-input:focus {
    width: 200px;
    margin-right: 5px;
    padding: 4px 11px;
    border: 1px solid var(--border-grey);
    outline: none;
    box-shadow: none;
  }

  aside.sidebar .ant-layout-sider-zero-width-trigger {
    right: -30px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px !important;
    height: 30px;
    background-color: var(--title);
    color: #fff;
  }

  @media screen and (max-width: 1200px) {
    .custom-menu .ant-menu-item {
      min-width: 135px;
    }
  }

  @media screen and (max-width: 991px) {
    .sidebar.ant-layout-sider-collapsed.ant-layout-sider-zero-width {
      min-width: 0 !important;
    }
    aside.ant-layout-sider-collapsed.ant-layout-sider-zero-width
      + section
      > header {
      padding-left: 0 !important;
    }

    #top-search-container {
      width: 100%;
      left: 0px;
    }
  }
`;

export const StyledLanguages = styled.div`
  .language-list {
    border: none;
    background-color: var(--background);
  }
  .language-list:focus {
    outline: none;
  }
`;

export const StyledMessagingNotifications = styled.div`
  margin: 0 10px 0 0;
`;
