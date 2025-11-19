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
import { useTheme } from "../UI/ThemeProvider";

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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 'var(--radius)',
        padding: '12px 16px',
        boxShadow: '0 4px 12px hsl(var(--foreground) / 0.1)',
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: '13px', 
          fontWeight: '600',
          color: 'hsl(var(--foreground))',
          marginBottom: '4px'
        }}>
          {label}
        </p>
        <p style={{ 
          margin: 0, 
          fontSize: '14px', 
          fontWeight: '700',
          color: 'hsl(var(--primary))'
        }}>
          {payload[0].value}% completed
        </p>
      </div>
    );
  }
  return null;
};

const MonthlyData = ({ data: propsData, total }) => {
  const [t] = useLocale();
  const { theme } = useTheme();

  const data = useMemo(() => {
    if (propsData && propsData.length) {
      return areaChartStatistics(propsData, total);
    }
    return defaultData(t);
  }, [propsData, total, t]);

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)';
  const axisColor = isDark ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)';
  const areaStroke = isDark ? 'hsl(217 91% 60%)' : 'hsl(221 83% 53%)';
  const areaFill = isDark ? 'hsl(217 91% 60%)' : 'hsl(221 83% 53%)';

  return (
    <div style={{ width: "100%", height: 300 }}>
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
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={areaFill} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={areaFill} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke={gridColor}
            strokeDasharray="3 3"
            vertical={false}
            opacity={0.5}
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tick={{ fill: axisColor, fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]} 
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tick={{ fill: axisColor, fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            animationDuration={constants.animationSpeed}
            type="monotone"
            activeDot={{ 
              r: 6, 
              fill: areaStroke,
              stroke: 'hsl(var(--card))',
              strokeWidth: 2
            }}
            strokeWidth={2.5}
            dot={{ 
              r: 4, 
              fill: areaStroke,
              stroke: 'hsl(var(--card))',
              strokeWidth: 2
            }}
            strokeLinecap="round"
            dataKey="value"
            stroke={areaStroke}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyData;
