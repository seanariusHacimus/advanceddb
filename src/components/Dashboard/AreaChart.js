import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import constants from "../../constants";
import { areaChartStatistics } from "../../utils/statisticsCalculator";
import { useLocale } from "../../utils/locale";

const defaultData = (t) => [
  {
    name: t("April"),
    value: 0,
  },
  {
    name: t("May"),
    value: 0,
  },
  {
    name: t("June"),
    value: 0,
  },
  {
    name: t("July"),
    value: 0,
  },
  {
    name: t("August"),
    value: 0,
  },
  {
    name: t("September"),
    value: 0,
  },
];

const MonthlyData = ({ data: propsData, total }) => {
  const [t] = useLocale();
  let data = defaultData(t);
  if (propsData && propsData.length) {
    data = areaChartStatistics(propsData, total);
  }

  return (
    <div style={{ width: "100%", height: 300, maxWidth: 1000 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="custom-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="-45.56%" stopColor="rgba(49, 57, 118, 0.08)" />
              <stop offset="-45.55%" stopColor="rgba(82, 123, 221, 0.22)" />
              <stop offset="100%" stopColor="rgba(82, 123, 221, 0.06)" />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="#E9EBF2"
            strokeDasharray="1 0"
            horizontal={false}
          />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value, name, props) => [
              props.payload.value + "%",
              "Completed",
            ]}
          />
          <Area
            animationDuration={constants.animationSpeed}
            type="linear"
            activeDot={{ r: 7 }}
            strokeWidth={2}
            dot={{ r: 4 }}
            strokeLinecap="round"
            dataKey="value"
            stroke="#527BDD"
            fill="url(#custom-gradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyData;
