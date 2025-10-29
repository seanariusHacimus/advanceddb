import { useState, useEffect } from "react";
import { withLocale } from "../../utils/locale";
import { topics } from "../CountryReport/data/topics";
import { StyledTopicDetails } from "./TopicDetails.style";
import RadialBarChart from "../UI/RadialBarChart";
import TopicHeader from "./components/TopicHeader";
import PillarFilter from "./components/PillarFilter";
import PillarDetails from "./components/PillarDetails";
import { useAccordionState } from "./hooks/useAccordionState";
import { usePillarSelection } from "./hooks/usePillarSelection";
import { indicatorsData } from "../CountryReport/data/indicatorsData";
import PropTypes from "prop-types";

const TopicDetails = ({ match, history, t }) => {
  const { selectedPillar, selectPillarAndSyncUrl } =
    usePillarSelection(history);
  const {
    expandedCategories,
    expandedSubcategories,
    toggleCategory,
    toggleSubcategory,
  } = useAccordionState();

  const topicDetails = useMemo(() => {
    const topicParam = match?.params?.topic;
    console.log("topicParam", topicParam);
    if (topicParam) {
      // Convert URL slug back to topic name
      const topicName = topicParam
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      console.log("topicName", topicName);
      return topics[topicName] || null;
    }
  }, [match?.params?.topic]);

  const handlePillarClick = (pillarId) => {
    if (selectedPillar === pillarId) {
      selectPillarAndSyncUrl("all");
    } else {
      selectPillarAndSyncUrl(pillarId);
    }
  };

  const handleBackClick = () => {
    if (history && typeof history.push === "function") {
      history.push("/dashboard/country-report");
    } else {
      console.warn("History object is not available for navigation");
    }
  };
  console.log("selectedPillar", { selectedPillar, topicDetails });

  if (!topicData) {
    return (
      <StyledTopicDetails>
        <TopicHeader onBackClick={handleBackClick} t={t} />
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>{t("Loading topic data...")}</h2>
        </div>
      </StyledTopicDetails>
    );
  }

  // Helper to map pillar id to roman for details filtering
  const mapPillarIdToRoman = (pillarId) => {
    if (pillarId === "pillar_i") return "I";
    if (pillarId === "pillar_ii") return "II";
    if (pillarId === "pillar_iii") return "III";
    return null;
  };

  const categoriesList = indicatorsData[topicData.name]?.categories || [];

  console.log("categoriesList", categoriesList);

  return (
    <StyledTopicDetails>
      <TopicHeader onBackClick={handleBackClick} t={t} />

      <div className="topic-section">
        <h2 className="topic-title">{t(topicData.name)}</h2>

        <div className="chart-section">
          <RadialBarChart
            pillars={topicData.pillars}
            overallScore={topicData.score}
            onPillarClick={handlePillarClick}
            selectedPillar={selectedPillar}
            topicName={topicData.name}
            history={history}
          />
        </div>

        <PillarFilter
          pillars={topicData.pillars}
          selectedPillar={selectedPillar}
          onPillarSelect={selectPillarAndSyncUrl}
          showNextButton={true}
          t={t}
        />
      </div>

      <div className="category-section">
        <div className="category-header">
          <h3 className="category-title">{t("Topic Details")}</h3>
        </div>

        {topicDetails ? (
          <PillarDetails
            key={pillar.pillar_number}
            pillar={pillar}
            selectedPillar={selectedPillar}
            expandedCategories={expandedCategories}
            expandedSubcategories={expandedSubcategories}
            onToggleCategory={toggleCategory}
            onToggleSubcategory={toggleSubcategory}
            t={t}
          />
        ) : (
          <div className="subcategory-item">
            <div className="subcategory-header">
              <div className="subcategory-title">
                {t("No details available")}
              </div>
            </div>
          </div>
        )}
      </div>
    </StyledTopicDetails>
  );
};

TopicDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      topic: PropTypes.string,
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

TopicDetails.defaultProps = {
  match: null,
};

export default withLocale(TopicDetails);
