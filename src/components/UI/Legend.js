import React from "react";
import { withLocale } from "../../utils/locale";
import PropTypes from "prop-types";
import styled from "styled-components";

const LegendContainer = styled.div`
  margin-top: 20px;
  padding: 24px 32px;
  background: hsl(var(--card));
  border-radius: 12px;
  border: 1px solid hsl(var(--border));
  transition: all 0.2s ease;
`;

const LegendTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LegendItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid hsl(var(--border));

  &.pillar-1 {
    background-color: hsl(221 83% 53%);
  }

  &.pillar-2 {
    background-color: hsl(142 76% 36%);
  }

  &.pillar-3 {
    background-color: hsl(25 95% 53%);
  }
`;

const LegendText = styled.span`
  font-size: 14px;
  color: hsl(var(--muted-foreground));
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
