import { useMemo, useState } from "react";
import { useLocale, withLocale } from "../../../utils/locale";
import { StyledTopicDetails } from "./TopicDetails.style";
import RadialBarChart from "../../UI/RadialBarChart";
import TopicHeader from "./components/TopicHeader";
import PillarFilter from "./components/PillarFilter";
import PillarDetails from "./components/PillarDetails";
import { useAccordionState } from "./hooks/useAccordionState";
import { usePillarSelection } from "./hooks/usePillarSelection";
import PropTypes from "prop-types";
import { Collapse, Spin, Alert, Button } from "antd";
import { useTopicData } from "../hooks/useTopicData";
import constants from "../../../constants";
import { getCountryNameFromCode } from "../utils";
import { TOPIC_DESCRIPTIONS } from "../constants";
import styled from "styled-components";

const { Panel } = Collapse;
const DEFAULT_COUNTRY_CODE = constants.defaultCountry.code;

const DescriptionText = styled.p`
  margin: 0;
  line-height: 1.6;
  color: #252a32;
`;

const MoreButton = styled(Button)`
  margin-top: 12px;
  color: #527bdd;
  border-color: #527bdd;
  padding: 4px 16px;
  font-weight: 500;

  &:hover {
    background: #f3f4f9;
    border-color: #527bdd;
    color: #527bdd;
  }
`;

const truncateText = (text, wordLimit = 100) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

