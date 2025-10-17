import PILLARS_SCORE_ITEMS_MAP from "../assets/pillars_scores/pillars_score_items_map.json";

export function getPillarCategories({ indicator, pillar }) {
  console.log({ indicator, pillar });

  return (
    Object.keys(PILLARS_SCORE_ITEMS_MAP[indicator]?.[`PILLAR ${pillar}`]) || []
  );
}

export function getPillarSubCategories({ indicator, pillar, category }) {
  return (
    Object.keys(
      PILLARS_SCORE_ITEMS_MAP[indicator]?.[`PILLAR ${pillar}`]?.[category]
    ) || []
  );
}
