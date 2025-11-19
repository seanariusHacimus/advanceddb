import React from 'react';
import styled from 'styled-components';

// Pie Chart Component
export const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

export const PieChartSvg = styled.svg`
  transform: rotate(-90deg);
  width: ${props => props.size || 200}px;
  height: ${props => props.size || 200}px;
`;

export const PieChartLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: calc(var(--radius) - 2px);
  transition: background 0.2s ease;

  &:hover {
    background: hsl(var(--accent));
  }
`;

export const LegendLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: hsl(var(--foreground));
`;

export const LegendColor = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: ${props => props.color};
  flex-shrink: 0;
`;

export const LegendValue = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--foreground));
`;

export const PieChart = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  const chartRadius = radius * 0.8;

  const createArc = (startAngle, endAngle, color) => {
    const start = polarToCartesian(centerX, centerY, chartRadius, startAngle);
    const end = polarToCartesian(centerX, centerY, chartRadius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return {
      path: [
        "M", centerX, centerY,
        "L", start.x, start.y,
        "A", chartRadius, chartRadius, 0, largeArcFlag, 1, end.x, end.y,
        "Z"
      ].join(" "),
      color
    };
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const segments = data.map(item => {
    const angle = (item.value / total) * 360;
    const segment = createArc(currentAngle, currentAngle + angle, item.color);
    currentAngle += angle;
    return segment;
  });

  return (
    <PieChartContainer>
      <PieChartSvg size={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill={segment.color}
            stroke="hsl(var(--card))"
            strokeWidth="2"
          />
        ))}
        {/* Center circle for donut effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r={chartRadius * 0.6}
          fill="hsl(var(--card))"
        />
      </PieChartSvg>

      <PieChartLegend>
        {data.map((item, index) => (
          <LegendItem key={index}>
            <LegendLabel>
              <LegendColor color={item.color} />
              <span>{item.label}</span>
            </LegendLabel>
            <LegendValue>{item.value}%</LegendValue>
          </LegendItem>
        ))}
      </PieChartLegend>
    </PieChartContainer>
  );
};

// Progress List Component
export const ProgressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const ProgressItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: calc(var(--radius) - 2px);
  transition: background 0.2s ease;

  &:hover {
    background: hsl(var(--accent));
  }
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const ProgressTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--foreground));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

export const ProgressPercentage = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: hsl(var(--primary));
  flex-shrink: 0;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: hsl(var(--muted));
  border-radius: 9999px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  background: ${props => props.color || 'hsl(221 83% 53%)'};
  border-radius: 9999px;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

export const ProgressListItem = ({ title, percentage, color }) => {
  return (
    <ProgressItem>
      <ProgressHeader>
        <ProgressTitle title={title}>{title}</ProgressTitle>
        <ProgressPercentage>{percentage}%</ProgressPercentage>
      </ProgressHeader>
      <ProgressBarContainer>
        <ProgressBarFill percentage={percentage} color={color} />
      </ProgressBarContainer>
    </ProgressItem>
  );
};

// Task List Component
export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

export const TaskListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid hsl(var(--border));
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: hsl(var(--accent));
  }
`;

export const TaskBadge = styled.div`
  padding: 4px 12px;
  border-radius: calc(var(--radius) - 2px);
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch(props.variant) {
      case 'danger': return 'hsl(var(--status-overdue))';
      case 'warning': return 'hsl(var(--status-in-progress))';
      case 'success': return 'hsl(var(--success))';
      default: return 'hsl(var(--status-not-started))';
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'danger': return 'white';
      case 'warning': return 'white';
      case 'success': return 'white';
      default: return 'hsl(var(--muted-foreground))';
    }
  }};
  flex-shrink: 0;
`;

export const TaskContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TaskTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--foreground));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TaskMeta = styled.div`
  font-size: 11px;
  color: hsl(var(--muted-foreground));
  margin-top: 2px;
`;

export const TaskAction = styled.div`
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${TaskListItem}:hover & {
    opacity: 1;
  }
`;

export default {
  PieChart,
  ProgressListItem,
  TaskList,
  TaskListItem,
  TaskBadge,
  TaskContent,
  TaskTitle,
  TaskMeta,
  TaskAction,
};

