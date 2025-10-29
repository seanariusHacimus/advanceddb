export { default as colors } from "./colors";
export { default as indicators } from "./indicators";

export const indicatorStatus = {
  not_started: "Not started",
  completed: "Completed",
  ongoing_within_deadline: "In Progress",
  ongoing_past_deadline: "Past Due",
  on_review: "Under Review",
};

export default {
  animationSpeed: 1500,
  defaultCountry: { code: "KGZ", name: "Kyrgyz Republic", lang: "" },
  defaultListSize: 4,
  doingBusiness: { score: 41.3, rank: 177 },
  rocketChatUrl: process.env.REACT_APP_ROCKET_BASE_URL,
  autoRefreshInterval: 30000, // in milliseconds
};
