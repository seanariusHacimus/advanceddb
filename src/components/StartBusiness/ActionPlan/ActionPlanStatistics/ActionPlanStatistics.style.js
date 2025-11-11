import styled from "styled-components";

export const TaskProgressContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background: hsl(var(--primary) / 0.5);
    border-radius: 3px;
    
    &:hover {
      background: hsl(var(--primary) / 0.7);
    }
  }
`;

export const OverdueActionsContainer = styled(TaskProgressContainer)`
  .overdue__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    padding: 8px 0px;
    gap: 8px;
    margin-right: 24px;
  }
  .sub-action {
    background: hsl(var(--muted) / 0.2);
    transition: background-color 0.3s ease;
  }
  .ant-collapse-content {
    overflow: visible;
  }
  .ant-collapse-borderless
    > .ant-collapse-item
    > .ant-collapse-content
    > .ant-collapse-content-box {
    padding-top: 0;
  }

  .overdue__item__date {
    white-space: nowrap;
    min-width: 60px;
    margin-bottom: 4px;
    font-size: 12px;
    color: var(--danger);

    b {
      font-size: 16px;
      color: var(--danger);
    }
  }
  .overdue__item__title {
    margin: 0 5px;
    flex: 1;
  }
  .overdue__item__deadline {
    font-size: 12px;
    letter-spacing: 0px;
  }
  .overdue__item > d {
    align-items: center;
  }

  .more-action-btn-container {
    position: absolute;
    right: -4px;
  }
`;
