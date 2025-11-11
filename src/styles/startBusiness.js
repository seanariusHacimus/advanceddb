import styled from "styled-components";

export default styled.div`
  .print-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: auto;
    height: 34px;
    margin-left: auto;
    padding: 8.5px 10px;
    background: #fcfdff;
    border: 1px solid #d6d9e4;
    border-radius: 5px;
    color: #828a9d;

    &:hover {
      background: #f3f3f4;
      color: #656f87;
      border-color: #8f96a5;
    }
  }
  .inner-block {
    padding: 20px;
    background: hsl(var(--card));
    width: 100%;
    border-radius: 10px;
    box-shadow: var(--box-shadow);
    height: 100%;
  }
  .ant-tabs-nav::before {
    border-color: var(--border-grey);
  }

  .ant-tabs-tab-btn {
    color: #717a8f;
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn,
  .ant-tabs-tab:hover {
    color: var(--blue);
    font-weight: 600;
  }
  .ant-tabs-ink-bar {
    background: var(--blue);
  }
  .ant-tabs-tabpane {
    margin-top: 10px;
  }
  .col-middle {
    padding: 0 15px;
    /* border: 1px solid var(--border-grey); */
    border-bottom: none;
    border-top: none;
    margin: 0;
  }
  .border-bottom {
    border-bottom: 1px solid var(--border-grey);
  }
  .col-1 {
    padding-right: 15px;
  }
  .col-3 {
    padding-left: 15px;
  }
  .sub-title {
    text-align: center;
    text-transform: capitalize;
  }
  .progress-toggle.show {
    height: auto;
    transition: 1s;
  }
  .progress-toggle.hide {
    height: auto;
    transition: 1s;
  }
  @media screen and (max-width: 768px) {
    .col-left {
      border-right: 0;
      padding-right: 0;
    }
    .col-3 {
      padding-left: 0;
    }
    .col-1 {
      padding-right: 0;
    }
    .col-middle {
      /* border: 1px solid var(--border-grey); */
      border-left: none;
      border-right: none;
      margin: 15px 0;
      padding: 15px 0;
    }
    .col-right {
      padding-left: 0;
    }
    .has-right-divider {
      border-right: none;
      padding-right: 0;
    }
    .has-left-divider {
      padding-left: 0;
    }
  }
`;

export const ActionPlanPage = styled.div`
  #header {
    width: calc(100% + 40px);
    margin: 23px 0;
    padding: 11px 40px;
    background: #f3f5f9;
    border-top: 1px solid #527bdd;
    position: relative;
    left: -20px;
  }
  .dynamic-input {
    background-color: #fafbfc;
  }
  input[type="date"]:required:invalid::-webkit-datetime-edit {
    color: transparent;
  }

  input[type="date"]:focus::-webkit-datetime-edit {
    color: black !important;
  }

  .btn-group {
    align-items: center;
    justify-content: space-between;

    button {
      width: auto;
      padding: 12px 40px;
      height: 41px;
    }

    img {
      margin-right: 5px;
      width: 16px;
      height: 16px;
    }

    .cancel {
      margin-left: auto;
      margin-right: 12px;
      background-color: #dfe4ed;
    }
    .cancel:hover {
      background-color: #d6d6dd;
      border-color: #d6d6dd;
    }
  }

  .action-btn-group button {
    display: flex;
    align-items: center;
    width: auto;
  }
  .list-btn {
    margin-right: 12px;
    padding: 4px;
    border-radius: 5px;
    border: none;
  }
  .list-btn:first-of-type {
    margin-left: auto;
  }
  .list-btn.active {
    background-color: #e7eaf0;
    border: 1px solid var(--border-grey);
  }

  .user-icon {
    margin-right: 11px;
  }

  @media (max-width: 610px) {
    .btn-group {
      flex-wrap: wrap;

      button {
        width: 100%;
      }

      .cancel {
        margin: 10px 0;
      }
    }
  }
`;

