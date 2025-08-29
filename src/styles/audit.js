import styled from 'styled-components';
import { colors } from '../constants';

export default styled.div`
    .user-image {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
      object-position: center;
      margin-right: 5px;
      margin-bottom: 5px;
    }
    .deleted {
      margin-left: 10px;
      text-decoration: line-through;
    }
    .arrow {
      margin: 0 7px;

      &.arrow-added {
        color: #4caf50;
      } 

      &.arrow-deleted {
        color: red;
      }
    }
    .ant-table-pagination.ant-pagination {
      text-align: center;
      float: none;
    }
    .ant-checkbox-group {
      background: var(--default-light);
      padding: 7px;
      display: none;

      &>div {
        padding: 2px 7px;
        margin: 4px 0;

        &:hover {
          background-color: var(--dark);
          .ant-checkbox {
            color: #f8f8f8;
          }
        }
      }
    }
    .filter-wrapper {
      display: flex;
      flex-direction: column;
      position: absolute;
      right: 20px;
      top: 10px;
      z-index: 10;
      align-items: flex-end;
      &:hover > .ant-checkbox-group {
        display: block;
      }
    }
`;
