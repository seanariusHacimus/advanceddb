import styled from 'styled-components';

export default styled.div`
  .download-actions-button {
    height: 34px;
    padding: 4px 10px;
    border-radius: 4px;
  }

  .custom-filter-dropdown {
    .ant-checkbox-group-item {
        display: block;
        margin-right: 8px;
        padding: 2px 16px;
    }
  }

  .ant-table-column-sorter-full {
    display: block;
  }
  .pdf-button {
    color: #f44336;
    border-color: #f44336;
    svg {
      fill: #f44336;
    }

    &:hover {
      background-color: #f44336;
      color: #fff;
      
      svg {
        fill: #fff;
      }
      
    }
  }

  .excel-button {
    color: #4caf50;
    border-color: #4caf50;
    svg {
      fill: #4caf50;
    }

    &:hover {
      background-color: #4caf50;
      
      color: #fff;

      svg {
        fill: #fff;
      }
    }
  }
`;