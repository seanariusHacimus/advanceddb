import { uniqBy } from "lodash";
import { INDICATORS_BY_TOPIC } from "../../../constants/reports/indicatorDataWithTopic";

export const getIndicatorByTopicName = (topicName) => {
  return (INDICATORS_BY_TOPIC[topicName] || []).map((item) => ({
    ...item,
    value: item.indicator_name,
  }));
};

export const getCategoriesByPillar = (topicName, pillar) => {
  const categories = (INDICATORS_BY_TOPIC[topicName] || [])
    .filter((item) => item.pillar_number === pillar)
    .map((item) => ({
      ...item,
      value: item.category_name,
    }));

  return uniqBy(categories, "value");
};

export const getSubcategoriesByCategory = (topicName, category) => {
  const subcategories = (INDICATORS_BY_TOPIC[topicName] || [])
    .filter((item) => item.category_name === category)
    .map((item) => ({
      ...item,
      value: item.subcategory_name,
    }));

  return uniqBy(subcategories, "value");
};
