import React from "react";
import styled from "styled-components";
import { withLocale } from "../../../../utils/locale";
import PropTypes from "prop-types";

const FilterContainer = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 30px;
  background: #f3f4f9;
  border-radius: 8px;
  padding: 4px;
`;

const FilterItem = styled.div`
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  color: #717a8f;

  &.active {
    background: #717a8f;
    color: #fff;
  }

  &:hover:not(.active) {
    background: #e5e7ef;
    color: #252a32;
  }
`;

const PillarFilter = ({
  pillars,
  selectedPillar,
  onPillarSelect,
  showNextButton = true,
  t,
}) => {
  return (
    <FilterContainer>
      <FilterItem
        className={selectedPillar === "all" ? "active" : ""}
        onClick={() => onPillarSelect("all")}
      >
        {t("All Pillars")}
      </FilterItem>

      {pillars.map((pillar) => {
        // Extract just the pillar number (e.g., "Pillar I" from "Pillar I - Regulatory Framework")
        const pillarNumber = pillar.name.split(" - ")[0];
        return (
          <FilterItem
            key={pillar.id}
            className={selectedPillar === pillar.id ? "active" : ""}
            onClick={() => onPillarSelect(pillar.id)}
          >
            {t(pillarNumber)}
          </FilterItem>
        );
      })}

      {showNextButton && selectedPillar === "all" && (
        <FilterItem
          onClick={() => onPillarSelect("pillar_i")}
          title={t("Next pillar")}
        >
          {t("Next")}
        </FilterItem>
      )}
    </FilterContainer>
  );
};

PillarFilter.propTypes = {
  pillars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedPillar: PropTypes.string.isRequired,
  onPillarSelect: PropTypes.func.isRequired,
  showNextButton: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

export default withLocale(PillarFilter);
