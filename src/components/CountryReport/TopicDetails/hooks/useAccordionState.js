import { useState, useCallback, useEffect } from "react";

export const useAccordionState = (categories = [], selectedPillar = "all") => {
  // Categories are expanded by default, subcategories and indicators are collapsed by default
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  // Indicators are collapsed by default
  const [expandedIndicators, setExpandedIndicators] = useState({});

  // Initialize default expansion states
  useEffect(() => {
    const initialCategories = {};
    const initialSubcategories = {};

    categories.forEach((category, categoryIndex) => {
      const categoryKey = `category-${category.pillarNumber}-${category.id}-${categoryIndex}`;

      // Collapse all categories when selectedPillar is "all"
      // Expand only the first category when selectedPillar is "I", "II", or "III"
      if (selectedPillar === "all") {
        initialCategories[categoryKey] = false;
      } else {
        // For specific pillars, expand only the first category
        initialCategories[categoryKey] = categoryIndex === 0;
      }

      if (Array.isArray(category.subCategories)) {
        category.subCategories.forEach((subCategory, subCategoryIndex) => {
          const subCategoryKey = `subcategory-${category.pillarNumber}-${category.id}-${subCategory.id}-${subCategoryIndex}`;
          // Subcategories are collapsed by default
          initialSubcategories[subCategoryKey] = false;
        });
      }
    });

    setExpandedCategories(initialCategories);
    setExpandedSubcategories(initialSubcategories);
  }, [categories, selectedPillar]);

  const toggleCategory = useCallback((categoryKey) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  }, []);

  const toggleSubcategory = useCallback((subcategoryKey) => {
    setExpandedSubcategories((prev) => ({
      ...prev,
      [subcategoryKey]: !prev[subcategoryKey],
    }));
  }, []);

  const toggleIndicator = useCallback((indicatorKey) => {
    setExpandedIndicators((prev) => ({
      ...prev,
      [indicatorKey]: !prev[indicatorKey],
    }));
  }, []);

  return {
    expandedCategories,
    expandedSubcategories,
    expandedIndicators,
    toggleCategory,
    toggleSubcategory,
    toggleIndicator,
  };
};
