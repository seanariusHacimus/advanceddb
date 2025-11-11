import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row, Col, Empty } from "../UI/shadcn";
import DashboardPage from "../../styles/dashboard";
import { TitleH3, Flex } from "../../styles";
import { ReactComponent as RightArrow } from "../../assets/dashboard/right-arrow.svg";
import { ProgressBar, ChartTitle } from "../../styles/graph";
import moment from "moment";
import styled from "styled-components";

import AreaChart from "./AreaChart";
import DonutChart from "./DonutChart";
import BarChart from "./BarChart";
import { getDonutChartData } from "../../utils/statisticsCalculator";
import constants from "../../constants";
import Print from "../../components/UI/Printer";
import { useLocale } from "../../utils/locale";
import PrintDashboardToFile from "../UI/PrintDashboardToFile";
import { fetchStatistics } from "./utils";
import { CountryReportPillars } from "../../data";
import { RadialBarChart } from "../UI";
import { noop } from "lodash";
import { Card, CardContent, CardFooter } from "../UI/shadcn/card";
import { Progress as ShProgress } from "../UI/shadcn/progress";
import { Button as ShButton, Badge } from "../UI/shadcn";

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 200px;
  color: #717a8f;
  text-align: center;
`;

const NoDataMessage = styled.p`
  margin-top: 16px;
  font-size: 16px;
  color: #717a8f;
