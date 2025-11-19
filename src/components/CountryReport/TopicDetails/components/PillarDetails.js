import React, { useState } from "react";
import styled from "styled-components";
import { withLocale } from "../../../../utils/locale";
import PropTypes from "prop-types";
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent,
  Progress 
} from "../../../UI/shadcn";
import {
  Check,
  X,
  Minus,
  HelpCircle,
} from "lucide-react";
import { roundScore } from "../../utils";
import QuestionResponseModal from "./QuestionResponseModal";
import { useIndicatorExpertResponses } from "../../hooks/useIndicatorExpertResponses";
import questionResponsesData from "../../data/kyrgyz_republic_question_responses.json";

const PillarContainer = styled.div`
  margin-bottom: 20px;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 20px;
`;

const CategoryTitle = styled.div`
  color: hsl(var(--foreground));
  font-size: 16px;
  font-weight: 600;
  flex: 1;
`;

const CategoryScore = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const ScoreText = styled.div`
  color: hsl(var(--primary));
  font-size: 14px;
  font-weight: 600;
  min-width: 80px;
  text-align: right;
`;

const ProgressContainer = styled.div`
  width: ${(props) => props.$width || "150px"};
  flex-shrink: 0;
`;

const SubcategoryContainer = styled.div`
  margin-top: 12px;
`;

const IndicatorContainer = styled.div`
  margin-top: 8px;
  padding-left: 8px;
`;

const IndicatorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 12px;
  padding: 12px 16px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  margin-bottom: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: hsl(var(--accent) / 0.5);
    border-color: hsl(var(--primary) / 0.5);
  }
`;

const IndicatorName = styled.div`
  color: hsl(var(--foreground));
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const IndicatorScore = styled.div`
  color: hsl(var(--primary));
  font-size: 13px;
  font-weight: 600;
  min-width: 80px;
  text-align: right;
`;

const QuestionIcon = styled.span`
  cursor: pointer;
  color: hsl(var(--primary));
  font-size: 16px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  &:hover {
    color: hsl(var(--primary) / 0.8);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StatusIconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
`;

const STATUS_ICONS = {
  full: <Check size={14} style={{ color: "hsl(221 83% 53%)" }} />,
  no: <X size={14} style={{ color: "hsl(0 84% 60%)" }} />,
  partial: <Minus size={14} style={{ color: "hsl(25 95% 53%)" }} />,
};

