import React from "react";
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis } from "recharts";
import constants from "../../constants";
import { useTheme } from "../UI/ThemeProvider";

const BarModule = ({ data = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const labelColor = isDark ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)';

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis 
            dataKey="name" 
            hide={true}
          />
          <Bar
            animationDuration={constants.animationSpeed}
            dataKey="count"
            fill="red"
            barGap={18}
            maxBarSize={36}
            label={{ 
              position: "top", 
              fill: labelColor,
              fontSize: 13,
              fontWeight: 600
            }}
            minPointSize={5}
            radius={[6, 6, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                dataKey="count"
                key={`cell-${index}`}
                minPointSize={5}
                fill={entry.color}
                style={{ 
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))'
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarModule;
