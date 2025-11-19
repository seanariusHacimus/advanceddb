import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { ZoomIn, ZoomOut, Calendar, ChevronRight, ChevronDown } from 'lucide-react';
import moment from 'moment';
import { withLocale } from '../../../../utils/locale';
import { Tooltip } from '../../../UI/shadcn';

const GanttContainer = styled.div`
  background: transparent;
`;

const ControlBar = styled.div`
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 6px 32px 6px 10px;
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  color: hsl(var(--foreground));
  border-radius: calc(var(--radius) - 2px);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;
  
  &:hover {
    background-color: hsl(var(--accent));
  }
  
  &:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 3px hsl(var(--ring) / 0.1);
  }
`;

const ZoomControls = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  background: hsl(var(--muted) / 0.4);
  padding: 4px;
  border-radius: calc(var(--radius) - 2px);
`;

const ZoomButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: hsl(var(--background));
  border: none;
  border-radius: calc(var(--radius) - 4px);
  color: hsl(var(--foreground));
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover:not(:disabled) {
    background: hsl(var(--accent));
    color: hsl(var(--primary));
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ZoomLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: hsl(var(--muted-foreground));
  padding: 0 6px;
  min-width: 40px;
  text-align: center;
`;

const ChartWrapper = styled.div`
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
  overflow: hidden;
`;

const ChartScroll = styled.div`
  overflow-x: auto;
  overflow-y: auto;
  max-height: 600px;
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.3);
  }
  
  &::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.3);
    border-radius: 4px;
    
    &:hover {
      background: hsl(var(--muted-foreground) / 0.5);
    }
  }
`;

const ChartContent = styled.div`
  min-width: 100%;
  display: flex;
  flex-direction: column;
  transform: scale(${props => props.zoom});
  transform-origin: top left;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TimelineHeader = styled.div`
  display: flex;
  border-bottom: 1px solid hsl(var(--border));
  background: hsl(var(--muted) / 0.3);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TaskColumn = styled.div`
  min-width: 320px;
  max-width: 320px;
  flex-shrink: 0;
  padding: 12px 16px;
  background: hsl(var(--muted) / 0.5);
  border-right: 1px solid hsl(var(--border));
  font-weight: 600;
  font-size: 12px;
  color: hsl(var(--foreground));
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TimelineColumns = styled.div`
  flex: 1;
  display: flex;
`;

const TimeColumn = styled.div`
  min-width: ${props => props.width}px;
  padding: 8px 4px;
  text-align: center;
  border-right: 1px solid hsl(var(--border) / 0.3);
  font-size: 11px;
  font-weight: 600;
  color: hsl(var(--muted-foreground));
  
  &:last-child {
    border-right: none;
  }
`;

const TaskRow = styled.div`
  display: flex;
  border-bottom: 1px solid hsl(var(--border) / 0.5);
  min-height: 48px;
  transition: background 0.15s ease;
  background: ${props => props.isChild ? 'hsl(var(--muted) / 0.15)' : 'transparent'};
  
  &:hover {
    background: ${props => props.isChild ? 'hsl(var(--muted) / 0.25)' : 'hsl(var(--muted) / 0.1)'};
  }
`;

const TaskInfo = styled.div`
  min-width: 320px;
  max-width: 320px;
  flex-shrink: 0;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.isChild ? 'hsl(var(--muted) / 0.1)' : 'hsl(var(--card))'};
  border-right: 1px solid hsl(var(--border));
  padding-left: ${props => props.isChild ? '40px' : '16px'};
`;

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;
  
  &:hover {
    background: hsl(var(--accent));
    color: hsl(var(--foreground));
  }
`;

const TaskName = styled.div`
  flex: 1;
  font-size: 13px;
  font-weight: ${props => props.isParent ? '600' : '500'};
  color: hsl(var(--foreground));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  
  &:hover {
    color: hsl(var(--primary));
  }
`;

const TimelineGrid = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  align-items: center;
  padding: 8px 0;
  min-height: 44px;
`;

const GridCell = styled.div`
  min-width: ${props => props.width}px;
  height: 100%;
  border-right: 1px solid hsl(var(--border) / 0.15);
  flex-shrink: 0;
  
  &:last-child {
    border-right: none;
  }
`;

const BarsContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const TaskBar = styled.div`
  position: absolute;
  left: ${props => props.left}px;
  width: ${props => props.width}px;
  height: 28px;
  background: ${props => props.color};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.textColor};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px hsl(var(--foreground) / 0.1);
  pointer-events: auto;
  
  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
    box-shadow: 0 3px 8px hsl(var(--foreground) / 0.2);
    z-index: 10;
  }
