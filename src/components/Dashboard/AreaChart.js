import React, { useMemo } from "react";
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

  const data = useMemo(() => {
    if (propsData && propsData.length) {
      return areaChartStatistics(propsData, total);
    }
    return defaultData(t);
  }, [propsData, total, t]);

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
          <CartesianGrid
            stroke="#E9EBF2"
            strokeDasharray="1 0"
            horizontal={false}
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value, name, props) => [
              props.payload.value + "%",
              "Completed",
            ]}
          />
          <Area
            animationDuration={constants.animationSpeed}
            type="natural"
            activeDot={{ r: 7 }}
            strokeWidth={2}
            dot={{ r: 4 }}
            strokeLinecap="round"
            dataKey="value"
            stroke="#527bdd"
            fill="#8ec5ff"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyData;
