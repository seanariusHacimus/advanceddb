import styled from "styled-components";
import { Collapse } from "antd";

const { Panel } = Collapse;

export const PillarContainer = styled.div`
  margin-bottom: 20px;
`;

export const StyledCollapse = styled(Collapse)`
  background: transparent;
  border: none;

  .ant-collapse-item.ant-collapse-item-active {
    background: #f3f4f9;
    border-color: #527bdd;
  }
  .ant-collapse-item {
    margin-bottom: 15px;
    border: 1px solid #e2e4ed;
    border-radius: 8px;
    background: #f8f9fa;

    &:hover {
      background: #f3f4f9;
      border-color: #527bdd;
    }
  }

  .ant-collapse-header {
    background: transparent;
    border-bottom: none;
    padding: 20px;
  }

  .ant-collapse-content {
    background: #fff;
    border-top: none;
  }

  .ant-collapse {
    border: none;
  }
  .ant-collapse-content-box {
    padding: 8px 0px 8px 20px;
  }

  .ant-collapse-item {
    border: none;
    border-left: 3px solid #d4dff7;
    border-radius: 0;
  }
`;

export const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const CategoryTitle = styled.div`
  color: #252a32;
  font-size: 16px;
  font-weight: 600;
`;

export const CategoryScore = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const ScoreText = styled.div`
  color: #527bdd;
  font-size: 14px;
  font-weight: 600;
  width: 100px;
  text-align: right;
`;

export const ProgressContainer = styled.div`
  width: ${(props) => props.width || "150px"};

  .ant-progress-inner {
    background-color: #e9e9e9;
  }
`;

export const SubcategoryCollapse = styled(Collapse)`
  margin-top: 15px;

  &.ant-collapse-item-active {
    border-color: rgb(82, 123, 221);
  }

  &.subcategory-collapse {
    border: none;
    background: transparent;
  }
  .ant-collapse-item {
    margin-bottom: 10px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    background: #fff;
    padding: 0 0 0 0;
  }

  .ant-collapse-item:hover {
    background: #ffffff;
  }

  .ant-collapse-header {
    background: #f8f9fa;
    border-radius: 12px;
    border: none;
    padding: 8px 16px;
  }

  .ant-collapse-content {
    background: #fff;
    border-top: 1px solid #f0f0f0;
  }

  .ant-collapse-content-box {
    padding: 0 0px 20px 16px !important;
  }
`;

export const IndicatorCollapse = styled(Collapse)`
  margin-top: 10px;

  .ant-collapse-item {
    margin-bottom: 8px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    background: #fff;
  }

  .ant-collapse-header {
    background: transparent !important;
    border-bottom: none !important;
    padding: 8px 16px !important;
  }

  .ant-collapse-content {
    background: #fff;
    border-top: 1px solid #f0f0f0;
  }

  .ant-collapse-content-box {
    padding: 0 16px 8px 16px !important;
  }

  .indicator-panel {
    border: none !important;
    margin-bottom: 0;
  }
`;

export const IndicatorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const IndicatorName = styled.div`
  color: #252a32;
  font-size: 13px;
  font-weight: 500;
`;

export const IndicatorScore = styled.div`
  color: #527bdd;
  font-size: 13px;
  font-weight: 600;
  width: 100px;
  text-align: right;
`;

export const IndicatorDetails = styled.div`
  margin-top: 8px;
  padding-left: 20px;
  color: #666;
  font-size: 12px;
`;

export const QuestionIcon = styled.span`
  cursor: pointer;
  color: #527bdd;
  font-size: 16px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  &:hover {
    color: #3d5fd1;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;