`;

const TaskBarText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
  display: ${props => props.width < 80 ? 'none' : 'block'};
`;

const TodayLine = styled.div`
  position: absolute;
  left: ${props => props.position}px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: hsl(var(--destructive));
  opacity: 0.3;
  z-index: 5;
  pointer-events: none;
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: hsl(var(--muted-foreground));
  
  svg {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px;
    color: hsl(var(--foreground));
  }
  
  p {
    font-size: 14px;
    margin: 0;
  }
`;

const CustomGantt = ({ data, t }) => {
  const [viewMode, setViewMode] = useState('Month');
  const [zoom, setZoom] = useState(1);
  const [expandedTasks, setExpandedTasks] = useState([]);
  const scrollRef = useRef(null);

  const statusColors = {
    completed: { bg: 'hsl(221 83% 53%)', text: 'hsl(0 0% 100%)' },
    ongoing_within_deadline: { bg: 'hsl(43 96% 56%)', text: 'hsl(43 96% 20%)' },
    ongoing_past_deadline: { bg: 'hsl(0 84% 65%)', text: 'hsl(0 0% 100%)' },
    not_started: { bg: 'hsl(var(--muted))', text: 'hsl(var(--muted-foreground))' },
  };

  const columnWidth = useMemo(() => {
    switch (viewMode) {
      case 'Day': return 60;
      case 'Week': return 80;
      case 'Month': return 100;
      default: return 100;
    }
  }, [viewMode]);

  const { startDate, endDate, totalColumns } = useMemo(() => {
    if (!data || data.length === 0) {
      return { startDate: moment(), endDate: moment().add(3, 'months'), totalColumns: 0 };
    }

    let minDate = moment(data[0].start_at);
    let maxDate = moment(data[0].end_at);

    data.forEach(action => {
      const start = moment(action.start_at);
      const end = moment(action.end_at);
      if (start.isBefore(minDate)) minDate = start;
      if (end.isAfter(maxDate)) maxDate = end;

      action.sub_actions?.forEach(sub => {
        const subStart = moment(sub.start_at);
        const subEnd = moment(sub.end_at);
        if (subStart.isBefore(minDate)) minDate = subStart;
        if (subEnd.isAfter(maxDate)) maxDate = subEnd;
      });
    });

    minDate = minDate.clone().subtract(1, viewMode.toLowerCase());
    maxDate = maxDate.clone().add(1, viewMode.toLowerCase());

    const unit = viewMode.toLowerCase();
    const columns = maxDate.diff(minDate, unit) + 1;

    return { startDate: minDate, endDate: maxDate, totalColumns: columns };
  }, [data, viewMode]);

  const timeColumns = useMemo(() => {
    const columns = [];
    const current = startDate.clone();
    
    for (let i = 0; i < totalColumns; i++) {
      columns.push({
        date: current.clone(),
        label: viewMode === 'Day' 
          ? current.format('DD MMM')
          : viewMode === 'Week'
          ? `W${current.week()}`
          : current.format('MMM YYYY')
      });
      current.add(1, viewMode.toLowerCase());
    }
    
    return columns;
  }, [startDate, totalColumns, viewMode]);

  const todayPosition = useMemo(() => {
    const today = moment();
    const unit = viewMode.toLowerCase();
    const diff = today.diff(startDate, unit, true);
    return diff * columnWidth;
  }, [startDate, viewMode, columnWidth]);

  const calculateBarPosition = (start, end) => {
    const unit = viewMode.toLowerCase();
    const startDiff = moment(start).diff(startDate, unit, true);
    const duration = moment(end).diff(moment(start), unit, true);
    
    return {
      left: startDiff * columnWidth,
      width: Math.max(duration * columnWidth, 20)
    };
  };

  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleZoom = (direction) => {
    if (direction === 'in' && zoom < 2) {
      setZoom(prev => Math.min(prev + 0.1, 2));
    } else if (direction === 'out' && zoom > 0.5) {
      setZoom(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  if (!data || data.length === 0) {
    return (
      <GanttContainer>
        <ControlBar>
          <Calendar size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'hsl(var(--foreground))' }}>
            {t('Gantt Chart')}
          </span>
        </ControlBar>
        <ChartWrapper>
          <EmptyState>
            <Calendar />
            <h3>{t('No Tasks Available')}</h3>
            <p>{t('Add tasks to see them in the timeline')}</p>
          </EmptyState>
        </ChartWrapper>
      </GanttContainer>
    );
  }

  return (
    <GanttContainer>
      <ControlBar>
        <Calendar size={16} style={{ color: 'hsl(var(--muted-foreground))' }} />
        <Select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value="Day">{t('Day')}</option>
          <option value="Week">{t('Week')}</option>
          <option value="Month">{t('Month')}</option>
        </Select>
        
        <ZoomControls>
          <ZoomButton 
            onClick={() => handleZoom('out')} 
            disabled={zoom <= 0.5}
            title={t('Zoom out')}
          >
            <ZoomOut size={13} />
          </ZoomButton>
          <ZoomLabel>{(zoom * 100).toFixed(0)}%</ZoomLabel>
          <ZoomButton 
            onClick={() => handleZoom('in')} 
            disabled={zoom >= 2}
            title={t('Zoom in')}
          >
            <ZoomIn size={13} />
          </ZoomButton>
        </ZoomControls>
      </ControlBar>

      <ChartWrapper>
        <ChartScroll ref={scrollRef}>
          <ChartContent zoom={zoom}>
            {/* Header */}
            <TimelineHeader>
              <TaskColumn>{t('Task')}</TaskColumn>
              <TimelineColumns>
                {timeColumns.map((col, idx) => (
                  <TimeColumn key={idx} width={columnWidth}>
                    {col.label}
                  </TimeColumn>
                ))}
              </TimelineColumns>
            </TimelineHeader>

            {/* Tasks */}
            {data.map((action, index) => {
              const isExpanded = expandedTasks.includes(action.id);
              const hasSubActions = action.sub_actions && action.sub_actions.length > 0;
              const barPos = calculateBarPosition(action.start_at, action.end_at);
              const colors = statusColors[action.status] || statusColors.not_started;

              return (
                <React.Fragment key={action.id}>
                  {/* Parent Task */}
                  <TaskRow>
                    <TaskInfo>
                      {hasSubActions && (
                        <ExpandButton onClick={() => toggleExpand(action.id)}>
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </ExpandButton>
                      )}
                      {!hasSubActions && <div style={{ width: '20px' }} />}
                      <Tooltip content={action.name} side="top">
                        <TaskName isParent>{index + 1}. {action.name}</TaskName>
                      </Tooltip>
                    </TaskInfo>
                    <TimelineGrid>
                      {timeColumns.map((_, idx) => (
                        <GridCell key={idx} width={columnWidth} />
                      ))}
                      <BarsContainer>
                        <Tooltip 
                          content={
                            <div style={{ fontSize: '12px' }}>
                              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{action.name}</div>
                              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                                {moment(action.start_at).format('MMM DD, YYYY')} - {moment(action.end_at).format('MMM DD, YYYY')}
                              </div>
                            </div>
                          }
                          side="top"
                        >
                          <TaskBar
                            left={barPos.left}
                            width={barPos.width}
                            color={colors.bg}
                            textColor={colors.text}
                          >
                            <TaskBarText width={barPos.width}>{action.name}</TaskBarText>
                          </TaskBar>
                        </Tooltip>
                        {index === 0 && <TodayLine position={todayPosition} />}
                      </BarsContainer>
                    </TimelineGrid>
                  </TaskRow>

                  {/* Sub Actions */}
                  {isExpanded && hasSubActions && action.sub_actions.map((subAction, subIdx) => {
                    const subBarPos = calculateBarPosition(subAction.start_at, subAction.end_at);
                    const subColors = statusColors[subAction.status] || statusColors.not_started;

                    return (
                      <TaskRow key={subAction.id} isChild>
                        <TaskInfo isChild>
                          <div style={{ width: '20px' }} />
                          <Tooltip content={subAction.name} side="top">
                            <TaskName>{index + 1}.{subIdx + 1}. {subAction.name}</TaskName>
                          </Tooltip>
                        </TaskInfo>
                        <TimelineGrid>
                          {timeColumns.map((_, idx) => (
                            <GridCell key={idx} width={columnWidth} />
                          ))}
                          <BarsContainer>
                            <Tooltip 
                              content={
                                <div style={{ fontSize: '12px' }}>
                                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{subAction.name}</div>
                                  <div style={{ fontSize: '11px', opacity: 0.9 }}>
                                    {moment(subAction.start_at).format('MMM DD, YYYY')} - {moment(subAction.end_at).format('MMM DD, YYYY')}
                                  </div>
                                </div>
                              }
                              side="top"
                            >
                              <TaskBar
                                left={subBarPos.left}
                                width={subBarPos.width}
                                color={subColors.bg}
                                textColor={subColors.text}
                              >
                                <TaskBarText width={subBarPos.width}>{subAction.name}</TaskBarText>
                              </TaskBar>
                            </Tooltip>
                          </BarsContainer>
                        </TimelineGrid>
                      </TaskRow>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </ChartContent>
        </ChartScroll>
      </ChartWrapper>
    </GanttContainer>
  );
};

export default withLocale(CustomGantt);