const PillarDetails = ({
  categories = [],
  selectedPillar,
  expandedCategories,
  expandedSubcategories,
  expandedIndicators,
  onToggleCategory,
  onToggleSubcategory,
  onToggleIndicator,
  countryName,
  topicName,
  t,
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const countryCode = urlParams.get("country_code");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndicatorId, setSelectedIndicatorId] = useState(null);

  const { data: expertData, loading: expertLoading } =
    useIndicatorExpertResponses(countryCode, selectedIndicatorId, topicName);

  const handleQuestionClick = (e, indicatorId) => {
    e.stopPropagation();

    if (questionResponsesData[indicatorId]) {
      setSelectedIndicatorId(indicatorId);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedIndicatorId(null);
  };

  // Convert expanded states to accordion format
  const categoryValues = Object.keys(expandedCategories).filter(
    (key) => expandedCategories[key]
  );

  const subcategoryValues = Object.keys(expandedSubcategories).filter(
    (key) => expandedSubcategories[key]
  );

  const indicatorValues = Object.keys(expandedIndicators).filter(
    (key) => expandedIndicators[key]
  );

  return (
    <PillarContainer>
      <Accordion
        type="multiple"
        value={categoryValues}
        onValueChange={(newValues) => {
          // Determine which categories were toggled
          Object.keys(expandedCategories).forEach((key) => {
            const wasExpanded = expandedCategories[key];
            const isExpanded = newValues.includes(key);
            if (wasExpanded !== isExpanded) {
              onToggleCategory(key);
            }
          });
        }}
      >
        {categories.map((category, index) => {
          const categoryKey = `category-${category.pillarNumber}-${category.id}-${index}`;
          const progressPercent = category.maxPoint
            ? (category.obtainedPoint / category.maxPoint) * 100
            : 0;

          return (
            <AccordionItem key={categoryKey} value={categoryKey}>
              <AccordionTrigger asChild>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 20px', cursor: 'pointer' }}>
                  <CategoryHeader>
                    <CategoryTitle>{t(category.name)}</CategoryTitle>
                    <CategoryScore>
                      <ProgressContainer $width="150px">
                        <Progress
                          value={progressPercent}
                          color="hsl(var(--primary))"
                          thickness={10}
                          format={() => null}
                        />
                      </ProgressContainer>
                      <ScoreText>
                        {roundScore({
                          obtained: category.obtainedPoint,
                          maximum: category.maxPoint,
                          delimiter: "/",
                        })}
                      </ScoreText>
                    </CategoryScore>
                  </CategoryHeader>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {Array.isArray(category.subCategories) && (
                  <SubcategoryContainer>
                    <Accordion
                      type="multiple"
                      value={subcategoryValues.filter(key => 
                        key.startsWith(`subcategory-${category.pillarNumber}-${category.id}`)
                      )}
                      onValueChange={(newValues) => {
                        // Determine which subcategories were toggled
                        Object.keys(expandedSubcategories).forEach((key) => {
                          if (key.startsWith(`subcategory-${category.pillarNumber}-${category.id}`)) {
                            const wasExpanded = expandedSubcategories[key];
                            const isExpanded = newValues.includes(key);
                            if (wasExpanded !== isExpanded) {
                              onToggleSubcategory(key);
                            }
                          }
                        });
                      }}
                    >
                      {category.subCategories.map((subCategory, subIndex) => {
                        const subCategoryKey = `subcategory-${category.pillarNumber}-${category.id}-${subCategory.id}-${subIndex}`;
                        const subProgressPercent = subCategory.maxPoint
                          ? (subCategory.obtainedPoint / subCategory.maxPoint) * 100
                          : 0;

                        return (
                          <AccordionItem key={subCategoryKey} value={subCategoryKey}>
                            <AccordionTrigger asChild>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', cursor: 'pointer' }}>
                                <IndicatorName>{t(subCategory.name)}</IndicatorName>
                                <CategoryScore>
                                  <ProgressContainer $width="100px">
                                    <Progress
                                      value={subProgressPercent}
                                      color="hsl(var(--primary))"
                                      thickness={8}
                                      format={() => null}
                                    />
                                  </ProgressContainer>
                                  <ScoreText style={{ minWidth: '60px' }}>
                                    {roundScore({
                                      obtained: subCategory.obtainedPoint,
                                      maximum: subCategory.maxPoint,
                                      delimiter: "/",
                                    })}
                                  </ScoreText>
                                </CategoryScore>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              {Array.isArray(subCategory.indicators) && (
                                <IndicatorContainer>
                                  {subCategory.indicators.map(
                                    (indicator, indicatorIndex) => {
                                      const indicatorKey = `${category.pillarNumber}-${category.id}-${subCategory.id}-${indicator.id}-${indicatorIndex}`;

                                      return (
                                        <IndicatorHeader key={indicatorKey}>
                                          <IndicatorName>
                                            <StatusIconWrapper>
                                              {STATUS_ICONS[indicator.pointStatus]}
                                            </StatusIconWrapper>
                                            {t(indicator.name)}
                                            {questionResponsesData[indicator.id] && (
                                              <QuestionIcon
                                                onClick={(e) =>
                                                  handleQuestionClick(e, indicator.id)
                                                }
                                              >
                                                <HelpCircle size={16} />
                                              </QuestionIcon>
                                            )}
                                          </IndicatorName>
                                          <IndicatorScore>
                                            {roundScore({
                                              obtained: indicator.obtainedPoint,
                                              maximum: indicator.maxPoint,
                                              delimiter: "/",
                                            })}
                                          </IndicatorScore>
                                        </IndicatorHeader>
                                      );
                                    }
                                  )}
                                </IndicatorContainer>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </SubcategoryContainer>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <QuestionResponseModal
        visible={modalVisible}
        onClose={handleCloseModal}
        loading={expertLoading}
        indicatorId={selectedIndicatorId || ""}
        countryName={countryName}
        data={selectedIndicatorId ? expertData : null}
      />
    </PillarContainer>
  );
};

PillarDetails.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      pillarNumber: PropTypes.string.isRequired,
      maxPoint: PropTypes.number.isRequired,
      obtainedPoint: PropTypes.number.isRequired,
      subCategories: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          maxPoint: PropTypes.number.isRequired,
          obtainedPoint: PropTypes.number.isRequired,
          pointStatus: PropTypes.string.isRequired,
          indicators: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
              maxPoint: PropTypes.number.isRequired,
              obtainedPoint: PropTypes.number.isRequired,
              pointStatus: PropTypes.string.isRequired,
            })
          ),
        })
      ),
    })
  ).isRequired,
  topicName: PropTypes.string.isRequired,
  selectedPillar: PropTypes.string.isRequired,
  expandedCategories: PropTypes.object.isRequired,
  expandedSubcategories: PropTypes.object.isRequired,
  expandedIndicators: PropTypes.object.isRequired,
  onToggleCategory: PropTypes.func.isRequired,
  onToggleSubcategory: PropTypes.func.isRequired,
  onToggleIndicator: PropTypes.func.isRequired,
  countryName: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withLocale(PillarDetails);
