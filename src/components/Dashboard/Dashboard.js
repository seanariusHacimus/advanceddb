import React, { PureComponent, lazy, Suspense, createRef } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Divider, Progress } from "antd";
import DashboardPage from "../../styles/dashboard";
import { TitleH3, Flex, ButtonSecondary } from "../../styles";
import { ReactComponent as RightArrow } from "../../assets/dashboard/right-arrow.svg";
import { ProgressBar, ChartTitle } from "../../styles/graph";
// import IndicatorSettings from './Indicators';
import iconCog from "../../assets/dashboard/cog.svg";
import { FETCH_STATISTICS } from "../../graphql/dashboard";
import moment from "moment";

import AreaChart from "./AreaChart";
import DonutChart from "./DonutChart";
import BarChart from "./BarChart";
import Axios from "../../utils/axios";
import statisticsCalculator from "../../utils/statisticsCalculator";
import constants from "../../constants";
import Print from "../../components/UI/Printer";
import { withLocale } from "../../utils/locale";
import PrintDashboardToFile from "../UI/PrintDashboardToFile";

const IndicatorSettings = lazy(() => import("./Indicators"));

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

class Dashboard extends PureComponent {
  state = {
    actions: {
      total: 1,
    },
    db_score_and_rank: {
      rank: 0,
      score: 0,
    },
    indicators: [],
    period: [],
    showIndicators: false,
    workingGroups: [],
  };

  printRef = createRef();

  componentDidMount() {
    this.fetchDashboardReport();
  }

  fetchDashboardReport = async () => {
    this.setState({ indicators: this.props.indicators });
    try {
      const res = await Axios.post("/graphql", {
        query: FETCH_STATISTICS,
        variables: {
          filter: {},
          unit: "months",
          last_n: 6,
        },
      });
      if (res?.data) {
        const {
          action_period_stats,
          action_stats,
          history: [indicators],
          indicator_groups,
        } = res.data.data;
        this.setState({
          period: action_period_stats.values,
          actions: action_stats,
          db_score_and_rank: indicators
            ? indicators?.indicators?.ease_of_doing_business
            : {
                rank: constants.doingBusiness.rank,
                score: constants.doingBusiness.score,
              },
          workingGroups: indicator_groups.nodes,
        });
      }
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.indicators !== this.props.indicators) {
      this.setState({ indicators: this.props.indicators });
    }
  }

  modalHandler = () =>
    this.setState((prevState) => ({
      showIndicators: !prevState.showIndicators,
    }));

  render() {
    const {
      showIndicators,
      actions,
      period,
      db_score_and_rank,
      workingGroups,
    } = this.state;

    const { t } = this.props;
    const { myAccount } = this.props;
    const dbRank =
      db_score_and_rank[
        Object.keys(db_score_and_rank).find((key) => key.includes("rank"))
      ].toFixed(1);
    const dbScore =
      db_score_and_rank[
        Object.keys(db_score_and_rank).find((key) => key.includes("score"))
      ].toFixed(1);
    let chart = chartData(t);
    if (actions) {
      chart = statisticsCalculator(actions);
    }

    return (
      <DashboardPage ref={this.printRef} id="dashboard">
        <Flex jc="flex-end" margin="0 0 10px">
          {(myAccount.role === "superuser" ||
            myAccount.role === "coordinator") && (
            <ButtonSecondary
              className="small customize-btn download-actions-button"
              onClick={this.modalHandler}
            >
              <img src={iconCog} alt="cog" style={{ marginRight: 5 }} />
              {t("Customize Dashboard Reports")}
            </ButtonSecondary>
          )}
          <PrintDashboardToFile page="dashboard" />
          <Print
            ref={this.printRef.current}
            orientation="portrait"
            style={{ marginLeft: 10 }}
          />
        </Flex>
        <Row style={{ marginBottom: 24 }}>
          <Col className="col-left" xs={24} md={8} xl={7} xxl={6}>
            <div className="inner-block col-left">
              <TitleH3>
                {t("Doing Business 2020")} {constants.defaultCountry.name}
              </TitleH3>
              <Card
                style={{ width: 300, marginTop: 16 }}
                className="info"
                bordered={false}
                actions={[
                  <a
                    target="_blank"
                    className="content"
                    rel="noopener noreferrer"
                    href="https://www.doingbusiness.org/content/dam/doingBusiness/country/a/angola/AGO.pdf"
                  >
                    <div className="text-capitalize">
                      {t("See full country profile")} <RightArrow />
                    </div>
                    <div className="text-center">
                      <small>{t("Source: Doing Business")}</small>
                    </div>
                  </a>,
                ]}
              >
                <div className="statistic">
                  <span className="statistic-icon" />
                  <h2>{dbRank % 1 === 0 ? parseInt(dbRank, 10) : dbRank}</h2>
                  <h5 className="text-capitalize">{t("DB rank")}</h5>
                </div>
                <Divider
                  type="vertical"
                  style={{
                    borderColor: "#C9CCDD",
                    height: 60,
                    marginRight: 30,
                  }}
                />
                <div className="statistic blue">
                  <span className="statistic-icon" />
                  <h2>{dbScore % 1 === 0 ? parseInt(dbScore, 10) : dbScore}</h2>
                  <h5 className="text-capitalize">{t("DB score")}</h5>
                </div>
              </Card>
            </div>
          </Col>
          <Col className="col-right" xs={24} md={16} xl={17} xxl={18}>
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
                          onClick={() =>
                            this.props.history.push(`/working-group/${title}`)
                          }
                          key={index}
                        >
                          <h5 className="progress-title">{t(item.title)}</h5>
                          <Progress
                            trailColor="#ECEEF4"
                            strokeColor="#6B91EC"
                            strokeWidth={13}
                            percent={percent}
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
        {showIndicators && (
          <Suspense fallback={t("Loading...")}>
            <IndicatorSettings
              modalHandler={this.modalHandler}
              modalVisible={showIndicators}
              fetchDashboardReport={this.fetchDashboardReport}
            />
          </Suspense>
        )}
      </DashboardPage>
    );
  }
}

const mapStateTopProps = (state) => ({
  indicators: state.workingGroups.data,
  myAccount: state.auth.account,
});

export default connect(mapStateTopProps)(withLocale(Dashboard));
