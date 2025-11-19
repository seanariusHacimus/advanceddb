import styled from 'styled-components';
import { MembersPage } from './startBusiness';

export const WorkingGroup = styled.div`
  .ant-modal-mask {
    z-index: 1080;
  }

  .ant-modal-wrap {
    z-index: 1080;
  }

  .ant-select-item {
    height: 38px;
    min-height: 38px;
    line-height: 28px;
    color: #FCFDFF;
  }

  .select-item {
    height: 38px;
    min-height: 38px !important;
    line-height: 28px;
    color: #FCFDFF;
  }
  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: red !important;
  }
  .not_started {
    background-color: #ECEEF4;
    color: #828A9D;
  }
 
`;

export const StyledWorkingGroup = styled(MembersPage)`
  .ant-table-tbody {
    background-color: hsl(var(--card));
    transition: background-color 0.2s ease;
  }
  .custom-dragable-table tr {
    background-color: hsl(var(--card)) !important;
    transition: background-color 0.2s ease;
  }
  .custom-dragable-table td {
    width: 10%;
    color: hsl(var(--foreground));
    transition: color 0.3s ease;
  } 
  .custom-dragable-table .title {
    width: 60%;
  } 
  .custom-dragable-table .sort-icon {
    width: 10%;
    max-width: 100px;
  } 
  .row-dragging td {
    border-bottom: 1px solid hsl(var(--primary));
  }
  .icons-set {
    display: flex;
    align-items: center;
  }
  .organization-list .icons-set {
    border-bottom: 1px solid hsl(var(--border));
    padding: 8px 16px;
    padding-left: 0;
  }
  .user-icon {
    width: 20px;
    height: 20px;
  }
  .has-icon {
    margin-right: 5px;
    width: 20px;
    height: 20px;
    vertical-align: text-bottom;
  }
  .row-dragging {
    background: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
  }
  .row-dragging td {
    padding: 16px;
    visibility: hidden;
  }
  .row-dragging .drag-visible {
    visibility: visible;
  }
  .editable-block {
    display: flex;
    align-items: center;
  }
  .editable-input {
    background: hsl(var(--card));
    color: hsl(var(--foreground));
    padding: 3px 6px;
    border: none;
    border: 1px solid transparent;
    transition: all 0.2s ease;
  }
  .editable-input:focus, .editable-input:hover {
    background-color: hsl(var(--accent));
    border: 1px dashed hsl(var(--primary));
    outline: none;
  }
  .check-icon.error {
    color: hsl(var(--destructive));
  }
  .check-icon {
    margin-left: 7px;
    font-size: 20px;
    color: hsl(142 76% 36%);
  }
`;
