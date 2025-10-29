import React from "react";
import { withLocale } from "../../utils/locale";
import PropTypes from "prop-types";
import styled from "styled-components";

const LegendContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e4ed;
`;

const LegendTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #252a32;
  margin-bottom: 12px;
`;

const LegendItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;

  &.pillar-1 {
    background-color: #527bdd;
  }

  &.pillar-2 {
    background-color: #52c41a;
  }

  &.pillar-3 {
    background-color: #fa8c16;
  }
`;

const LegendText = styled.span`
  font-size: 13px;
  color: #666;
  font-weight: 500;
`;

const Legend = ({ t }) => {
  const legendItems = [
    {
      id: 1,
      color: "pillar-1",
      label: t("Pillar I - Regulatory Framework"),
    },
    {
      id: 2,
      color: "pillar-2",
      label: t("Pillar II - Public Services"),
    },
    {
      id: 3,
      color: "pillar-3",
      label: t("Pillar III - Operational Efficiency"),
    },
  ];

  return (
    <LegendContainer>
      <LegendTitle>{t("LEGEND:")}</LegendTitle>
      <LegendItems>
        {legendItems.map((item) => (
          <LegendItem key={item.id}>
            <LegendColor className={item.color} />
            <LegendText>{item.label}</LegendText>
          </LegendItem>
        ))}
      </LegendItems>
    </LegendContainer>
  );
};

Legend.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withLocale(Legend);
