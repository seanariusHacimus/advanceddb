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
  
  .gantt-select {
    margin-left: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    border: none;
    background: no-repeat;
    color: var(--blue);
    text-align: right;
    border-radius: 4px;
    outline: none;
  }
  .gantt-container .popup-wrapper {
    background-color: #535263;
    border-radius: 5px;
  }
  .gantt .today-highlight {
    fill: #EB495B;
    opacity: 0.5;
    width: 1px;
    transform: translateX(19px);
  }
  .gantt .handle {
    display: none;
  }

  svg.gantt {
    transform: scale(${props => props.zoom || 1});
    transform-origin: top center;
    transition: transform 1.2s;
    transition-timing-function: ease-ease-in-out;
  }
  .zoom-wrapper {
    margin-left: auto;
    font-size: 7px; 
  }
  .zoom-wrapper span {
    margin-right: 3px;
  }
  .zoom-wrapper button{
    background-color: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
  .zoom-wrapper button:hover {
    color: var(--blue);
  }

  .gantt .bar, 
  .gantt .bar-progress {
    height: 30px;
    transform: translateY(-2px);
  }
  .tick.thick {
    stroke-width: .2;
  }

  .gantt .arrow {
    stroke: none;
  }
  .gantt .bar-label {
    transform: translate(0px, 1px);
  }

  .parent text.bar-label.big {
    font-weight: 700;
  }

  rect.grid-row.parent-row {
    fill: #fff;
  }
  rect.grid-row.child-row {
    fill: #f3f3f4;
  }
  line.row-line.child-line {
    stroke: transparent;
  }

  .gantt .bar-wrapper.child {
    display: inline;
  }
  .gantt .bar-wrapper.child.hide {
    display: none;
  }
  .gantt .bar-wrapper:hover .bar {
    fill: inherit;
  }
  .completed .bar, 
  .completed .bar-progress, 
  .gantt .completed:hover .bar,
  .gantt .completed:hover .bar-progress,
  .gantt .completed.active .bar,
  .gantt .completed.active .bar-progress {
    fill: #527BDD;
  }
  .gantt .completed .bar-label:not(.big) {
    fill: #fff;
  }
  .bar-label {
    fill: rgba(37, 42, 50, 0.76);
  }
  .not_started .bar,  
  .not_started .bar-progress, 
  .gantt .not_started:hover .bar,
  .gantt .not_started:hover .bar-progress,
  .gantt .not_started.active .bar,
  .gantt .not_started.active .bar-progress {
    fill: #ECEEF4;
  }
  .ongoing_past_deadline .bar,  
  .ongoing_past_deadline .bar-progress, 
  .gantt .ongoing_past_deadline:hover .bar,
  .gantt .ongoing_past_deadline:hover .bar-progress,
  .gantt .ongoing_past_deadline.active .bar,
  .gantt .ongoing_past_deadline.active .bar-progress {
    fill: #FFC6CC;
  }

  .ongoing_within_deadline .bar, 
  .ongoing_within_deadline .bar-progress, 
  .gantt .ongoing_within_deadline:hover,
  .gantt .ongoing_within_deadline:hover .bar-progress,
  .gantt .ongoing_within_deadline.active .bar,
  .gantt .ongoing_within_deadline.active .bar-progress {
    fill: #F8DD96;
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