export const ActionTablePage = styled.div`
  .icons-set {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .item-title {
    margin-left: 8px;
  }
  .attachment-icon {
    margin-left: 16px;
  }
  .action-attachment-item {
    color: #000;
    transition: none;

    &:hover {
      color: #fff;
      transition: none;
    }
  }
  .ant-btn {
    border-color: transparent;
    text-shadow: none;
    box-shadow: none;
    background-color: transparent;
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
    width: 96%;
    margin: auto;
    font-size: 13px;
  }
  .ongoing_within_deadline,
  .on_review {
    background-color: #f8dd96;
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
    background-color: #ffc6cc;
    color: #9c353d;
    text-transform: capitalize;
  }
  .not_started {
    background-color: #eceef4;
    color: #828a9d;
    text-transform: capitalize;
  }

  .ant-menu-item,
  .ant-menu-item-selected {
    color: #fff !important;
    background: transparent !important;
  }
  .ant-table-tbody > tr.ant-table-row > td,
  .ant-table-tbody > tr.ant-table-row:hover > td,
  .ant-table-expanded-row > td,
  .ant-table-expanded-row:hover > td,
  .ant-table-thead > tr > th {
    background-color: var(--background);
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .ant-btn.ant-dropdown-trigger.ant-btn-default.ant-btn-icon-only {
    background-color: transparent;
    position: absolute;
  }
  .ant-table-tbody > tr .ant-table-wrapper:only-child .ant-table td {
    background-color: var(--background);
  }

  .custom-table-row:hover,
  .custom-table-row:hover > td,
  .custom-table-expanded-row tr:hover,
  .custom-table-expanded-row tr:hover > td {
    background: #f0f1f6 !important;
    transition: all 0s;
  }

  .sub-action-wrapper {
    width: 100%;
  }

  .ant-table-tbody > tr > td {
    transition: all 0s;
  }
  tr.ant-table-expanded-row.ant-table-expanded-row-level-1 > td {
    padding: 0;
  }
  .ant-table-cell.ant-table-row-expand-icon-cell {
    padding-left: 0;
  }
  .table-date {
    white-space: nowrap;
  }
  .table-count {
    max-width: 55px;
    width: 55px;
  }
  .ant-table-cell.ant-table-row-expand-icon-cell + td {
    padding-left: 0;
  }
  .add-subaction-btn {
    margin-top: 15px;
    margin-right: 30px;
    margin-bottom: 15px;
    padding: 4px 10px;
    border-color: transparent;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #e8e8e8;
    }
  }
  .ant-table-content {
    padding-bottom: 0px;
  }
  .ant-table-content::-webkit-scrollbar-track {
    background: var(--background);
  }

  .ant-table-content::-webkit-scrollbar-thumb {
    background: linear-gradient(to right, #638fce82 20%, #ffeb3b00 10px);
    border-radius: 3px;
    border: 6px solid var(--background);
  }
  .sub-action-row td,
  .sub-action-row {
    background: #f3f6fd !important;
  }
  .ant-table-content::-webkit-scrollbar {
    width: 4px;
  }

  .custom-draggable-table tr.drop-over-downward td {
    border-bottom: 2px dashed #1890ff !important;
  }
  .custom-draggable-table tr.drop-over-upward td {
    border-top: 2px dashed #1890ff;
  }

  .custom-table table {
    background: var(--background);
  }
  .complete-checkbox {
    padding-left: 0;
    margin-left: -15px;
  }
  .custom-table-row,
  .custom-table thead > tr,
  .custom-table-expanded-row tr {
    display: grid;
    grid-template-columns:
      30px minmax(200px, 1fr) minmax(150px, 0.5fr) minmax(150px, 0.5fr)
      minmax(200px, 0.5fr) minmax(200px, 0.5fr) 47px;
    background-color: var(--background);
    align-items: center;
    width: calc(100vw - 270px - 120px);
  }

  .custom-table-row,
  .custom-table thead > tr {
    border-bottom: 1px solid var(--border-grey);
  }
  .custom-table-expanded-row tr > td {
    border-bottom: 1px solid var(--border-grey) !important;
  }
  .custom-table-expanded-row tr:hover > td {
    border-bottom: 1px solid var(--blue) !important;
  }
  .custom-table thead > tr > th {
    border-bottom: none;
  }

  .custom-table thead > tr:first-of-type,
  .custom-table-expanded-row td:first-of-type {
    align-self: stretch;
  }

  .custom-table .ant-table-tbody > tr > td {
    border-bottom: none;
  }
  .custom-table-row .item-title,
  .custom-table-row .table-date,
  .custom-table-row .table-responsible {
    font-weight: 500;
    font-style: normal;
    line-height: 17px;
    letter-spacing: 0.01em;
  }
  .custom-draggable-table table {
    background: #f3f6fd;
  }

  .ant-table-column-sorter-full {
    display: block;
  }
  .ant-table-filter-trigger .anticon {
    position: relative;
  }

  @media (max-width: 1200px) {
    .custom-table-row,
    .custom-table thead > tr,
    .custom-table-expanded-row tr {
      width: 100%;
    }
  }
  @media (max-width: 991px) {
    #dragable-move {
      width: calc(100% - 80px);
    }
    .custom-table-row,
    .custom-table thead > tr,
    .custom-table-expanded-row tr {
      width: 100%;
    }
  }
`;

