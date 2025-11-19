import React from "react";
import styled from "styled-components";
import RadialBarChart from "../UI/RadialBarChart";

const TopicCardContainer = styled.div`
  background: hsl(var(--card));
  border-radius: 12px;
  padding: 20px;
  border: 1px solid hsl(var(--border));
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 200px;
  justify-content: space-between;

  &:hover {
    transform: translateY(-2px);
    border-color: hsl(var(--primary));
  }
`;

const TopicTitle = styled.h3`
  color: hsl(var(--primary));
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.3;
`;

const ChartContainer = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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
