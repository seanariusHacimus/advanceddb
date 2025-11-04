import styled from "styled-components";
import { Card, Input } from "antd";

export const SettingsContainer = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

export const StyledCard = styled(Card)`
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  border: 1px solid #e2e4ed;

  .ant-card-head {
    border-bottom: 1px solid #e2e4ed;
  }

  .ant-card-head-title {
    font-size: 20px;
    font-weight: 700;
    color: #527bdd;
  }
  .ant-card-body {
    display: flex;
    gap: 16px;
  }
`;

export const ColorInputWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;

  label {
    min-width: 100px;
    font-weight: 500;
    color: #252a32;
  }
`;

export const ColorInput = styled(Input)`
  width: 120px;
  padding: 0;

  input {
    padding: 8px 12px;
    font-family: monospace;
  }
`;

export const ColorPreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${(props) => props.color || "#ccc"};
  border: 2px solid #e2e4ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const SettingsTitle = styled.h1`
  margin-bottom: 24px;
  color: #527bdd;
  font-size: 32px;
`;

