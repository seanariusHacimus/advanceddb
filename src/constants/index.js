import { getDefaultCountry } from "../utils/settings";

export { default as colors } from "./colors";
export { default as indicators } from "./indicators";

export const indicatorStatus = {
  not_started: "Not started",
  completed: "Completed",
  ongoing_within_deadline: "In Progress",
  ongoing_past_deadline: "Past Due",
  on_review: "Under Review",
};

// Get default country from settings/localStorage, fallback to hardcoded default
const getDefaultCountrySetting = () => {
  try {
    const country = getDefaultCountry();
    return { ...country, lang: "" };
  } catch (error) {
    console.error("Error getting default country:", error);
    return { code: "KGZ", name: "Kyrgyz Republic", lang: "" };
  }
};

export default {
  animationSpeed: 1500,
  get defaultCountry() {
    return getDefaultCountrySetting();
  },
  defaultListSize: 4,
  doingBusiness: { score: 41.3, rank: 177 },
  rocketChatUrl: process.env.REACT_APP_ROCKET_BASE_URL,
  autoRefreshInterval: 30000, // in milliseconds
};
