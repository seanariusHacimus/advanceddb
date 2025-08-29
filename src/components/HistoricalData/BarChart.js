import React, { PureComponent } from 'react';
import {
  BarChart, Bar, ResponsiveContainer, Cell, XAxis, YAxis, Text
} from 'recharts';
import constants from '../../constants';

const CustomizedValue = props => {
  const { x, y, width, payload, index } = props;
  return (
    <Text
      x={x + width / 2}
      y={y - 14}
      fill="#717A8F"
      fontSize={payload[index].noPractice ? 10 : 14}
      textAnchor="middle"
      verticalAnchor="start"
      // width={35}
      style={{ lineHeight: 2.5, textTransform: 'capitalize', }}
    >{payload[index].noPractice ? 'no practice' : payload[index].value}</Text>
  );
};

export default class BarModule extends PureComponent {
  render() {
    const { data = [], color } = this.props;
    return (
      <div style={{ width: '100%', height: 220, maxWidth: 450, }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 30, right: 0, left: 0, bottom: 5,
            }}
          >
            {/* <Tooltip
              formatter={(value, name, props) => ([props.payload.value, props.payload.title])}
            /> */}
            <Bar
              dataKey="value"
              fill="#8884d8"
              barGap={5}
              maxBarSize={50}
              radius={[5, 5, 0, 0]}
              label={{ position: 'top', fill: '#000' }}
              minPointSize={5}
              label={<CustomizedValue payload={data} />}
              animationDuration={constants.animationSpeed}
            >
              {
                data.map((entry, index) => <Cell dataKey="value" key={`cell-${index}`} minPointSize={5} fill={color} />)
              }
            </Bar>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

