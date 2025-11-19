import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row, Col, Empty } from "../UI/shadcn";
import DashboardPage from "../../styles/dashboard";
import { TitleH3, Flex } from "../../styles";
import { ReactComponent as RightArrow } from "../../assets/dashboard/right-arrow.svg";
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
import { Card } from "../UI/shadcn/card";
import { Progress as ShProgress } from "../UI/shadcn/progress";
import { Button as ShButton, Badge } from "../UI/shadcn";
import { ThemeToggle } from "../UI/ThemeToggle";

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 200px;
  text-align: center;
`;

const NoDataMessage = styled.p`
  margin-top: 16px;
  font-size: 14px;
  color: hsl(var(--muted-foreground));
  transition: color 0.3s ease;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  padding: 0 48px;
  
  @media (max-width: 768px) {
    padding: 0 20px;
    gap: 20px;
  }
`;

const DashboardCard = styled(Card)`
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 32px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: hsl(var(--border) / 0.5);
  }
  
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0 0 4px 0;
  line-height: 1.4;
`;

const CardDescription = styled.p`
  font-size: 13px;
  color: hsl(var(--muted-foreground));
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const ProgressItem = styled.div`
  padding: 16px 0;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid hsl(var(--border) / 0.1);
  }
`;

const ProgressLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: hsl(var(--foreground));
  margin-bottom: 12px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 24px;
`;

const StatItem = styled.div`
  padding: 16px;
  background: hsl(var(--muted) / 0.3);
  border-radius: 8px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: hsl(var(--foreground));
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

const StatIcon = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: inline-block;
  margin-right: 4px;
`;

const ChartContainer = styled.div`
  margin-top: 24px;
`;

const SimpleLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: hsl(var(--primary));
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  margin-top: 24px;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.7;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const GridCol4 = styled.div`
  grid-column: span 4;
  
  @media (max-width: 768px) {
    grid-column: span 12;
  }
`;

const GridCol6 = styled.div`
  grid-column: span 6;
  
  @media (max-width: 768px) {
    grid-column: span 12;
  }
`;

const GridCol8 = styled.div`
  grid-column: span 8;
  
  @media (max-width: 768px) {
    grid-column: span 12;
  }
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
      {/* Header */}
      <Flex jc="space-between" align="center" margin="0 0 32px" style={{ flexWrap: 'wrap', gap: '16px', padding: '0 48px' }}>
        <TitleH3 style={{ margin: 0, color: 'hsl(var(--foreground))', fontSize: '24px', fontWeight: '600', letterSpacing: '-0.02em' }}>
          {t("Dashboard")}
        </TitleH3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ThemeToggle />
          <ShButton variant="outline" size="sm" onClick={() => history.push('/dashboard/components')}>
            Components
          </ShButton>
          <PrintDashboardToFile page="dashboard" />
          <Print ref={printRef.current} orientation="portrait" />
        </div>
      </Flex>
      
      {/* Main Grid */}
      <DashboardGrid>
        {/* Business Ready Card */}
        <GridCol4>
          <DashboardCard>
            <CardTitle>{currentCountryName}</CardTitle>
            <CardDescription>{t("Business readiness")}</CardDescription>
            {!currentCountryPillars || !currentCountryPillars.data || pillars.length === 0 ? (
              <NoDataContainer>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<NoDataMessage>{t(`No data available`)}</NoDataMessage>}
                />
              </NoDataContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <RadialBarChart
                  id="dashboard-radial-bar-chart"
                  pillars={pillars}
                  showOverallScore={false}
                  onPillarClick={redirectToReportPage}
                  topicName=""
                />
              </div>
            )}
            {currentCountryPillars?.PDF_URL && (
              <SimpleLink target="_blank" rel="noopener noreferrer" href={currentCountryPillars.PDF_URL}>
                {t("View full profile")} <RightArrow />
              </SimpleLink>
            )}
          </DashboardCard>
        </GridCol4>

        {/* Monthly Progress Card */}
        <GridCol8>
          <DashboardCard>
            <CardTitle>{t("Monthly progress")}</CardTitle>
            <CardDescription>{t("Task completion over time")}</CardDescription>
            <ChartContainer>
              <AreaChart data={period} total={actions.total} />
            </ChartContainer>
          </DashboardCard>
        </GridCol8>

        {/* Overall Progress Card */}
        <GridCol6>
          <DashboardCard>
            <CardTitle>{t("Overall progress")}</CardTitle>
            <CardDescription>{moment().format(t("DD MMM YYYY"))}</CardDescription>
            <ChartContainer>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <DonutChart data={chart} />
                <BarChart data={chart} />
              </div>
              <StatsGrid>
                {chart.map((item, index) => (
                  <StatItem key={index}>
                    <StatLabel>
                      <StatIcon color={item.color} />
                      {t(item.title)}
                    </StatLabel>
                    <StatValue>{item.value || 0}%</StatValue>
                  </StatItem>
                ))}
              </StatsGrid>
            </ChartContainer>
          </DashboardCard>
        </GridCol6>

        {/* Working Groups Card */}
        <GridCol6>
          <DashboardCard>
            <CardTitle>{t("Working Groups")}</CardTitle>
            <CardDescription>{t("Progress by group")}</CardDescription>
            <div style={{ marginTop: '24px' }}>
              {workingGroups.length > 0 ? (
                workingGroups.map((item, index) => {
                  const { total = 0, completed = 0 } = item?.action_stats;
                  const percent = total ? Number(parseFloat((completed / total) * 100, 10).toFixed(1)) : 0;
                  const title = item.title.replace(/\s/g, "-").toLowerCase();

                  if (item.visible) {
                    return (
                      <ProgressItem key={index} onClick={() => history.push(`/working-group/${title}`)}>
                        <ProgressLabel>{t(item.title)}</ProgressLabel>
                        <ShProgress
                          trackColor="hsl(var(--muted) / 0.3)"
                          color="hsl(var(--primary))"
                          thickness={8}
                          value={percent}
                          format={(percent) => percent + "%"}
                        />
                      </ProgressItem>
                    );
                  }
                  return null;
                })
              ) : (
                <NoDataContainer>
                  <NoDataMessage>{t("No working groups")}</NoDataMessage>
                </NoDataContainer>
              )}
            </div>
          </DashboardCard>
        </GridCol6>
      </DashboardGrid>
    </DashboardPage>
  );
};

export default Dashboard;