export const ActionPlanEmpty = styled(ActionPlanPage)`
  #empty-table-wrapper {
    position: relative;
    margin-bottom: 100px;
  }
  #empty-data-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, 50%);
    padding: 1px 5px;
    background-color: #fcfdff;
    z-index: 2;
    text-align: center;
  }
  #arrow-icon {
    position: absolute;
    right: 45px;
    top: -15px;
  }

  @media (max-width: 768px) {
    #arrow-icon {
      width: 250px;
    }

    #empty-data-wrapper {
      transform: translate(-50%, 0%);
    }
  }
  @media (max-width: 520px) {
    #arrow-icon {
      width: 220px;
      top: -35px;
    }

    #empty-data-wrapper {
      transform: translate(-50%, -100%);
    }
  }
  @media (max-width: 450px) {
    #arrow-icon {
      width: 220px;
      top: -35px;
    }

    #empty-data-wrapper {
      transform: translate(-50%, -150%);
      width: 100%;
    }
  }
`;

export const MeetingMinutesPage = styled.div`
  .add-new-action {
    width: auto;
    margin-left: auto;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    background-color: var(--background);
    color: var(--text);
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background-color: #f0f1f6;
  }
  .ant-table-thead > tr > th {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: #828a9d;
  }
  .expanded-content h3 {
    margin-bottom: 10px;
    margin-top: 15px;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    font-weight: 500;
    color: var(--text-light);
  }
  .expanded-content p {
    font-size: 14px;
    line-height: 150%;
    color: #252a32;
  }

  tr.ant-table-expanded-row > td {
    background-color: hsl(var(--card));
    border: 1px solid var(--border-grey);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
  }
  .bg-white > td {
    background-color: hsl(var(--card)) !important;
  }
  .bg-white > td:first-of-type {
    border-left: 1px solid var(--border-grey);
  }
  .bg-white > td:last-of-type {
    border-right: 1px solid var(--border-grey);
  }
  .attachment-icon {
    margin-left: 10px;
    margin-right: 5px;
  }
  .icons-set .item-title {
    border-bottom: 1px dashed var(--border-grey);
    color: var(--text);
  }

  .ant-pagination-item a {
    color: var(--text);
  }

  .ant-pagination-next:hover .ant-pagination-item-link,
  .ant-pagination-prev:hover .ant-pagination-item-link {
    color: var(--blue);
  }
  .ant-pagination-item-active {
    border-radius: 6px;
    background-color: var(--blue);
    border-color: var(--blue);

    a {
      color: #fff;
    }
  }
`;

export const MeetingMinutesEmpty = styled(ActionPlanEmpty)`
  .ant-table-tbody {
    display: none;
  }
  #arrow-icon {
    top: -65px;
  }
  .ant-table-thead {
    opacity: 0.3;
  }
  .ant-table-thead > tr > th {
    background-color: var(--background);
    color: #828a9d;
    font-size: 12px;
  }
  .add-new-action {
    margin-left: auto;
  }
  #empty-data-wrapper {
    top: 15px;
  }

  @media (max-width: 768px) {
    #empty-data-wrapper {
      top: 30px;
    }
  }
  @media (max-width: 520px) {
    #empty-data-wrapper {
      top: 65px;
    }
  }
  @media (max-width: 450px) {
    .ant-table-wrapper {
      display: none;
    }
    #empty-data-wrapper {
      top: 105px;
    }
    #arrow-icon {
      top: -47px;
    }
  }
`;

