import styled from 'styled-components';

export const ProgressBar = styled.div`
  margin-bottom: 11px;
  
  .progress-title {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: #717A8F;
    margin: 0;
    margin-bottom: -5px;
  }
`


export const ChartTitle = styled.div`
  margin-bottom: 15px;
  text-transform: capitalize;
  .label {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
  }
  .blue {
    background-color: var(--chart-blue);
  }
  .yellow {
    background-color: var(--chart-yellow);
  }
  .red {
    background-color: var(--chart-red);
  }
  .grey {
    background-color: var(--chart-grey);
  }

  h3 {
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
    color: #717A8F;
    margin-bottom: 0;
  }

  .number {
    font-weight: 500;
    font-size: 25px;
    line-height: 135%;
    color: #252A32;
  }
`;

export const StyledGantt = styled.div`
  background: transparent;
  
  .gantt-control {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: calc(var(--radius));
    padding: 16px 20px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.2s ease;
  }
  
  .gantt-select {
    position: relative;
    padding: 8px 36px 8px 12px;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    color: hsl(var(--foreground));
    border-radius: calc(var(--radius) - 2px);
    outline: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
    
    &:hover {
      background-color: hsl(var(--accent));
      border-color: hsl(var(--border));
    }
    
    &:focus {
      border-color: hsl(var(--ring));
      box-shadow: 0 0 0 3px hsl(var(--ring) / 0.1);
    }
  }
  
  .zoom-wrapper {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 4px;
    background: hsl(var(--muted) / 0.5);
    padding: 4px;
    border-radius: calc(var(--radius) - 2px);
  }
  
  .zoom-wrapper span {
    font-size: 12px;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    padding: 0 8px;
    min-width: 45px;
    text-align: center;
  }
  
  .zoom-wrapper button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: hsl(var(--background));
    border: none;
    border-radius: calc(var(--radius) - 4px);
    color: hsl(var(--foreground));
    cursor: pointer;
    transition: all 0.15s ease;
    
    &:hover {
      background: hsl(var(--accent));
      color: hsl(var(--primary));
    }
    
    &:active {
      transform: scale(0.92);
    }
    
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
  
  .gantt-container {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: calc(var(--radius));
    overflow: hidden;
    transition: all 0.2s ease;
  }
  
  .gantt-container .popup-wrapper {
    background: hsl(var(--popover));
    border: 1px solid hsl(var(--border));
    border-radius: calc(var(--radius) - 2px);
    box-shadow: 0 10px 40px hsl(var(--foreground) / 0.15);
    color: hsl(var(--popover-foreground));
    padding: 12px;
    font-size: 13px;
  }
  
  .gantt .today-highlight {
    fill: hsl(var(--destructive));
    opacity: 0.15;
    width: 2px;
  }
  
  .gantt .handle {
    display: none;
  }

  svg.gantt {
    transform: scale(${props => props.zoom || 1});
    transform-origin: top left;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: hsl(var(--card));
  }

  .gantt .bar, 
  .gantt .bar-progress {
    height: 32px;
    rx: 6;
    ry: 6;
  }
  
  .tick.thick {
    stroke: hsl(var(--border));
    stroke-width: 1;
  }
  
  .tick {
    stroke: hsl(var(--border) / 0.3);
    stroke-width: 1;
  }

  .gantt .arrow {
    display: none;
  }
  
  .gantt .bar-label {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .parent text.bar-label.big {
    font-weight: 700;
    font-size: 12px;
  }

  rect.grid-row {
    transition: fill 0.2s ease;
  }

  rect.grid-row.parent-row {
    fill: hsl(var(--background));
  }
  
  rect.grid-row.child-row {
    fill: hsl(var(--muted) / 0.2);
  }
  
  line.row-line {
    stroke: hsl(var(--border) / 0.4);
    stroke-width: 1;
  }
  
  line.row-line.child-line {
    stroke: hsl(var(--border) / 0.2);
  }

  .gantt .bar-wrapper.child {
    display: inline;
  }
  
  .gantt .bar-wrapper.child.hide {
    display: none;
  }
  
  .gantt .bar-wrapper:hover .bar {
    fill: inherit;
    opacity: 0.9;
    filter: brightness(1.05);
  }
  
  /* Status: Completed */
  .completed .bar, 
  .completed .bar-progress, 
  .gantt .completed:hover .bar,
  .gantt .completed:hover .bar-progress,
  .gantt .completed.active .bar,
  .gantt .completed.active .bar-progress {
    fill: hsl(221 83% 53%);
  }
  
  .gantt .completed .bar-label:not(.big) {
    fill: hsl(0 0% 100%);
    font-weight: 600;
  }
  
  /* Status: Not Started */
  .not_started .bar,  
  .not_started .bar-progress, 
  .gantt .not_started:hover .bar,
  .gantt .not_started:hover .bar-progress,
  .gantt .not_started.active .bar,
  .gantt .not_started.active .bar-progress {
    fill: hsl(var(--muted));
  }
  
  .gantt .not_started .bar-label {
    fill: hsl(var(--muted-foreground));
  }
  
  /* Status: Past Deadline */
  .ongoing_past_deadline .bar,  
  .ongoing_past_deadline .bar-progress, 
  .gantt .ongoing_past_deadline:hover .bar,
  .gantt .ongoing_past_deadline:hover .bar-progress,
  .gantt .ongoing_past_deadline.active .bar,
  .gantt .ongoing_past_deadline.active .bar-progress {
    fill: hsl(0 84% 65%);
  }
  
  .gantt .ongoing_past_deadline .bar-label {
    fill: hsl(0 0% 100%);
    font-weight: 600;
  }

  /* Status: Within Deadline */
  .ongoing_within_deadline .bar, 
  .ongoing_within_deadline .bar-progress, 
  .gantt .ongoing_within_deadline:hover .bar,
  .gantt .ongoing_within_deadline:hover .bar-progress,
  .gantt .ongoing_within_deadline.active .bar,
  .gantt .ongoing_within_deadline.active .bar-progress {
    fill: hsl(43 96% 56%);
  }
  
  .gantt .ongoing_within_deadline .bar-label {
    fill: hsl(43 96% 20%);
    font-weight: 600;
  }
  
  .bar-label {
    fill: hsl(var(--foreground));
  }
  
  .gantt .grid-background {
    fill: hsl(var(--card));
  }
  
  .gantt .grid-header {
    fill: hsl(var(--muted) / 0.5);
  }
  
  .gantt text {
    fill: hsl(var(--foreground));
    font-family: 'Inter', -apple-system, sans-serif;
  }
  
  .gantt .upper-text {
    fill: hsl(var(--foreground));
    font-weight: 600;
    font-size: 12px;
  }
  
  .gantt .lower-text {
    fill: hsl(var(--muted-foreground));
    font-weight: 500;
    font-size: 11px;
  }

  @media print {

    .ant-layout.ant-layout-has-sider > .ant-layout {
      overflow: hidden;
    }
    .gantt-control + div {
      overflow: hidden !important;
    }
    /* width */
    .ant-layout.ant-layout-has-sider > .ant-layout::-webkit-scrollbar {
      width: 1px;
    }

    /* Track */
    .ant-layout.ant-layout-has-sider > .ant-layout::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    .ant-layout.ant-layout-has-sider > .ant-layout::-webkit-scrollbar-thumb {
      background: #888;
    }

    /* Handle on hover */
    .ant-layout.ant-layout-has-sider > .ant-layout::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    svg.gantt {
      transform: scale(${props => props.ganttWidth ? `${(props.clientWidth / props.ganttWidth)}` : .50});
      transform-origin: top left;
    }
    
    .tick {
      /* stroke: none !important; */
    }
  }
`;