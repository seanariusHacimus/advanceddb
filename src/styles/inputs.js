import styled from "styled-components";
import { colors } from "../constants";

export const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 10px 15px;
  background-color: #fff;
  color: ${colors.text};
  border-radius: 4px;
  border: 1px solid
    ${(props) => (props.hasErrors ? "var(--danger)" : colors.borderGrey)};
  font-size: 14px;

  &:focus {
    border: 1px solid ${colors.primary};
    outline: none;
  }
  &.dynamic-input {
    padding-bottom: 0px;
    color: ${colors.text};
    font-weight: 500;
  }
  &:disabled,
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: #f3f3f4;
    & + label {
      color: #717a8f;
    }
  }
  &.dynamic-input:focus {
    background-color: #fff;
  }
  &.dynamic-input + label {
    position: absolute;
    left: 15px;
    top: 18px;
    transition: 0.2s ease-out;
    font-weight: 500;
    text-align: left;
  }

  &.dynamic-input:focus + label,
  &.dynamic-input.has-value + label {
    top: 8px;
    transition: 0.2s;
    font-size: 12px;
    font-weight: normal;
    color: ${colors.textLight};
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: ${(props) => props.align || "center"};
  flex-direction: ${(props) => props.fd || "row"};
  position: relative;
  margin: ${(props) => props.margin || "15px 0"};

  &.has-messages {
    flex-direction: column;
  }
  .input-msg {
    color: var(--danger);
  }
  & .custom-select-label {
    text-align: left;
  }
  .custom-select {
    .ant-select-selector {
      padding: 0;
      font-size: 14px;
    }
    #action-title {
      padding: 0 15px;
    }

    &.ant-select-disabled {
      opacity: 0.5;
      background-color: #f3f3f4;
    }
    &.members .ant-select-selector {
      padding-top: 20px !important;
    }
    & .ant-select-selector {
      padding: 0;
      min-height: 56px !important;
      border-radius: 4px !important;
      background-color: red;
      text-align: left;
      display: flex;
      align-items: center;

      & .ant-select-selection-placeholder,
      & .ant-select-selection-item {
        opacity: 1;
        margin-top: auto;
        margin-bottom: auto;
        font-weight: 500;
        color: ${colors.text};
        padding: 0 15px;
        top: 0;
      }
      & .ant-select-selection-placeholder {
        font-weight: 500;
        color: ${colors.textLight};
        padding: 10px 15px;
      }
    }
    &.padding-0 .ant-select-selector .ant-select-selection-item {
      padding: 0;
    }
    & .ant-select-selection-search {
      display: flex;
      color: ${colors.text};
      font-weight: 500;
      left: 0;
      & .ant-select-selection-search-input {
        margin-top: auto !important;
        margin-bottom: auto !important;
        font-weight: 500;
        padding: 15px;
      }
    }
    &.ant-select-focused {
      & > .ant-select-selector {
        background-color: #fff;
      }
    }
    &.ant-select-auto-complete {
      .ant-select-selection-search-input {
        color: ${colors.textLight};
        padding: 0;
      }
    }
  }
  .custom-select.no-padding {
    .ant-select-selector .ant-select-selection-item {
      padding: 0 5px;
      font-size: 14px;
    }
    .ant-select-selection-placeholder {
      padding: 0 5px;
    }
  }
  .custom-datepicker {
    border-radius: 4px;
    & input {
      color: ${colors.text};
      font-weight: 500;
    }
    &.ant-picker {
      background-color: white;
    }
    &.ant-picker-focused {
      background-color: #fff;
    }
    &.large {
      width: 100%;
      height: 56px;
    }
  }
  .ant-select-item-empty {
    padding: 0;
  }
  .new-member {
    color: #fcfdff;
    padding: 7px 12px;

    .new-member-icon {
      color: #b2b2ba;
      margin-right: 5px;
    }
  }

  .grey {
    background-color: #fafbfc !important;
  }

  .password-toggler {
    font-size: 20px;
    position: relative;
    background: transparent;
    right: 30px;
    cursor: pointer;
  }
`;
