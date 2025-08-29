import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import constants from '../../../constants';
const COLORS = ['#fff', '#527bdd',];

export default class SimplePieChart extends PureComponent {
  render() {
    const { total, completed } = this.props.data;
    const data = [{ value: 360 / total * (total - completed) }, { value: 360 / total * completed }];
    return (
      <PieChart width={24} height={24}>
        <Pie
          animationDuration={constants.animationSpeed}
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={8.5}
          fill="#8884d8"
          stroke="none"
        >
          {
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Pie
          animationDuration={constants.animationSpeed}
          data={[{ value: 100 }]}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={9.5}
          outerRadius={11}
          fill="#527bdd"
          stroke="none"
        />
      </PieChart>
    );
  }
}