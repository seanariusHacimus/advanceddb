import { createGlobalStyle } from "styled-components";
import colors from "../constants/colors";

export default createGlobalStyle`
  .text-capitalize {
    /* text-transform: capitalize; */
  }
  input.input-error, select.input-error, textarea.input-error, .input-error, .custom-select.input-error {
    border: 1px solid var(--danger);
  }
  .ant-layout-content > div:not(.graph-with-box){
    box-shadow: var(--box-shadow);
    padding: 20px;
    margin: 0 -20px;
    border-radius: 4px;
  }

  /*----- Actions edit attachments----- */
  .file-attachment {
    margin: 5px 5px 10px;
    display: flex;
    align-items: center;
    font-size: 11px;
  }
  .file-attachment-remove-btn {
    color: var(--danger);
    margin-left: 2px;
    background: transparent;
    border: none;
    border-radius: 2px;
    font-size: 15px;
    padding: 0 7px;
    cursor: pointer;
  }
  .file-attachment-remove-btn:hover {
    background-color:var(--danger);
    color: #fff;
  }
  .file-attachment-icon {
    margin-right: 3px;
  }

  .ant-modal-content {
    border-radius: 5px;
  }

  form#header .ant-alert.ant-alert-success {
    margin-top: 12px;
  }

  .has-box-shadow .editor-content {
    max-width: 980px;
  }

  .has-box-shadow {
    padding: 24px;
    box-shadow: rgba(9,30,66,0.25) 0px 4px 8px -2px,rgba(9,30,66,0.31) 0px 0px 1px;
    background: #fff;
    border-radius: 5px;

    &.editor img {
      width: 100%;
    }
  }
  .clickable {
    cursor: pointer;
  }
  
  #spinner-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    z-index: 1200;
    background-color: rgb(82 123 221 / 10%);
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    display: none;

    &.show {
      display: flex;
    }

    .ant-spin-dot {
      font-size: 50px;
    }
    .ant-spin-dot i {
      width: 20px;
      height: 20px;
      background-color: var(--blue);
      opacity: 1;
    }
  }
 
  .anticon.anticon-more svg{
    fill: #252A32;
  }

 .ant-btn.ant-dropdown-trigger.ant-dropdown-open.ant-btn-default.ant-btn-icon-only {
    background: #FCFDFF;
    border: 1px solid #252A32;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .ant-menu-item:hover {
    color: #FCFDFF;
  }
  .email {
    color: var(--blue);

    &.thin {
      font-weight: 300;
    }
  }
  .ant-switch-checked {
    background-color: var(--blue) !important;
  }
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected,
  .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
    background-color: transparent;
    color: #FCFDFF;
  }
  .role-label {
    background: rgb(76 175 80 / 11%);
    color: green;
    padding: 5px 10px;
    border-radius: 4px;

    b{
      text-transform: capitalize;
      letter-spacing: .4px;
    }
  }
  .ant-menu:not(.ant-menu-horizontal):not(.side-bar-menu) li:hover,
  .ant-dropdown-menu-item:hover, .ant-dropdown-menu-submenu-title:hover {
    background-color: #777685;
    color: #FCFDFF;
  }
  .ant-menu:not(.ant-menu-horizontal):not(.side-bar-menu):not(.ant-menu-sub) li:hover a{
    color: #FCFDFF;
  }
  .actions-popconfirm .ant-popover-inner {
    background-color: #535263;
    max-width: 400px;
    width: 100%;
    border-radius: 5px;
  }
  .actions-popconfirm h3, .actions-popconfirm h3 {
    color: #FCFDFF;
  }
 .actions-popconfirm p {
    color: #B2B2BA;
  }
  .trigger-btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  .ant-popconfirm .ant-popover-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .actions-popconfirm button {
    width: calc(50% - 5px);
    padding: 3px 20px; 
    margin-right: 5px;
    color: #E9EAED;
    border-radius: 5px;
    height: auto;
  }
  .actions-popconfirm .ant-btn {
    background: #777685;
  }
  .ant-popover-message-title {
    padding-left: 20px;
  }
  .ant-popover-placement-bottom > .ant-popover-content > .ant-popover-arrow {
    left: 20%;
    border-color: #535263;
  }
  .actions-popconfirm .ant-btn-primary {
    width: calc(50% - 5px);
    padding: 3px 20px; 
    margin-left: 5px;
    background: #6287E1;
    color: #FAFBFC;
  }
  .has-user {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-blend-mode: normal;
    background-color: #f3f3f4;
    border: 2px solid #FCFDFF;
    margin-right: -12px;
    box-shadow: var(--box-shadow);
  }

  .apexcharts-tooltip {
    background: #535263;
    color: orange;
  }

  button {
    cursor: pointer;
  }
  
  .ant-select-dropdown {
    background-color: #535263;
    padding: 10px                        
  }
  
  .ant-empty-description {
    color: #fff;
  }

  .ant-progress-status-success .ant-progress-text {
    color: var(--text-light);
  }
  
  .ant-menu.more-action-btn-table {
    min-width: 100px;
    background-color: #535263;
    color: #fff;
    border-radius: 5px;
    padding: 4px 8px;
    
    & .ant-menu-item {
      &:hover, &.ant-menu-item-active, &.ant-menu-item-selected{
        background-color: #777685!important;
        color: #fff!important;      
        font-weight: 400!important;
        font-size: 14px!important;
      }
    }
    
  }
  .has-sorter-icon svg {
    margin-right: 10px;
    width: 14px;
  }
  th.ant-table-cell.ant-table-column-has-sorters,
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background: var(--background);
  }
  .ant-table-thead th.ant-table-column-has-sorters:hover .ant-table-filter-trigger-container,
  .ant-table-filter-trigger {
    background-color: transparent;
  }
  .ant-table-filter-column-title {
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .ant-table-column-sorter-full {
    display: none;
  }

  .ant-table-cell.ant-table-row-expand-icon-cell {
    padding-left: 0;
  }

  .ant-table-filter-trigger-container {
    align-items: center;
    height: 28px;
    width: 28px;
    top: 11px;
  }
  .ant-table-filter-trigger-container-open, 
  .ant-table-filter-trigger-container:hover {
    background: transparent;
    border: 1px solid #252A32;
    box-sizing: border-box;
    border-radius: 5px;
  }
  .ant-table-content {
    overflow: auto;
  }
  
  li.ant-dropdown-menu-item.ant-dropdown-menu-item-selected {
    background-color: transparent;
    color: #FCFDFF;
  }
  
  .ant-dropdown-menu-item:hover, .ant-dropdown-menu-submenu-title:hover {
    background: #777685;
    border-radius: 4px;
  }
  /* ----- FILTER DROPDOWN ------- */
  .ant-table-filter-dropdown {
    min-width: 150px;
    background-color: #535263;
    border-radius: 5px;
  }
  .ant-table-filter-dropdown .ant-dropdown-menu {
    background-color: #535263;
    padding: 10px;
    color: #FCFDFF;
  }
  .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title,.ant-table-filter-dropdown .ant-btn-link {
    color: #FCFDFF;
  }
  .more-action-btn-table .ant-dropdown-menu-item {
    height: 40px;
    padding: 10px 12px;
  }

  .custom-tooltip {
    font-size: 12px;
    margin-left: 5px;
  }
  .more-action-btn-table {
    background-color: rgb(83, 82, 99);
    color: #fff;
    border-radius: 4px;
    padding: 10px;
    min-width: 150px;
    vertical-align: middle;
  }
  .more-action-btn-table {
    & li.ant-menu-item {
      background-color: transparent !important;
      color: #FCFDFF !important;
    }  
    & svg {
      padding-right: 4px;
      vertical-align: text-bottom;
      height: 20px;
      width: 20px;
    } 
  } 
  .more-action-btn-table li.ant-menu-item:hover, .more-action-btn-table .ant-menu-item-selected {
    background-color: #777685 !important;
    color: #FCFDFF !important;
  }
  .more-action-btn:hover button {
    background-color: #F0F1F6;
  }
  .users.more-action-btn {
    & .ant-btn-default.ant-btn-icon-only {
    position: absolute;
  }
  }
  #dragable-move {
    position: fixed;
    bottom: 6px;
    align-items: center;
    width: calc(100% - 80px - 265px);
    height: 61px;
    padding: 10px 20px;
    background: var(--dark);
    border-radius: 5px;                                                                                                         
    color: #FFFFFF;

    button {
      width: auto;
      padding: 8px 50px;
    }
    .cancel {
      margin-left: auto;
      margin-right: 12px;

      &:hover {
        background-color: #777685;
        color: #FCFDFF;
      }
      
    }
  }

  .invitation-modal {
    padding: 0 32px;
  }
  .custom-select {
    border: 1px solid #E2E4ED;
    border-radius: 4px;
  }
  .custom-select .ant-select-selector{
    border: none !important;
    background-color: transparent !important;
  }
  .custom-select.has-value + label {
    display: block;
  }

  .custom-select.has-value .ant-select-selection-item {
    top: 4px;
  }

  .custom-select + label {
    display: none;
    width: 100%;
    position: absolute;
    left: 17px;
    top: 5px;
    transition: 0.2s;
    font-size: 12px;
    font-weight: 400;
    color: #717A8F;
  }
  
  @media (max-width: 991px) {
    #dragable-move {
      width: calc(100% - 80px);
    }
  }

  
  .ant-menu.more-action-btn-table {
    min-width: 100px;
    background-color: #535263;
    color: #fff;
    border-radius: 5px;
    padding: 4px 8px;
    
    & .ant-menu-item {
      &:hover, &.ant-menu-item-active, &.ant-menu-item-selected{
        background-color: #777685!important;
        color: #fff!important;      
        font-weight: 400!important;
        font-size: 14px!important;
      }
    }
    
  }
  .has-sorter-icon svg {
    margin-right: 10px;
    width: 14px;
  }
  th.ant-table-cell.ant-table-column-has-sorters,
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background: var(--background);
  }
  .ant-table-thead th.ant-table-column-has-sorters:hover .ant-table-filter-trigger-container,
  .ant-table-filter-trigger {
    background-color: transparent;
  }
  /* .ant-table-filter-column-title {
    padding-top: 0px;
    padding-bottom: 0px;
  } */
  .ant-table-column-sorter-full {
    display: none;
  }

  .ant-table-cell.ant-table-row-expand-icon-cell {
    padding-left: 0;
  }

  .ant-table-filter-trigger-container {
    align-items: center;
    height: 28px;
    width: 28px;
    top: 11px;
  }
  .ant-table-filter-trigger-container-open, 
  .ant-table-filter-trigger-container:hover {
    background: transparent;
    border: none;
    box-sizing: border-box;
    border-radius: 5px;
  }
  .ant-table-filter-trigger{
    height: 100%;
    width: 100%;
    &.active svg path{
      fill: var(--blue)
    }
    svg {
      width: 100%;
      height: 100%;
      padding: 6px
    }
  }
  .ant-table-content {
    overflow: auto;
  }
  
  li.ant-dropdown-menu-item.ant-dropdown-menu-item-selected {
    background-color: transparent;
    color: #FCFDFF;
  }
  
  .ant-dropdown-menu-item:hover, .ant-dropdown-menu-submenu-title:hover {
    background: #777685;
    border-radius: 4px;
  }
  /* ----- FILTER DROPDOWN ------- */
  .ant-table-filter-dropdown {
    min-width: 150px;
    background-color: #535263;
    border-radius: 5px;
  }
  .ant-table-filter-dropdown .ant-dropdown-menu {
    background-color: #535263;
    padding: 10px;
    color: #FCFDFF;
  }
  .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title,.ant-table-filter-dropdown .ant-btn-link {
    color: #FCFDFF;
  }
  
  .input-icon {
    margin-right: 10px;
  }
  .has-input-icon {
    flex-wrap: wrap;

    .success {
      position: absolute;
      right: -30px;
    }
  }

  .input-msg {
    font-size: 12px;
    line-height: 15px;
    color: #f181ab;
    margin-top: 6px;
  }

  .working-group .ant-select-selection-search-mirror {
    opacity: 1;
    visibility: visible;
  }
  .working-group .custom-select .ant-select-selection-search .ant-select-selection-search-input {
    opacity: 0;
  }
  .working-group .custom-select .ant-select-selector {
    padding: 5px;
  }
  .custom-collapse {
    background-color: transparent;

    .ant-collapse-item {
      border: none;
    }

    .ant-collapse-item > .ant-collapse-header {
      display: none;
    }

    .ant-collapse-content-box {
      padding: 0;
      padding-top: 0;
    }

    .ant-list-split .ant-list-item:first-of-type {
      border-top: 1px solid #f0f0f0;
    }
  }

  .max-date {
    background-color: #000;
    color: #fff;
  }
  div.ant-typography, .ant-typography p {
    margin-bottom: 0;
  }
  .print-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: auto;
    height: 34px;
    margin-left: auto;
    padding: 6.5px 10px;
    background: #FCFDFF;
    border: 1px solid #D6D9E4;
    border-radius: 5px;
    color: #828A9D;
    font-size: 12px;

    &:hover {
      background: #f3f3f4;
      color: #656f87;
      border-color: #8f96a5;
    }
  }

  .ant-table-tbody > tr .ant-table-wrapper:only-child .ant-table {
    margin: 0;
  }

  .ant-select-multiple .ant-select-selection-item-content,
  .ant-select-selection-placeholder {
    font-size: 14px;
  }

  .custom-select {
    background-color: #fff;
  }
  .custom-select.members .ant-select-selector .ant-select-selection-item {
    background: #fafafa;
    margin: 2px;
  }
  .actions-popover .ant-popover-inner {
    background-color: var(--dark);
    border-radius: 6px;
  }
 
  .actions-popover h3 {
    color: #FCFDFF;
    margin-bottom: 0;
  }

  .actions-popover .content {
    color: #B2B2BA;
    margin: 10px 0;
  }
  .actions-popover span {
    color: rgb(206 220 226);
  }
  .ant-select-selection-placeholder {
    color: var(--text);
  }
  
  .printer-container {
    margin-left: auto;
  }
  .swal2-popup {
    padding: 10px;
  }
  .swal2-title {
    font-size: 20px;
  }
  .swal2-content {
    font-size: 14px;
  }
  .swal2-styled {
    padding: 5px 15px;
  }
  .swal2-icon {
    margin: 12px;
  }
  button.swal2-styled {
    font-size: 14px !important;
  }
  .swal2-container {
    z-index: 1080;
  }
  .swal2-actions {
    margin-top: 10px;
  }
  .swal2-styled:focus {
    box-shadow: none;
  }
  .swal2-icon {
    font-size: 8px !important;
  }

  @media print {
    header,
    aside.sidebar,
    #inner-search,
    .ant-tabs-nav,
    .printer-container,
    .add-subaction-btn,
    .action-btn-group,
    .gantt-control,
    .customize-btn,
    .more-action-cell,
    .add-new-action {
      display: none !important;
      column-span: none;
    }

    tr.ant-table-expanded-row > td,
    .ant-table-tbody > tr.ant-table-row > td,
    .custom-table-row, .custom-table thead > tr, .custom-table-expanded-row tr {
      /* background-color: #fff !important; */
    }
    .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after,
    .ant-table-ping-left:not(.ant-table-has-fix-left) .ant-table-container::before {
      box-shadow: none;
    }
    .ant-table-tbody > tr.ant-table-row > td,
    .custom-table-row {
      font-size: 12px;
    }
    .ant-btn-group.ant-dropdown-button.more-action-btn {
      display: none;
    }


    .statistic-row {
      .ant-col-md-8 {
        flex: 0 0 41.66666667%;
        max-width: 41.66666667%;
      } 
      .ant-col-md-16 {
        display: block;
        flex: 0 0 58.33333333%;
        max-width: 58.33333333%;
      }
    }
    .statistic-row + .ant-row{
      .ant-col-md-12 {
        flex: 0 0 50%;
        max-width: 50%;
      } 
      .value {
        display: none;
      }
    }
    .action-statistics {
      display: none;
      .ant-col-md-10 {
        flex: 0 0 41.66666667%;
        max-width: 41.66666667%;
      }
      .ant-col-md-14 {
        flex: 0 0 58.33333333%;
        max-width: 58.33333333%;
      }
    }
    .filter-field,
    .compare-countries.sub-title {
      display: none;
    }
    .graph-wrapper {
      .ant-col-24 {
        flex: 0 0 50%;
        max-width: 50%;
        max-height: 230px;
      }
      
    }
  }

  .status-btn {
    border-radius: 30px;
    text-transform: capitalize;
  } 
  .status-btn-inside {
    width: 100%;
    margin: 7px 0;
  }
  .status-button {
    width: 90%;
  }
  .ongoing_within_deadline, .on_review  {
    background-color: #F8DD96;
    color: #886710;
    text-transform: capitalize;
  }
  .completed {
    background-color: var(--blue);
    color: #fff;
    text-transform: capitalize;
  }
  .on_review {
    border-color: red;
    color: red;
  }
  .ongoing_past_deadline {
    background-color: #FFC6CC;
    color: #9C353D;
    text-transform: capitalize;
  }
  .not_started {
    background-color: #ECEEF4;
    color: #828A9D;
    text-transform: capitalize;
  }
  .ant-table-filter-trigger .anticon {
    width: 27px;
    height: 27px;
  }

  .custom-filter-dropdown {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--dark);
    padding: 10px;
    width: max-content;
    

    .ant-checkbox-group-item {
      margin: 3px 0;
      color: #fff;
    }

    .search-wrapper {
      position: sticky;
      top: 0;
      background-color: var(--dark);
      padding: 0 0 10px 0;
    }
  }
  .ant-checkbox-group {
    display: flex;
    flex-direction: column;
    height: max-content;
    max-height: 350px;
    overflow: auto;
  }
`;
