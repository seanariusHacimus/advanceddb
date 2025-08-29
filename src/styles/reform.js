import styled from 'styled-components';

export default styled.div`
  .add-reform-btn {
    width: auto;
    margin-left: 10px;
  }

  .custom-table {
    .ant-table {
      background-color: transparent;
    }
    .ant-table-tbody > tr > td {
      color: var(--text);
      border-color: var(--border-grey);
    }
    .ant-table-thead > tr > th {
      background-color: transparent;
    }
    tr.ant-table-expanded-row > td {
      background-color: #fff;
      border: 1px solid var(--border-grey);
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: none;
    }

    .ant-table-tbody > tr.ant-table-row:hover > td {
      background-color: #fff;
    }

    .ant-btn-group > .ant-btn:first-child:not(:last-child), .ant-btn-group > span:first-child:not(:last-child) > .ant-btn {
      display: none;
    }

    .more-action-btn button{
      background-color: transparent;
      border: none;
      box-shadow: none;
    }

    /* .ant-table-cell.ant-table-row-expand-icon-cell {
      display: none;
    } */

    th {
      color: #828A9D;
      font-family: Montserrat;
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: 0.01em;
      text-transform: uppercase;
    }
    .ant-divider-horizontal {
      margin: 14px 0;
      border-color:#E2E4ED;
    }
  }
  .custom-table-td {
    padding: 5px 10px;
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    color: #252A32;
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

  .more-action-btn-table {
    background-color: rgb(83, 82, 99);
    color: #fff;
    border-radius: 4px;
  }
  .more-action-btn-table {
    background-color: rgb(83, 82, 99);
    color: #fff;
    border-radius: 4px;
  }
  .ant-menu-item, .ant-menu-item-selected {
    color: #fff;
    background-color: transparent !important;
  }

  .dynamic-input {
    background-color: #FAFBFC;
  }
  .bg-white > td{
    background-color: #fff !important;
  }
  .bg-white > td:first-of-type{
    border-left: 1px solid var(--border-grey);
  }
  .bg-white > td:last-of-type{
    border-right: 1px solid var(--border-grey);
  }
`;

export const EditPage = styled.div`
  .title {
    font-weight: 500;
    font-size: 24px;
    line-height: 30px;
    color: var(--text);
  }

  .grey {
    background-color: #FAFBFC;
  }
  
  input[type=date]:required:invalid::-webkit-datetime-edit {
    color: transparent;
  }
  
  input[type=date]:focus::-webkit-datetime-edit {
      color: black !important;
  }
  
`;