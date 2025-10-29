import React, { useState } from "react";
import { Collapse, Progress } from "antd";
import { withLocale } from "../../../../utils/locale";
import PropTypes from "prop-types";
import {
  PillarContainer,
  StyledCollapse,
  CategoryHeader,
  CategoryTitle,
  CategoryScore,
  ScoreText,
  ProgressContainer,
  SubcategoryCollapse,
  IndicatorCollapse,
  IndicatorHeader,
  IndicatorName,
  IndicatorScore,
  IndicatorDetails,
  QuestionIcon,
} from "./PillarDetails.style";
import {
  CheckOutlined,
  CloseOutlined,
  MinusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { roundScore } from "../../utils";
import QuestionResponseModal from "./QuestionResponseModal";
import questionResponsesData from "../../data/kyrgyz_republic_question_responses.json";

const { Panel } = Collapse;

const STATUS_ICONS = {
  full: <CheckOutlined style={{ color: "#527bdd", marginRight: "4px" }} />,
  no: <CloseOutlined style={{ color: "#ff2100", marginRight: "4px" }} />,
  partial: <MinusOutlined style={{ color: "#ff8c00", marginRight: "4px" }} />,
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
  t,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndicatorId, setSelectedIndicatorId] = useState(null);

  const handleQuestionClick = (e, indicatorId) => {
    e.stopPropagation();
    setSelectedIndicatorId(indicatorId);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedIndicatorId(null);
  };

  const getQuestionData = (indicatorId) => {
    return questionResponsesData[indicatorId] || null;
  };

  return (
    <PillarContainer>
      <StyledCollapse
        className="category-collapse"
        activeKey={Object.keys(expandedCategories).filter(
          (key) => expandedCategories[key]
        )}
        onChange={(activeKeys) => {
          // Handle category expansion/collapse
          Object.keys(expandedCategories).forEach((key) => {
            if (activeKeys.includes(key) !== expandedCategories[key]) {
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
            <Panel
              key={categoryKey}
              header={
                <CategoryHeader>
                  <CategoryTitle>{t(category.name)}</CategoryTitle>
                  <CategoryScore>
                    <ProgressContainer>
                      <Progress
                        percent={progressPercent}
                        strokeColor="#527bdd"
                        showInfo={false}
                        strokeWidth={10}
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
              }
            >
              {Array.isArray(category.subCategories) && (
                <SubcategoryCollapse
                  activeKey={Object.keys(expandedSubcategories).filter(
                    (key) =>
                      key.startsWith(
                        `subcategory-${category.pillarNumber}-${category.id}`
                      ) && expandedSubcategories[key]
                  )}
                  className="subcategory-collapse"
                  onChange={(activeKeys) => {
                    // Handle subcategory expansion/collapse
                    Object.keys(expandedSubcategories).forEach((key) => {
                      if (
                        key.startsWith(
                          `subcategory-${category.pillarNumber}-${category.id}`
                        )
                      ) {
                        if (
                          activeKeys.includes(key) !==
                          expandedSubcategories[key]
                        ) {
                          onToggleSubcategory(key);
                        }
                      }
                    });
                  }}
                >
                  {category.subCategories.map((subCategory, subIndex) => {
                    const subCategoryKey = `subcategory-${category.pillarNumber}-${category.id}-${subCategory.id}-${subIndex}`;

                    return (
                      <Panel
                        key={subCategoryKey}
                        header={
                          <IndicatorHeader>
                            <IndicatorName>{t(subCategory.name)}</IndicatorName>
                            <CategoryScore>
                              <ProgressContainer width="100px">
                                <Progress
                                  percent={progressPercent}
                                  strokeColor="#527bdd"
                                  showInfo={false}
                                  strokeWidth={10}
                                />
                              </ProgressContainer>
                              <ScoreText>
                                {roundScore({
                                  obtained: subCategory.obtainedPoint,
                                  maximum: subCategory.maxPoint,
                                  delimiter: "/",
                                })}
                              </ScoreText>
                            </CategoryScore>
                          </IndicatorHeader>
                        }
                      >
                        {Array.isArray(subCategory.indicators) && (
                          <IndicatorCollapse
                            bordered={false}
                            activeKey={Object.keys(expandedIndicators).filter(
                              (key) =>
                                key.startsWith(
                                  `${category.pillarNumber}-${category.id}-${subCategory.id}`
                                ) && expandedIndicators[key]
                            )}
                            onChange={(activeKeys) => {
                              // Handle indicator expansion/collapse
                              Object.keys(expandedIndicators).forEach((key) => {
                                if (
                                  key.startsWith(
                                    `${category.pillarNumber}-${category.id}-${subCategory.id}`
                                  )
                                ) {
                                  if (
                                    activeKeys.includes(key) !==
                                    expandedIndicators[key]
                                  ) {
                                    onToggleIndicator(key);
                                  }
                                }
                              });
                            }}
                          >
                            {subCategory.indicators.map(
                              (indicator, indicatorIndex) => {
                                const indicatorKey = `${category.pillarNumber}-${category.id}-${subCategory.id}-${indicator.id}-${indicatorIndex}`;

                                return (
                                  <Panel
                                    key={indicatorKey}
                                    collapsible={false}
                                    bordered={false}
                                    showArrow={false}
                                    className="indicator-panel"
                                    header={
                                      <IndicatorHeader>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                          }}
                                        >
                                          <IndicatorName>
                                            {
                                              STATUS_ICONS[
                                                indicator.pointStatus
                                              ]
                                            }{" "}
                                            {t(indicator.name)}
                                          </IndicatorName>
                                          {questionResponsesData[
                                            indicator.id
                                          ] && (
                                            <QuestionIcon
                                              onClick={(e) =>
                                                handleQuestionClick(
                                                  e,
                                                  indicator.id
                                                )
                                              }
                                            >
                                              <QuestionCircleOutlined />
                                            </QuestionIcon>
                                          )}
                                        </div>
                                        <IndicatorScore>
                                          {roundScore({
                                            obtained: indicator.obtainedPoint,
                                            maximum: indicator.maxPoint,
                                            delimiter: "/",
                                          })}
                                        </IndicatorScore>
                                      </IndicatorHeader>
                                    }
                                  />
                                );
                              }
                            )}
                          </IndicatorCollapse>
                        )}
                      </Panel>
                    );
                  })}
                </SubcategoryCollapse>
              )}
            </Panel>
          );
        })}
      </StyledCollapse>

      <QuestionResponseModal
        visible={modalVisible}
        onClose={handleCloseModal}
        data={selectedIndicatorId ? getQuestionData(selectedIndicatorId) : null}
        indicatorId={selectedIndicatorId || ""}
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
  selectedPillar: PropTypes.string.isRequired,
  expandedCategories: PropTypes.object.isRequired,
  expandedSubcategories: PropTypes.object.isRequired,
  expandedIndicators: PropTypes.object.isRequired,
  onToggleCategory: PropTypes.func.isRequired,
  onToggleSubcategory: PropTypes.func.isRequired,
  onToggleIndicator: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withLocale(PillarDetails);
