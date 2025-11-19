import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import constants from '../../constants';
import { useLocale } from "../../utils/locale";
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 200px;
  max-height: 260px;
  position: relative;
`;

const CenterLabel = styled.div`
  position: absolute;
  top: 52%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
`;

const PercentageText = styled.h3`
  font-size: 32px;
  line-height: 1.2;
  color: hsl(var(--foreground));
  font-weight: 700;
  margin: 0 0 4px 0;
  transition: color 0.3s ease;
`;

const LabelText = styled.span`
  font-size: 13px;
  color: hsl(var(--muted-foreground));
  font-weight: 500;
  text-transform: capitalize;
  transition: color 0.3s ease;
`;

const DonutChart = ({ data = [{ value: 90 }, { value: 10 }] }) => {
  const [t] = useLocale();
  const completedTasks = data.find(item => item.name === 'completed');
  
  return (
    <ChartContainer>
      <ResponsiveContainer>
        <PieChart margin={{
          top: 20, right: 0, left: 0, bottom: 5,
        }}>
          <Pie
            data={data}
            cx={'50%'}
            cy={'50%'}
            innerRadius={'68%'}
            outerRadius={'95%'}
            fill="#8884d8"
            dataKey="value"
            animationDuration={constants.animationSpeed}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                style={{ 
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
                  outline: 'none'
                }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <CenterLabel>
        <PercentageText>{completedTasks?.value || 0}%</PercentageText>
        <LabelText>{t("completed")}</LabelText>
      </CenterLabel>
    </ChartContainer>
  );
};

export default DonutChart;
