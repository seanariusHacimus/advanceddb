import styled from "styled-components";
import { colors } from "../constants";

export const SignInPlain = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${colors.background};
  text-align: center;

  #logo {
    display: block;
    margin-bottom: 70px;
  }

  .main-img {
    width: 80%;
    margin-bottom: 30px;
  }

  .inner-container {
    width: 100%;
    max-width: 400px;
    padding: 20px;
  }
`;

export const SignInPage = styled(SignInPlain)`
  align-items: stretch;

  #logo {
    margin-top: 80px;

    img {
      height: 70px;
    }
  }
  .inner-container {
    width: 100%;
    max-width: 490px;
    padding: 20px;
    margin: auto;
  }
`;

export const SignUp = styled(SignInPlain)`
  align-items: stretch;

  #logo {
    margin-top: 40px;
    margin-bottom: 40px;

    img {
      height: 70px;
    }
  }

  .inner-container {
    width: 100%;
    max-width: 720px;
    padding: 20px;
    margin: auto;
    margin-bottom: 80px;
  }

  .logo-wrapper {
    position: relative;
  }

  #sig-in-btn {
    position: absolute;
    left: 10px;
    display: flex;
    align-items: center;
    color: #717a8f;
  }

  /* .custom-select {
    & .ant-select-selection-item-content,
    & .ant-select-selection-item {
      background-color: transparent;
      border: none;
    }

    & .ant-select-selector {
      background-color: #fff !important;
    }
  } */
`;

export const Confirmation = styled.div`
  min-height: 100vh;
  padding-top: 50px;

  #logo {
    text-align: center;
    margin: auto;
    display: block;
    margin-bottom: 80px;
    
    img {
      height: 70px;
    }
  }

  .btn {
    padding: 8px 10px;
    height: 34px;
    background: #f3f3f4;
    border-radius: 5px;
    color: #252a32;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
  }
`;

export const RequestAccessPage = styled(SignUp)`
 
`;
