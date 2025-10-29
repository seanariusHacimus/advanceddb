import { useMemo } from "react";
import { useLocale, withLocale } from "../../../utils/locale";
import { topics } from "../data/topics";
import { StyledTopicDetails } from "./TopicDetails.style";
import RadialBarChart from "../../UI/RadialBarChart";
import TopicHeader from "./components/TopicHeader";
import PillarFilter from "./components/PillarFilter";
import PillarDetails from "./components/PillarDetails";
import { useAccordionState } from "./hooks/useAccordionState";
import { usePillarSelection } from "./hooks/usePillarSelection";
import indicatorsData from "../data/kyrgyz_republic.json";
import PropTypes from "prop-types";
import { Collapse } from "antd";

const { Panel } = Collapse;

const TopicDetails = ({ match = null, history }) => {
  const [t] = useLocale();
  const { selectedPillar, selectPillarAndSyncUrl } =
    usePillarSelection(history);

  const topicDetails = useMemo(() => {
    const topicParam = match?.params?.topic;

    if (topicParam) {
      const topicName = topicParam
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const foundTopicData = topics[topicName];
      return foundTopicData || null;
    }
    return null;
  }, [match?.params?.topic]);

  console.log("selectedPillar", { selectedPillar });

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

  // Helper to map pillar id to roman for details filtering
  const mapPillarIdToRoman = (pillarId) => {
    if (pillarId === "pillar_i") return "I";
    if (pillarId === "pillar_ii") return "II";
    if (pillarId === "pillar_iii") return "III";
    return null;
  };

  const categoriesList = useMemo(() => {
    const allCategories = indicatorsData[topicDetails?.name]?.categories || [];

    if (!selectedPillar || selectedPillar === "all") {
      return allCategories;
    }
    // Each category and its subcategories have indicators attached to pillars (by roman numeral)
    // We filter categories/subcategories/indicators to those belonging to the selected pillar
    const roman = mapPillarIdToRoman(selectedPillar);

    return allCategories.filter((category) => category.pillarNumber === roman);
  }, [topicDetails?.name, selectedPillar]);

  console.log("categoriesList", categoriesList);

  const {
    expandedCategories,
    expandedSubcategories,
    expandedIndicators,
    toggleCategory,
    toggleSubcategory,
    toggleIndicator,
  } = useAccordionState(categoriesList, selectedPillar);

  if (!topicDetails) {
    return (
      <StyledTopicDetails>
        <TopicHeader onBackClick={handleBackClick} t={t} />
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>{t("Topic not found")}</h2>
          <p>{t("The requested topic could not be found.")}</p>
        </div>
      </StyledTopicDetails>
    );
  }

  return (
    <StyledTopicDetails>
      <TopicHeader
        onBackClick={handleBackClick}
        t={t}
        title={topicDetails.name}
        subtitle={""}
      />

      <div className="topic-section">
        <div className="chart-section">
          <div className="topic-description">
            <p>{t(topicDetails.description)}</p>
            <Collapse defaultActiveKey={["1"]} accordion>
              {topicDetails.pillars.map((pillar) => (
                <Panel header={t(pillar.name)} key={pillar.id}>
                  <p>{t(pillar.description)}</p>
                </Panel>
              ))}
            </Collapse>
          </div>
          <RadialBarChart
            pillars={topicDetails.pillars}
            overallScore={parseInt(topicDetails.score)}
            onPillarClick={handlePillarClick}
            selectedPillar={selectedPillar}
            topicName={topicDetails.name}
          />
        </div>
        <p>{t(topicDetails.summary)}</p>
      </div>

      <div className="category-section">
        <div className="category-header">
          <h3 className="category-title">{t("Topic Details")}</h3>
        </div>
        <PillarFilter
          pillars={topicDetails.pillars}
          selectedPillar={selectedPillar}
          onPillarSelect={selectPillarAndSyncUrl}
          showNextButton={false}
          t={t}
        />
        <PillarDetails
          categories={categoriesList}
          selectedPillar={selectedPillar}
          expandedCategories={expandedCategories}
          expandedSubcategories={expandedSubcategories}
          expandedIndicators={expandedIndicators}
          onToggleCategory={toggleCategory}
          onToggleSubcategory={toggleSubcategory}
          onToggleIndicator={toggleIndicator}
          t={t}
        />
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
};

export default withLocale(TopicDetails);
