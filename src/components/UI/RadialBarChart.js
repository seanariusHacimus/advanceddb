import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import constants from "../../constants";
import { getChartColors } from "../../utils/settings";

// Get colors from settings/localStorage, fallback to defaults
const getColorCode = () => {
  try {
    return getChartColors();
  } catch (error) {
    console.error("Error getting chart colors:", error);
    return {
      pillar_i: "#e35f20",
      pillar_ii: "#f6871e",
      pillar_iii: "#fcac18",
    };
  }
};

const pillarNumberMap = {
  pillar_i: "1",
  pillar_ii: "2",
  pillar_iii: "3",
};

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${(props) => props.chartSize || "250px"};
  width: ${(props) => props.chartSize || "250px"};
  display: flex;
  align-items: center;
`;

const PillarLabelsContainer = styled.div`
  position: absolute;
  top: ${(props) =>
    props.chartSize ? `${Math.max(30, props.chartSize / 8)}px` : "30px"};
  right: calc(50% + 6px);
  display: flex;
  flex-direction: column;
  gap: ${(props) =>
    props.chartSize ? `${Math.ceil(props.chartSize / 50)}px` : "3px"};
  z-index: 10;
  cursor: pointer;
`;

const PillarLabel = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
  transition: color 0.2s ease;
  background: transparent;
  border: none;
  text-align: left;
  padding: 0;
  font-weight: 600;
  &:hover {
    color: #527bdd;
  }
`;

const SimpleRadialBarChart = ({
  id = "radial-bar-chart",
  pillars,
  overallScore = 0,
  topicName,
  onPillarClick,
  selectedPillar,
  chartSize = 250,
  showOverallScore = true,
}) => {
  const history = useHistory();

  const handlePillarClick = (pillarId) => {
    if (onPillarClick) {
      if (selectedPillar === pillarId) {
        onPillarClick("all");
      } else {
        onPillarClick(pillarId);
      }
    } else {
      const pillarNumber = pillarNumberMap[pillarId] || pillarId;
      const urlParams = new URLSearchParams(window.location.search);
      const countryCode =
        urlParams.get("country_code") || constants.defaultCountry.code;
      const topicSlug = topicName.toLowerCase().replace(/\s+/g, "-");
      history.push(
        `/dashboard/topic/${topicSlug}?country_code=${countryCode}&active_pillar=${pillarNumber}`
      );
    }
  };

  // Get colors from settings
  const colorCode = getColorCode();

  return (
    <ChartContainer
      id={id}
      onClick={() => handlePillarClick("all")}
      chartSize={`${chartSize}px`}
    >
      <PillarLabelsContainer chartSize={chartSize}>
        {pillars.map((pillar) => (
          <PillarLabel
            key={pillar.id}
            onClick={(e) => {
              e.stopPropagation();
              handlePillarClick(pillar.id);
            }}
            selected={selectedPillar === pillar.id || selectedPillar === "all"}
          >
            {pillar.name?.split(" - ")[0]}
          </PillarLabel>
        ))}
      </PillarLabelsContainer>

      <RadialBarChart
        accessibilityLayer
        barCategoryGap="10%"
        barGap={4}
        cx="50%"
        cy="50%"
        data={pillars
          .map((pillar) => {
            return {
              id: pillar.id,
              fill: colorCode[pillar.id] || colorCode.pillar_i,
              name: pillar.name,
              score: parseInt(pillar.score),
            };
          })
          .reverse()}
        endAngle={180}
        height={chartSize}
        innerRadius={Math.max(30, chartSize / 8)}
        layout="radial"
        margin={{
          bottom: 5,
          left: 5,
          right: 5,
          top: 5,
        }}
        outerRadius="80%"
        startAngle={450}
        syncMethod="index"
        label={{ position: "end", fill: "#333", fontSize: 10 }}
        width={chartSize}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]} // min = 0, max = 100
          angleAxisId={0}
          ticks={[0, 25, 50, 75, 100]}
          tickSize={10}
          fontSize={10}
        />
        <RadialBar
          dataKey="score"
          barSize={Math.max(14, chartSize / 20)}
          onClick={(data) => handlePillarClick(data.id)}
          background={{
            fill: "transparent",
            stroke: "#E2E4ED",
            strokeDasharray: "3,3",
          }}
          style={{
            cursor: "pointer",
          }}
          label={{
            position: "end",
            fill: "#333",
            fontSize: 10,
            fontWeight: "bold",
            fontFamily: "Montserrat",
          }}
        />
        {/* <PolarGrid gridType="circle" stroke="#E2E4ED" /> */}
        {/* <Tooltip defaultIndex={0} /> */}
        {showOverallScore && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={22}
            fontWeight="bold"
            fill="#333"
            fontFamily="Montserrat"
            onClick={() => handlePillarClick("all")}
          >
            {overallScore}
          </text>
        )}
      </RadialBarChart>
    </ChartContainer>
  );
};

SimpleRadialBarChart.propTypes = {
  pillars: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  overallScore: PropTypes.number.isRequired,
};

export default SimpleRadialBarChart;
