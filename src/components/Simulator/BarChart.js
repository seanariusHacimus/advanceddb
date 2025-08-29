import React, { PureComponent } from 'react';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, Text,
} from 'recharts';
import constants, { colors } from '../../constants';

const CustomizedLabel = props => {
  const { x, y, payload } = props;

  return (
    <Text
      x={x}
      y={y + 7}
      fill="#717A8F"
      fontSize={10}
      textAnchor="middle"
      verticalAnchor="start"
      width={15}
      style={{ lineHeight: 2.5, textTransform: 'capitalize' }}
    >{payload.value.replace(/Ease of|\(rank\)/ig, '')}</Text>
  );
};

const CustomizedLabelTop = (props) => {
  const { x, y, index, data } = props;
  const isRankBetter = data[index].value === data[index].current ? '#717A8F' : data[index].value < data[index].current ? 'green' : 'red';
  const calculate = data[index].current - data[index].value
  const value = calculate ? (Math.sign(calculate) > 0 ? '+' + calculate : calculate) : null
  return (
    <Text
      x={x}
      y={y - 14}
      fill={isRankBetter}
      fontSize={14}
      textAnchor="middle"
      verticalAnchor="start"
      width={15}
      style={{ lineHeight: 2.5, textTransform: 'capitalize' }}
    >{value}</Text>
  );
};

const CustomizedBarLabel = props => {
  const { x, y, value } = props;
  return (
    <Text
      x={x + 20}
      y={y + (value > 20 ? 10 : -10)}
      fill={value > 20 ? "#fff" : "000"}
      fontSize={12}
      textAnchor="middle"
      verticalAnchor="middle"
      position="top"
      width={20}
      style={{ lineHeight: 2.5, textTransform: 'capitalize' }}
    >{value}</Text>
  );

};

export default class BarModule extends PureComponent {
  render() {
    const { data = [] } = this.props;
    return (
      <div style={{ width: '100%', height: 300, minWidth: 700 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 20, right: 0, left: 0, bottom: 45,
            }}
          >

            <XAxis
              xAxisId={0}
              dataKey="current"
              interval={0}
              orientation="top"
              axisLine={false}
              tickSize={0}
              tick={<CustomizedLabelTop data={data} />}
            />

            <XAxis
              xAxisId={2}
              dataKey="title"
              interval={0}
              axisLine={false}
              tickSize={0}
              tick={<CustomizedLabel />}
            />

            <XAxis
              xAxisId={2}
              dataKey="title"
              interval={0}
              axisLine={false}
              tickSize={0}
              tick={<CustomizedLabel />}
            />
            <Bar
              dataKey="value"
              fill={colors.primary}
              barGap={15}
              background={{ fill: '#ECEEF4' }}
              maxBarSize={42}
              label={<CustomizedBarLabel />}
              minPointSize={5}
              radius={[5, 5, 0, 0]}
              animationDuration={constants.animationSpeed}
            >
              {/* <LabelList dataKey="value" fill="red" position="top" offset={10} /> */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
