import React, { PureComponent } from "react";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import constants from "../../constants";

export default class BarModule extends PureComponent {
  render() {
    const { data = [] } = this.props;
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
            <Bar
              animationDuration={constants.animationSpeed}
              isAnimationActive={false}
              dataKey="count"
              fill="red"
              barGap={18}
              maxBarSize={36}
              label={{ position: "top", fill: "#000" }}
              minPointSize={5}
              radius={[5, 5, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  dataKey="count"
                  key={`cell-${index}`}
                  minPointSize={5}
                  fill={entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
