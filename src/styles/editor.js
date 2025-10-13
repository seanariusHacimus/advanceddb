import styled from "styled-components";

export const StyledEditor = styled.div`
  #quill-editor {
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid #ccc;
    margin-bottom: 8px;

    & .ql-toolbar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 1;
      background-color: #fff;
    }

    & .ql-container {
      padding-top: 16px;
      padding-bottom: 50px;
      width: 100%;
      overflow: auto;
      height: ${({ height }) => `${height}px`};
      border-bottom: none;
      scrollbar-color: #527bdd white;
      scrollbar-width: thin;
    }
  }
`;

export default StyledEditor;
