import React, { PureComponent } from 'react';
import {
  BarChart, Bar, ResponsiveContainer, Cell, LabelList, XAxis, YAxis, Text
} from 'recharts';
import constants from '../../constants';

const CustomizedLabel = props => {
  const { x, y, payload } = props;

  return (
    <Text
      x={x}
      y={y + 3}
      fill="#717A8F"
      fontSize={12}
      textAnchor="middle"
      verticalAnchor="start"
      width={15}
      style={{ lineHeight: 2.5, textTransform: 'capitalize' }}
    >{payload.value.replace(/Ease of|\(rank\)/ig, '')}</Text>
  );
};

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
      <div style={{ width: '100%', height: 260, maxWidth: data.length > 1 ? (data.length * 90) : 150, }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            barGap={20}
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
              barGap={1}
              barGap={2}
              maxBarSize={50}
              minPointSize={5}
              radius={[5, 5, 0, 0]}
              label={<CustomizedValue payload={data} />}
              animationDuration={constants.animationSpeed}
            >
              {
                data.map((entry, index) => <Cell dataKey="value" key={`cell-${index}`} minPointSize={5} fill={color[index]} />)
              }
            </Bar>
            <XAxis dataKey="name" interval={0} height={100} axisLine={false} tickLine={false} tick={<CustomizedLabel />} />
            <YAxis />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

