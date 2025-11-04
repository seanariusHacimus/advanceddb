const SETTINGS_STORAGE_KEY = "app_settings";

// Default settings
const DEFAULT_SETTINGS = {
  defaultCountry: {
    code: "KGZ",
    name: "Kyrgyz Republic",
  },
  chartColors: {
    pillar_i: "#193cb9",
    pillar_ii: "#155dfc",
    pillar_iii: "#8ec5ff",
  },
  showCountrySelect: true, // Enable country select by default
};

/**
 * Get all settings from localStorage
 */
export const getSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading settings from localStorage:", error);
  }
  return DEFAULT_SETTINGS;
};

/**
 * Save settings to localStorage
 */
export const saveSettings = (settings) => {
  try {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    return updatedSettings;
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
    throw error;
  }
};

/**
 * Get default country from settings
 */
export const getDefaultCountry = () => {
  const settings = getSettings();
  return settings.defaultCountry || DEFAULT_SETTINGS.defaultCountry;
};

/**
 * Save default country
 */
export const saveDefaultCountry = (countryCode, countryName) => {
  return saveSettings({
    defaultCountry: {
      code: countryCode,
      name: countryName,
    },
  });
};

/**
 * Get chart colors from settings
 */
export const getChartColors = () => {
  const settings = getSettings();
  return settings.chartColors || DEFAULT_SETTINGS.chartColors;
};

/**
 * Save chart colors
 */
export const saveChartColors = (colors) => {
  return saveSettings({
    chartColors: colors,
  });
};

/**
 * Get show country select setting
 */
export const getShowCountrySelect = () => {
  const settings = getSettings();
  return settings.showCountrySelect !== undefined
    ? settings.showCountrySelect
    : DEFAULT_SETTINGS.showCountrySelect;
};

/**
 * Save show country select setting
 */
export const saveShowCountrySelect = (show) => {
  return saveSettings({
    showCountrySelect: show,
  });
};

/**
 * Reset settings to default
 */
export const resetSettings = () => {
  try {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(DEFAULT_SETTINGS)
    );
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error resetting settings:", error);
    throw error;
  }
};

export { DEFAULT_SETTINGS };
