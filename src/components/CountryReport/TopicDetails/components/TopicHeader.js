import React from "react";
import styled from "styled-components";
import { ArrowLeft } from "lucide-react";
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
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  color: hsl(var(--primary));
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: hsl(var(--accent));
    border-color: hsl(var(--primary));
  }
`;

const TitleContainer = styled.div`
  flex: 1;
`;

const MainTitle = styled.h1`
  color: hsl(var(--primary));
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  transition: color 0.3s ease;
`;

const Subtitle = styled.p`
  color: hsl(var(--muted-foreground));
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  line-height: 1.4;
  transition: color 0.3s ease;
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
        <ArrowLeft size={18} />
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
