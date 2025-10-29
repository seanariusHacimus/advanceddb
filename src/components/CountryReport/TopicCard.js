import React from "react";
import styled from "styled-components";
import RadialBarChart from "../UI/RadialBarChart";

const TopicCardContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e4ed;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 200px;
  justify-content: space-between;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #527bdd;
  }
`;

const TopicTitle = styled.h3`
  color: #527bdd;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
  font-family: "Montserrat", sans-serif;
  line-height: 1.3;
`;

const ChartContainer = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TopicCard = ({
  topic,
  onTopicClick,
  showChart = true,
  compact = false,
}) => {
  const handleClick = () => {
    if (onTopicClick) {
      onTopicClick(topic.name);
    }
  };

  return (
    <TopicCardContainer>
      {showChart && !compact && (
        <ChartContainer>
          <RadialBarChart
            pillars={topic.pillars}
            overallScore={parseInt(topic.score)}
            topicName={topic.name}
          />
        </ChartContainer>
      )}
      <TopicTitle onClick={handleClick}>{topic.name}</TopicTitle>
    </TopicCardContainer>
  );
};

export default TopicCard;
