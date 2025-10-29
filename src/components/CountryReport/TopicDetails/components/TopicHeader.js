import React from "react";
import styled from "styled-components";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { withLocale } from "../../../../utils/locale";
import PropTypes from "prop-types";

const HeaderContainer = styled.div`
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #e2e4ed;
  border-radius: 8px;
  color: #527bdd;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f9;
    border-color: #527bdd;
  }
`;

const TitleContainer = styled.div`
  flex: 1;
`;

const MainTitle = styled.h1`
  color: #527bdd;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  font-family: "Montserrat", sans-serif;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  color: #717a8f;
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  line-height: 1.4;
`;

const TopicHeader = ({
  onBackClick,
  t,
  isTitleVisible = true,
  title = "",
  subtitle = "",
}) => {
  return (
    <HeaderContainer>
      <BackButton onClick={onBackClick}>
        <ArrowLeftOutlined />
        {t("Back to Topics")}
      </BackButton>
      <TitleContainer>
        {isTitleVisible && (
          <>
            <MainTitle>{t(title)}</MainTitle>
            <Subtitle>{t(subtitle)}</Subtitle>
          </>
        )}
      </TitleContainer>
    </HeaderContainer>
  );
};

TopicHeader.propTypes = {
  onBackClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isTitleVisible: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default withLocale(TopicHeader);
