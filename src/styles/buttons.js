import styled from "styled-components";
import { colors } from "../constants";

export const Button = styled.button`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "51px"};
  padding: ${(props) => props.padding || "10px"};
  margin: ${(props) => props.margin || "0"};
  background-color: ${(props) => props.bg || colors.defaultLight};
  border: none;
  border-radius: 5px;
  font-size: 14px;
  line-height: 17px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:disabled,
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  img,
  svg {
    margin-right: 5px;
  }
  &:hover {
    background-color: ${colors.defaultDark};
  }

  &.medium {
    height: 41px;
  }

  &.small {
    height: 34px;
  }
  &.transparent {
    background-color: transparent;
    border: 1px solid var(--border-grey);
  }
  &.transparent:hover {
    background-color: #f3f3f4;
    border: 1px solid #8f96a5;
  }
`;

export const ButtonPrimary = styled(Button)`
  height: 51px;
  background-color: ${colors.primary};
  border-color: ${colors.primary};
  color: #fff;
  font-weight: 600;
  &:hover {
    background-color: #3963c7;
  }
  &:focus {
    background-color: var(--dark-blue);
  }
  &:disabled,
  &[disabled] {
    cursor: not-allowed;
    background-color: #527bdd;
  }
`;

export const ButtonSecondary = styled(Button)`
  height: 51px;
  background-color: #f3f3f4;
  border-color: none;
  color: #252a32;
  font-weight: 600;

  ${(props) =>
    props.size === "small" &&
    ` 
    padding: 8px 10px;
    height: 34px;
    font-weight: 500;
  `}
  &:hover {
    background-color: ${colors.primaryDark};
  }
  &.transparent:hover {
    background-color: #535263;
    color: #fff;
    border: 1px solid var(--border-grey);
  }
`;

export const ButtonAlternative = styled(Button)`
  height: ${(props) => (props.size === "small" ? "34px" : "51px")};
  background-color: #fff;
  border: 1px solid #d6d9e4;
  color: #828a9d;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f3f3f4;
    border: 1px solid #8f96a5;
    transition: all 0.3s ease;
  }
`;
