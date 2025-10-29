import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

const colorCode = {
  pillar_i: "#e35f20",
  pillar_ii: "#f6871e",
  pillar_iii: "#fcac18",
};

const pillarNumberMap = {
  pillar_i: "1",
  pillar_ii: "2",
  pillar_iii: "3",
};

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  width: 250px;
  display: flex;
  align-items: center;
`;

const PillarLabelsContainer = styled.div`
  position: absolute;
  top: 30px;
  right: calc(50% + 6px);
  display: flex;
  flex-direction: column;
  gap: 3px;
  z-index: 10;
  cursor: pointer;
`;

const PillarLabel = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: #252a32;
  cursor: pointer;
  transition: color 0.2s ease;
  background: transparent;
  border: none;
  text-align: left;
  padding: 0;
  &:hover {
    color: #527bdd;
  }
  ${(props) =>
    props.selected &&
    `
    color: #527bdd;
    font-weight: 600;
  `}
`;

const SimpleRadialBarChart = ({
  pillars,
  overallScore = 0,
  topicName,
  onPillarClick,
  selectedPillar,
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
      history.push(
        `/dashboard/topic/${topicName
          .toLowerCase()
          .replace(/\s+/g, "-")}?active_pillar=${pillarNumber}`
      );
    }
  };

  return (
    <ChartContainer onClick={() => handlePillarClick("all")}>
      <PillarLabelsContainer>
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
              fill: colorCode[pillar.id],
              name: pillar.name,
              score: parseInt(pillar.score),
            };
          })
          .reverse()}
        endAngle={180}
        height={250}
        innerRadius={30}
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
        width={250}
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
          barSize={14}
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