export const MembersPage = styled(MeetingMinutesPage)`
  .user-icon {
    margin-right: 8px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  .icons-set .item-title {
    border-bottom: none;
  }
  .expanded-title {
    margin-right: 15px;

    img {
      vertical-align: text-top;
    }

    a {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      text-decoration-line: underline;
      color: var(--text);
      margin-left: 4px;
    }
  }

  .pending-subtitle {
    color: #c1d3ff;
  }
  .small {
    width: auto;
    font-weight: 500;

    img {
      margin-right: 5px;
      vertical-align: baseline;
      width: 15px;
      height: 15px;
    }
  }
  .deny {
    background-color: #777685;
    color: #fff;
    margin-left: 10px;
  }

  .bg-dark > td,
  .bg-dark .icons-set .item-title {
    background-color: var(--dark) !important;
    color: #fcfdff !important;
  }
  .bg-dark .ant-btn.ant-dropdown-trigger.ant-btn-default.ant-btn-icon-only {
    background: #777685;
    position: absolute;
  }
  .bg-dark .anticon.anticon-more svg {
    fill: #c6c5cc;
  }
  .ant-table-row-level-0.bg-dark > td:first-of-type::before,
  .bg-dark.ant-table-expanded-row > td:first-of-type::before {
    content: "";
    position: absolute;
    left: 2px;
    top: 2px;
    bottom: 1px;
    width: 4px;
    height: calc(100% - 4px);
    background: #c1d3ff;
    border-radius: 3px;
  }
  .bg-dark > td:first-of-type {
    border-top-left-radius: 5px;
  }
  .bg-dark > td:last-of-type {
    border-top-right-radius: 5px;
  }
  .bg-dark.ant-table-expanded-row > td {
    background-color: hsl(var(--card));
    border: 1px solid var(--border-grey);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
  }
  .expanded-content {
    padding: 0 25px;
  }
  .bg-dark .expanded-content h3 {
    color: #bcbcc2;
  }
  .bg-dark .expanded-content p,
  .bg-dark .expanded-content a {
    color: #fcfdff;
  }

  .bg-denied > td {
    opacity: 0.3;
  }

  .bg-denied > td:last-of-type {
    opacity: 1;
  }

  .bg-denied.ant-table-expanded-row > td {
    opacity: 0.3;
    background-color: hsl(var(--card));
    border: 1px solid var(--border-grey);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
  }

  .ant-tag {
    /* width: 100%; */
    border-radius: 30px;
    text-align: center;
    padding: 5px 10px;
    text-transform: capitalize;
    font-weight: 500;
    font-size: 14px;
    &.invite_expired,
    &.denied {
      background: #ffc6cc;
      color: #9c353d;
      border: none;
    }
    &.invite_sent {
      background: #eceef4;
      color: #515867;
      border: none;
    }
    &.active {
      background: #c4f5e9;
      color: #0c8a6b;
      border: none;
    }
    &.disabled,
    .not_started {
      background-color: #828a9d;
      color: #fcfdff;
      border-color: transparent;
    }
  }
  .superuser {
    color: var(--blue);
    text-transform: capitalize;
  }
  .coordinator {
    color: var(--danger);
    text-transform: capitalize;
  }
  .leader {
    color: #cb7b0e;
    text-transform: capitalize;
  }
  .member {
    text-transform: capitalize;
  }
  .ant-table-column-sorter-up.active,
  .ant-table-column-sorter-down.active {
    background-color: transparent;
    color: var(--dark-blue);
  }
  .ant-table-column-sorter-up + .ant-table-column-sorter-down {
    margin-top: -2px;
    font-size: 13px;
  }
  .active.ant-dropdown-trigger.ant-dropdown-open {
    background: #fdfdff;
  }

  .members-title {
    min-width: 200px;
  }
  @media (max-width: 1120px) {
    .small span {
      display: none;
    }
    .small img {
      margin: 0;
    }
  }
`;

export const StyledMembersAll = styled(MembersPage)`
  .ant-table-cell:not(.ant-table-cell::last-of-type) {
    min-width: 100px;
  }
  .ant-table-container {
    background-color: var(--background);
  }
  .ant-table-content {
    overflow: auto hidden;
  }
  .wg-list {
    display: inline-block;
    margin-right: 2px;
    font-size: 12px;
    line-height: 1.4;
  }
  .bg-dark .ant-table-row-expand-icon-cell::before,
  .bg-dark.ant-table-expanded-row > td:first-of-type::before {
    content: "";
    position: absolute;
    left: 2px;
    top: 2px;
    bottom: 1px;
    width: 4px;
    height: calc(100% - 4px);
    background: #c1d3ff;
    border-radius: 3px;
  }
  .bg-dark > td:first-of-type {
    border-top-left-radius: 5px;
  }
  .bg-dark > td:last-of-type {
    border-top-right-radius: 5px;
  }
  .bg-dark.ant-table-expanded-row > td {
    background-color: hsl(var(--card));
    border: 1px solid var(--border-grey);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
  }

  button.small {
    img {
      margin-right: 5px;
    }
    span {
      display: block;
    }
  }
  .toggle-icon {
    margin-right: 12px;
    min-width: 35px;
  }
`;

export const StyledMembersTable = styled.div`
  table {
    width: 100%;
    text-align: center;
    th {
      text-align: center;
    }
    td.ant-table-cell {
      text-align: center;
    }
  }
`;
