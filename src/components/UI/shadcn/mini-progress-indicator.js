import React from 'react';
import styled from 'styled-components';

const ProgressRing = styled.svg`
  width: 24px;
  height: 24px;
  overflow: visible;
`;

/**
 * Mini Progress Indicator - A small donut chart showing progress
 * Replacement for recharts-based PieIndicator
 * Shows completed (blue/green) and remaining (light gray) as pie segments
 */
export const MiniProgressIndicator = ({ data }) => {
  const { total = 0, completed = 0 } = data || {};
  
  // Calculate angles
  const percentage = total > 0 ? (completed / total) : 0;
  const isFullyCompleted = percentage === 1;
  
  // SVG parameters for donut chart
  const size = 24;
  const padding = 2; // Padding to prevent cutoff
  const center = size / 2;
  const radius = 7; // Inner radius of donut
  const thickness = 3; // Thickness of donut ring
  const outerRadius = radius + thickness;
  
  // Colors - all progress uses same shadcn blue color
  const completedColor = '#3b82f6'; // Shadcn blue for all progress
  const remainingColor = '#e5e7eb'; // Solid light gray for remaining (same thickness as completed)
  const borderColor = '#3b82f6'; // Outer border matches progress color
  
  // Create arc path for a segment
  const createArc = (startAngle, endAngle, innerR, outerR) => {
    const start = polarToCartesian(center, center, outerR, endAngle);
    const end = polarToCartesian(center, center, outerR, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    const innerStart = polarToCartesian(center, center, innerR, endAngle);
    const innerEnd = polarToCartesian(center, center, innerR, startAngle);
    
    return [
      'M', start.x, start.y,
      'A', outerR, outerR, 0, largeArcFlag, 0, end.x, end.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerR, innerR, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      'Z'
    ].join(' ');
  };
  
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  // Calculate angles (starting from top, clockwise)
  const completedAngle = percentage * 360;
  const remainingAngle = 360 - completedAngle;
  
  // Create paths
  const completedPath = completedAngle > 0 
    ? createArc(0, completedAngle, radius, outerRadius)
    : '';
  
  const remainingPath = remainingAngle > 0 
    ? createArc(completedAngle, 360, radius, outerRadius)
    : '';
  
  return (
    <ProgressRing
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Progress: ${completed} of ${total} completed (${Math.round(percentage * 100)}%)`}
    >
      {/* Center circle background */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="hsl(var(--background))"
      />
      
      {/* Remaining segment (light gray) */}
      {remainingPath && (
        <path
          d={remainingPath}
          fill={remainingColor}
        />
      )}
      
      {/* Completed segment (blue/green) */}
      {completedPath && (
        <path
          d={completedPath}
          fill={completedColor}
        />
      )}
      
      {/* Outer border ring */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius + 0.25}
        fill="none"
        stroke={borderColor}
        strokeWidth="1"
        opacity="0.8"
      />
    </ProgressRing>
  );
};

export default MiniProgressIndicator;

