import styled from "styled-components";
import iconUser from "../assets/startBusiness/user.svg";

export { Input, InputWrapper } from "./inputs";
export { default as StyledEditor } from "./editor";
export { Title, TitleH1, TitleH3, Text } from "./typography";
export { Button, ButtonPrimary, ButtonSecondary } from "./buttons";

const Flex = styled.div`
  display: flex;
  flex-direction: ${(props) => props.fd || "row"};
  justify-content: ${(props) => props.jc || "flex-start"};
  align-items: ${(props) => props.ai || "center"};
  margin: ${(props) => props.margin || "0"};
  padding: ${(props) => props.padding || "0"};
  text-align: ${(props) => props.textAlign || "left"};
`;

const Avatar = styled.div`
  width: ${(props) => props.size || "32px"};
  height: ${(props) => props.size || "32px"};
  border-radius: ${(props) => props.radius || "50%"};
  background: url(${(props) => props.img || iconUser}) no-repeat center;
  background-size: cover;
  background-color: #e7e7e7;
  margin: ${(props) => props.margin || "0px"};
  display: inline-block;
  vertical-align: middle;
`;

const StyledAvatarInitials = styled.div`
  width: ${(props) => props.size || "35px"};
  height: ${(props) => props.size || "35px"};
  background: aliceblue;
  border-radius: 50%;
  font-weight: 700;
  letter-spacing: 0px;
  text-align: center;
  line-height: ${(props) => props.size || "35px"};
`;

export { Avatar, Flex, StyledAvatarInitials };
