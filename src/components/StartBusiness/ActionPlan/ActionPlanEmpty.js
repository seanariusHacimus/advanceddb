import React from "react";
import { Skeleton, Row, Col } from "antd";
import { TitleH3 } from "../../../styles";
import { ChartTitle } from "../../../styles/graph";
import { ReactComponent as EmptyGraph } from "../../../assets/startBusiness/empty-graph.svg";
import { ReactComponent as IconArrow } from "../../../assets/startBusiness/arrow.svg";
import { ActionPlanEmpty } from "../../../styles/startBusiness";
import { indicatorStatus } from "../../../constants";
import { useLocale } from "../../../utils/locale";

const chartData = [
  {
    name: "completed",
    title: indicatorStatus.completed,
    value: 40,
    color: "#527BDD",
  },
  {
    name: "ongoing",
    title: indicatorStatus.ongoing_within_deadline,
    value: 23,
    color: "#F4D581",
  },
  {
    name: "ongoingPast",
    title: indicatorStatus.ongoing_past_deadline,
    value: 10,
    color: "#F4C9D9",
  },
  {
    name: "notStarted",
    title: indicatorStatus.not_started,
    value: 27,
    color: "#E5E7EF",
  },
];

export default function EmptyActionPlan(props) {
  const { actionPermissions } = props;
  const [t] = useLocale();
  return (
    <ActionPlanEmpty>
      <Row className="border-bottom">
        <Col xs={24} md={10} xl={8} className="col-left">
          <TitleH3 className="sub-title">
            {t("Overall progress of tasks")}
          </TitleH3>
          <Row>
            <Col span={24} lg={12}>
              <EmptyGraph width="100%" />
            </Col>
            <Col span={24} lg={12} className="pl-30" style={{ opacity: 0.2 }}>
              <Row>
                {chartData.map((item, index) => {
                  return (
                    <Col xs={12} lg={24} key={index}>
                      <ChartTitle>
                        <h3>
                          <span
                            className="label"
                            style={{ backgroundColor: item.color }}
                          ></span>
                          {item.title}
                        </h3>
                      </ChartTitle>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={14} xl={16} className="col-right">
          <TitleH3 className="sub-title">
            {t("Overall progress of tasks")}
          </TitleH3>
          <Row gutter={[20]}>
            <Col span={11}>
              <Skeleton paragraph={{ rows: 4 }} round title={null} />
            </Col>
            <Col span={11}>
              <Skeleton paragraph={{ rows: 4 }} round title={null} />
            </Col>
            <Col span={2}>
              <Skeleton paragraph={{ rows: 4 }} round title={null} />
            </Col>
          </Row>
        </Col>
      </Row>
      <div>
        {props.children}
        <div id="empty-table-wrapper">
          <Row gutter={[40]} style={{ opacity: 0.3, position: "relative" }}>
            <Col span={10}>
              <Skeleton paragraph={{ rows: 4 }} round title={null} />
            </Col>
            <Col span={4}>
              <Skeleton paragraph={{ rows: 4 }} round title={null} />
            </Col>
            <Col span={4}>
              <Skeleton paragraph={{ rows: 4 }} round title={null} />
            </Col>
            <Col span={4}>
              <Skeleton paragraph={{ rows: 4 }} round title={null} />
            </Col>
            <Col span={2}>
              <Skeleton paragraph={{ rows: 4 }} round title={null} />
            </Col>
          </Row>
          {/* <div id="empty-data-wrapper">
            <TitleH3>{t("There is nothing!")}</TitleH3>
            <p>{t("Create your first action plan")}</p>
          </div>
          {actionPermissions.create && <IconArrow id="arrow-icon" />} */}
        </div>
      </div>
    </ActionPlanEmpty>
  );
}
