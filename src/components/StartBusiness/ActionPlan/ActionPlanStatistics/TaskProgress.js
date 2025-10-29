import React from "react";
import { Col, List, Progress, Collapse, Row, Typography } from "antd";
import PropTypes from "prop-types";
import { TitleH3, ButtonSecondary } from "../../../../styles";
import { withLocale } from "../../../../utils/locale";
import { TaskProgressContainer } from "./ActionPlanStatistics.style";

const { Panel } = Collapse;
const INITIAL_ITEMS_TO_SHOW = 3;

const TaskProgress = ({ actions, collapseActive, onToggleCollapse, t }) => {
  return (
    <Col xs={24} md={8} lg={9} className="col-middle">
      <div className="inner-block">
        <TitleH3 className="sub-title" style={{ marginBottom: 8 }}>
          {t("Task progress")}
        </TitleH3>
        <TaskProgressContainer>
          <List
            itemLayout="horizontal"
            dataSource={actions.slice(0, INITIAL_ITEMS_TO_SHOW)}
            className={`progress-toggle ${collapseActive ? "show" : "hide"}`}
            renderItem={(item) => {
              const { total, completed } = item.sub_action_stats;
              let percent = parseInt((completed / total) * 100, 10);

              if (!total && item.status === "completed") {
                percent = 100;
              }

              return (
                <List.Item>
                  <Row style={{ width: "100%" }} gutter={[20]}>
                    <Col span={12}>
                      <Typography.Text
                        ellipsis={{ tooltip: true }}
                        className="progress-title"
                      >
                        {item.name}
                      </Typography.Text>
                    </Col>
                    <Col span={12}>
                      <Progress
                        trailColor="#ECEEF4"
                        strokeColor="#6B91EC"
                        strokeWidth={13}
                        percent={percent}
                        format={(percent) => percent + "%"}
                      />
                    </Col>
                  </Row>
                </List.Item>
              );
            }}
          />
          <Collapse
            activeKey={[collapseActive ? "statistics" : null]}
            bordered={false}
            className="custom-collapse"
          >
            <Panel key={"statistics"} showArrow={false}>
              <List
                itemLayout="horizontal"
                dataSource={actions.slice(
                  INITIAL_ITEMS_TO_SHOW,
                  actions.length
                )}
                className={`progress-toggle`}
                renderItem={(item) => {
                  const { total, completed } = item.sub_action_stats;
                  let percent = parseInt((completed / total) * 100, 10);

                  if (!total && item.status === "completed") {
                    percent = 100;
                  }

                  return (
                    <List.Item>
                      <Row style={{ width: "100%" }} gutter={[20]}>
                        <Col span={12}>
                          <Typography.Text
                            ellipsis={{ tooltip: true }}
                            className="progress-title"
                          >
                            {item.name}
                          </Typography.Text>
                        </Col>
                        <Col span={12}>
                          <Progress
                            trailColor="#ECEEF4"
                            strokeColor="#6B91EC"
                            strokeWidth={13}
                            percent={percent}
                            format={(percent) => percent + "%"}
                          />
                        </Col>
                      </Row>
                    </List.Item>
                  );
                }}
              />
            </Panel>
          </Collapse>
          {actions.length > INITIAL_ITEMS_TO_SHOW && (
            <div className="text-center">
              <ButtonSecondary
                type="text"
                className="transparent small"
                style={{
                  width: "auto",
                  margin: "auto",
                  fontWeight: "400",
                  marginBottom: 15,
                  marginTop: 10,
                }}
                onClick={onToggleCollapse}
              >
                {collapseActive ? t("Show Less") : t("Show all")}
              </ButtonSecondary>
            </div>
          )}
        </TaskProgressContainer>
      </div>
    </Col>
  );
};

TaskProgress.propTypes = {
  actions: PropTypes.array.isRequired,
  collapseActive: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default withLocale(TaskProgress);