`;

const chartData = (t) => [
  {
    name: "completed",
    title: t("Completed tasks"),
    count: 0,
    color: "#527BDD",
  },
  {
    name: "ongoing",
    title: t("In Progress"),
    count: 0,
    color: "#F4D581",
  },
  {
    name: "ongoingPast",
    title: t("Past Due"),
    count: 0,
    color: "#F4C9D9",
  },
  {
    name: "notStarted",
    title: t("Not started"),
    count: 0,
    color: "#E5E7EF",
  },
  {
    name: "onreview",
    title: t("Under Review"),
    count: 0,
    color: "##f3f3f3",
  },
];

const Dashboard = () => {
  const history = useHistory();
  const [t] = useLocale();

  // Get current country from settings
  const currentCountryCode = constants.defaultCountry.code;
  const currentCountryName = constants.defaultCountry.name;
  const currentCountryPillars = useMemo(() => {
    return CountryReportPillars.find(
      (pillar) => pillar.EconomyCode === currentCountryCode
    );
  }, [currentCountryCode]);

  // Get indicators from Redux store
  const indicators = useSelector((state) => state.workingGroups.data);
  const [state, setState] = useState({
    actions: {
      total: 1,
    },
    db_score_and_rank: {
      rank: 0,
      score: 0,
    },
    indicators: [],
    period: [],
    workingGroups: [],
  });

  const printRef = useRef();

  useEffect(() => {
    fetchStatistics().then((res) => {
      setState((prevState) => ({ ...prevState, ...res }));
    });
  }, []);

  useEffect(() => {
    if (indicators) {
      setState((prevState) => ({ ...prevState, indicators }));
    }
  }, [indicators]);

  const redirectToReportPage = () => {
    history.push(
      `/dashboard/country-report?country_code=${currentCountryCode}`
    );
  };

  const { actions, period, workingGroups } = state;
  const pillars = useMemo(() => {
    if (!currentCountryPillars || !currentCountryPillars.data) {
      return [];
    }
    return currentCountryPillars.data.map((pillar, index) => ({
      id: `pillar_${index === 0 ? "i" : index === 1 ? "ii" : "iii"}`,
      name: pillar.DataPointName,
      score: pillar.Score,
    }));
  }, [currentCountryPillars]);

  let chart = chartData(t);

  if (actions) {
    chart = getDonutChartData(actions);
  }

  return (
    <DashboardPage ref={printRef} id="dashboard">
      <Flex jc="space-between" align="center" margin="0 0 10px" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TitleH3 style={{ margin: 0 }}>{t("Dashboard")}</TitleH3>
          <Badge variant="success" size="sm">shadcn/ui</Badge>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ShButton 
            variant="outline" 
            size="sm"
            onClick={() => history.push('/dashboard/components')}
          >
            🎨 Components
          </ShButton>
          <PrintDashboardToFile page="dashboard" />
          <Print
            ref={printRef.current}
            orientation="portrait"
            style={{ marginLeft: 10 }}
          />
        </div>
      </Flex>
      <Row style={{ marginBottom: 24 }}>
        <Col className="col-left" xs={24} md={8} xl={8}>
          <div className="inner-block col-left">
            <TitleH3>
              {t("How business ready is")} <b>{currentCountryName}</b>
              {t("?")}
            </TitleH3>
            <Card style={{ marginTop: 16 }} className="info">
              <CardContent>
                {!currentCountryPillars ||
                !currentCountryPillars.data ||
                pillars.length === 0 ? (
                  <NoDataContainer>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <NoDataMessage>
                          {t(`No data available for ${currentCountryName}`)}
                        </NoDataMessage>
                      }
                    />
                  </NoDataContainer>
                ) : (
                  <RadialBarChart
                    id="dashboard-radial-bar-chart"
                    pillars={pillars}
                    showOverallScore={false}
                    onPillarClick={redirectToReportPage}
                    topicName=""
                  />
                )}
              </CardContent>
              {currentCountryPillars?.PDF_URL ? (
                <CardFooter>
                  <a
                    target="_blank"
                    className="content"
                    rel="noopener noreferrer"
                    href={currentCountryPillars.PDF_URL}
                    key="pdf-link"
                  >
                    <div className="text-capitalize">
                      {t("See full country profile")} <RightArrow />
                    </div>
                    <div className="text-center">
                      <small>{t("Source: World Bank")}</small>
                    </div>
                  </a>
                </CardFooter>
              ) : null}
            </Card>
          </div>
        </Col>
        <Col className="col-right" xs={24} md={16} xl={16}>
          <div className="inner-block col-right">
            <TitleH3
              className="chart-title text-capitalize"
              margin="auto 0 20px"
            >
              {t("Monthly progress")}
            </TitleH3>
            <AreaChart data={period} total={actions.total} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="col-left" xs={24} md={12}>
          <div className="inner-block col-left">
            <TitleH3 margin="auto 0 20px" className="text-capitalize">
              {t("Overall progress of tasks")} -{" "}
              {moment().format(t("DD MMM YYYY"))}
            </TitleH3>
            <Row>
              <Col xs={24} md={12} className="has-right-divider">
                <DonutChart data={chart} />
              </Col>
              <Col xs={24} md={12} className="has-left-divider">
                <BarChart data={chart} />
              </Col>
              <Col span={24} className="pt-30" />
              {chart.map((item, index) => (
                <Col span={12} key={index}>
                  <ChartTitle>
                    <h3>
                      <span
                        className="label"
                        style={{ backgroundColor: item.color }}
                      />
                      {t(item.title)}
                    </h3>
                    <div className="number">{item.value || 0}%</div>
                  </ChartTitle>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
        <Col className="col-right" xs={24} md={12}>
          <div className="inner-block col-right">
            <TitleH3 margin="auto 0 20px">
              {t("Working Group Progress")}
            </TitleH3>
            {workingGroups.length > 0
              ? workingGroups.map((item, index) => {
                  const { total = 0, completed = 0 } = item?.action_stats;
                  const percent = total
                    ? Number(
                        parseFloat((completed / total) * 100, 10).toFixed(1)
                      )
                    : 0;
                  const title = item.title.replace(/\s/g, "-").toLowerCase();

                  if (item.visible) {
                    return (
                      <ProgressBar
                        className="progress"
                        onClick={() => history.push(`/working-group/${title}`)}
                        key={index}
                      >
                        <h5 className="progress-title">{t(item.title)}</h5>
                        <ShProgress
                          trackColor="#ECEEF4"
                          color="#1447e5"
                          thickness={13}
                          value={percent}
                          format={(percent) => percent + "%"}
                        />
                      </ProgressBar>
                    );
                  }
                  return null;
                })
              : null}
          </div>
        </Col>
      </Row>
    </DashboardPage>
  );
};

export default Dashboard;
