import { useMemo } from "react";
import { withLocale } from "../../utils/locale";
import { StyledCountryReport } from "./CountryReport.style";
import { useCountryData } from "./hooks/useCountryData";
import TopicCard from "./TopicCard";
import Legend from "../UI/Legend";
import CountrySelect from "./CountrySelect";
import constants from "../../constants";
import { Empty } from "../UI/shadcn"; // Using shadcn Empty component
import { CountryReportPillars } from "../../data";
import styled from "styled-components";
import { getCountryNameFromCode } from "./utils";
import { getShowCountrySelect } from "../../utils/settings";

const DEFAULT_COUNTRY_CODE = constants.defaultCountry.code;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 300px;
  text-align: center;
  background: hsl(var(--card));
  border-radius: 12px;
  border: 1px solid hsl(var(--border));
  margin-top: 20px;
`;

const NoDataMessage = styled.p`
  margin-top: 16px;
  font-size: 16px;
  color: hsl(var(--muted-foreground));
`;

const CountryReport = ({ history, t }) => {
  const countryCodeParam = new URLSearchParams(window.location.search).get(
    "country_code"
  );

  const countryShortCode = countryCodeParam || DEFAULT_COUNTRY_CODE;

  const { data: topicsData, loading, error } = useCountryData(countryShortCode);

  // Get country name from code
  const countryName = useMemo(() => {
    return getCountryNameFromCode(countryShortCode) || countryShortCode;
  }, [countryShortCode]);

  // Check if country exists in countryReportPillars.json
  const countryExists = useMemo(() => {
    return CountryReportPillars.some(
      (pillar) => pillar.EconomyCode === countryShortCode
    );
  }, [countryShortCode]);

  // Handle country selection
  const handleCountryChange = (countryCode) => {
    if (history && typeof history.push === "function") {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("country_code", countryCode);
      history.push(`/dashboard/country-report?${urlParams.toString()}`);
    }
  };

  // Get show country select setting
  const showCountrySelect = useMemo(() => {
    return getShowCountrySelect();
  }, []);

  // Check if we have data or if data is empty
  const hasNoData =
    !loading &&
    error &&
    (!topicsData ||
      Object.keys(topicsData).length === 0 ||
      !countryExists ||
      (topicsData && Object.values(topicsData).every((topic) => !topic)));

  const handleTopicClick = (topicName) => {
    const topicSlug = topicName.toLowerCase().replace(/\s+/g, "-");
    history.push(
      `/dashboard/topic/${topicSlug}?country_code=${countryShortCode}`
    );
  };

  return (
    <StyledCountryReport>
      <div className="header-section">
        <h1 className="main-title">
          {t("World Bank Business Regulation Report")}
        </h1>
        <p className="subtitle">
          {t("Interactive Data Visualization and Analysis")}
        </p>
      </div>

      <Legend t={t} />

      <div className="topic-scores-section">
        <div className="topic-scores-section-header">
          <h2 className="section-title">{t("Topic Scores")}</h2>
          {showCountrySelect && (
            <CountrySelect
              value={countryShortCode}
              onChange={handleCountryChange}
              t={t}
            />
          )}
        </div>
        {loading && <p>{t("Loading data...")}</p>}

        {hasNoData ? (
          <NoDataContainer>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <NoDataMessage>
                  {t(`No data available for ${countryName}`)}
                </NoDataMessage>
              }
            />
          </NoDataContainer>
        ) : (
          topicsData &&
          Object.keys(topicsData).length > 0 && (
            <div className="scores-grid">
              {Object.values(topicsData).map((topic, index) => (
                <TopicCard
                  key={index}
                  topic={topic}
                  onTopicClick={handleTopicClick}
                  showChart={true}
                  history={history}
                />
              ))}
            </div>
          )
        )}
      </div>
    </StyledCountryReport>
  );
};

export default withLocale(CountryReport);
