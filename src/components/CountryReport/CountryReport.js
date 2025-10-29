import React, { useState } from "react";
import { withLocale } from "../../utils/locale";
import { StyledCountryReport } from "./CountryReport.style";
import { topics } from "./data/topics";
import TopicCard from "./TopicCard";
import Legend from "../UI/Legend";

const CountryReport = ({ history, t }) => {
  const [topicsData] = useState(topics);

  const handleTopicClick = (topicName) => {
    // Convert topic name to URL-friendly format
    const topicSlug = topicName.toLowerCase().replace(/\s+/g, "-");
    history.push(`/dashboard/topic/${topicSlug}`);
  };

  return (
    <StyledCountryReport>
      <div className="header-section">
        <h1 className="main-title">
          {t("World Bank Business Regulation Report")}
        </h1>
        <p className="subtitle">
          {t("Interactive Data Visualization and Analysis")}
        </p>
      </div>

      <Legend t={t} />

      <div className="topic-scores-section">
        <h2 className="section-title">{t("Topic Scores")}</h2>
        <div className="scores-grid">
          {Object.values(topicsData).map((topic, index) => (
            <TopicCard
              key={index}
              topic={topic}
              onTopicClick={handleTopicClick}
              showChart={true}
              history={history}
            />
          ))}
        </div>
      </div>
    </StyledCountryReport>
  );
};

export default withLocale(CountryReport);