const TopicDetails = ({ match = null, history }) => {
  const [t] = useLocale();
  const countryCodeParam = new URLSearchParams(window.location.search).get(
    "country_code"
  );
  const [countryCode] = useState(countryCodeParam || DEFAULT_COUNTRY_CODE);
  const countryName = useMemo(
    () => getCountryNameFromCode(countryCode),
    [countryCode]
  );

  const { selectedPillar, selectPillarAndSyncUrl } =
    usePillarSelection(history);

  const topicName = useMemo(() => {
    const topicParam = match?.params?.topic;
    if (topicParam) {
      return topicParam
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return null;
  }, [match?.params?.topic]);

  const {
    data: topicData,
    loading,
    error,
  } = useTopicData(countryCode, topicName);

  const mapPillarIdToRoman = (pillarId) => {
    const map = {
      pillar_i: "I",
      pillar_ii: "II",
      pillar_iii: "III",
    };
    return map[pillarId] || null;
  };

  const { topicDetails, categoriesList } = useMemo(() => {
    if (!topicData || !topicName) {
      return { topicDetails: null, categoriesList: [] };
    }

    const categoriesWithRecalculatedScores = JSON.parse(
      JSON.stringify(topicData.categories || [])
    );

    categoriesWithRecalculatedScores.forEach((category) => {
      let categoryObtainedPoints = 0;
      if (Array.isArray(category.subCategories)) {
        category.subCategories.forEach((subCategory) => {
          let subCategoryObtainedPoints = 0;
          if (Array.isArray(subCategory.indicators)) {
            subCategory.indicators.forEach((indicator) => {
              subCategoryObtainedPoints += indicator.obtainedPoint;
            });
          }
          subCategory.obtainedPoint = subCategoryObtainedPoints;
          categoryObtainedPoints += subCategory.obtainedPoint;
        });
      }
      category.obtainedPoint = categoryObtainedPoints;
    });

    const pillarGroups = {};
    categoriesWithRecalculatedScores.forEach((category) => {
      const pillarNum = category.pillarNumber;
      if (!pillarGroups[pillarNum]) {
        pillarGroups[pillarNum] = {
          categories: [],
          totalMax: 0,
          totalObtained: 0,
        };
      }
      pillarGroups[pillarNum].categories.push(category);
      pillarGroups[pillarNum].totalMax += category.maxPoint;
      pillarGroups[pillarNum].totalObtained += category.obtainedPoint;
    });

    const pillars = Object.entries(pillarGroups).map(([pillarNum, data]) => {
      const pillarNames = {
        I: "Pillar I - Regulatory Framework",
        II: "Pillar II - Public Services",
        III: "Pillar III - Operational Efficiency",
      };
      const pillarId = `pillar_${pillarNum.toLowerCase()}`;
      const score =
        data.totalMax > 0
          ? Math.round((data.totalObtained / data.totalMax) * 100)
          : 0;
      return {
        id: pillarId,
        name: pillarNames[pillarNum] || `Pillar ${pillarNum}`,
        score: score.toString(),
        description: "",
      };
    });

    const totalMax = Object.values(pillarGroups).reduce(
      (sum, p) => sum + p.totalMax,
      0
    );
    const totalObtained = Object.values(pillarGroups).reduce(
      (sum, p) => sum + p.totalObtained,
      0
    );
    const overallScore =
      totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

    const finalTopicDetails = {
      name: topicName,
      score: overallScore.toString(),
      pillars: pillars,
      description: "",
      summary: "",
    };

    let finalCategoriesList;
    if (!selectedPillar || selectedPillar === "all") {
      finalCategoriesList = categoriesWithRecalculatedScores;
    } else {
      const roman = mapPillarIdToRoman(selectedPillar);
      finalCategoriesList = categoriesWithRecalculatedScores.filter(
        (category) => category.pillarNumber === roman
      );
    }

    return {
      topicDetails: finalTopicDetails,
      categoriesList: finalCategoriesList,
    };
  }, [topicData, topicName, selectedPillar]);

  const handlePillarClick = (pillarId) => {
    selectPillarAndSyncUrl(selectedPillar === pillarId ? "all" : pillarId);
  };

  const handleBackClick = () => {
    if (history && typeof history.push === "function") {
      const urlParams = new URLSearchParams(window.location.search);
      const countryCode = urlParams.get("country_code") || DEFAULT_COUNTRY_CODE;
      history.push(`/dashboard/country-report?country_code=${countryCode}`);
    }
  };

  const {
    expandedCategories,
    expandedSubcategories,
    expandedIndicators,
    toggleCategory,
    toggleSubcategory,
    toggleIndicator,
  } = useAccordionState(categoriesList, selectedPillar);

  const [showFullDescription, setShowFullDescription] = useState(false);

  const topicDescription = useMemo(() => {
    if (!topicName) return "";
    return TOPIC_DESCRIPTIONS[topicName]?.description || "";
  }, [topicName]);

  const displayedDescription = useMemo(() => {
    if (!topicDescription) return "";
    if (showFullDescription || topicDescription.split(/\s+/).length <= 50) {
      return topicDescription;
    }
    return truncateText(topicDescription, 50);
  }, [topicDescription, showFullDescription]);

  const shouldShowMoreButton = useMemo(() => {
    return topicDescription && topicDescription.split(/\s+/).length > 50;
  }, [topicDescription]);

  if (loading) {
    return (
      <StyledTopicDetails>
        <TopicHeader onBackClick={handleBackClick} t={t} />
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <p style={{ marginTop: "20px" }}>{t("Loading topic data...")}</p>
        </div>
      </StyledTopicDetails>
    );
  }

  if (error) {
    return (
      <StyledTopicDetails>
        <TopicHeader onBackClick={handleBackClick} t={t} />
        <Alert
          message={t("Error")}
          description={error}
          type="error"
          showIcon
          style={{ margin: "20px" }}
        />
      </StyledTopicDetails>
    );
  }

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
        subtitle={countryName}
      />

      <div className="topic-section">
        <div className="chart-section">
          <div className="topic-description">
            <Collapse defaultActiveKey={["1"]} accordion bordered={false}>
              <Panel header={t("Topic Description")} key="1">
                <DescriptionText
                  dangerouslySetInnerHTML={{ __html: displayedDescription }}
                />
                {shouldShowMoreButton && (
                  <MoreButton
                    type="default"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? t("Show Less") : t("Show More")}
                  </MoreButton>
                )}
              </Panel>
            </Collapse>
          </div>
          <RadialBarChart
            pillars={topicDetails.pillars}
            overallScore={parseInt(topicDetails.score)}
            onPillarClick={handlePillarClick}
            selectedPillar={selectedPillar}
            topicName={topicDetails.name}
            chartSize={300}
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
          topicName={topicName}
          onToggleSubcategory={toggleSubcategory}
          onToggleIndicator={toggleIndicator}
          t={t}
          countryName={countryName}
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
