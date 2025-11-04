import apiClient from "../api";
import businessReadyClient from "../businessReady";

export const countryService = {
  /**
   * Get list of all available countries
   * @returns {Promise<{countries: string[], total: number}>}
   */
  getCountries: async () => {
    try {
      const response = await apiClient.get("/countries");
      return response.data;
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  },

  /**
   * Get country report with optional filters
   * @param {string} countryCode - Country code
   * @param {Object} options - Query options
   * @param {string[]} options.topics - Filter by topics
   * @param {boolean} options.includeExpertResponses - Include expert responses
   * @returns {Promise<Object>}
   */
  getCountryData: async (countryCode, options = {}) => {
    try {
      const response = await apiClient.get(`/countries/${countryCode}/details`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for ${countryCode}:`, error);
      throw error;
    }
  },

  /**
   * Get specific topic data for a country
   * @param {string} countryCode - Country name
   * @param {string} topicName - Topic name
   * @returns {Promise<Object>}
   */
  getTopicData: async (countryCode, topicName) => {
    try {
      const response = await apiClient.get(
        `/countries/${encodeURIComponent(
          countryCode
        )}/topics/${encodeURIComponent(topicName)}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching topic ${topicName} for ${countryCode}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Get specific indicator data
   * @param {string} countryCode - Country name
   * @param {string} indicatorId - Indicator ID (e.g., "I.1.1.1")
   * @returns {Promise<Object>}
   */
  getIndicatorData: async (countryCode, indicatorId) => {
    try {
      const response = await apiClient.get(
        `/countries/${encodeURIComponent(
          countryCode
        )}/indicators/${encodeURIComponent(indicatorId)}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching indicator ${indicatorId} for ${countryCode}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Get expert responses for a specific indicator
   * @param {string} countryCode - Country name
   * @param {string} indicatorId - Indicator ID
   * @returns {Promise<Object>}
   */
  getIndicatorExpertResponses: async (countryCode, indicatorId, topicName) => {
    try {
      const response = await apiClient.get(
        `/countries/${encodeURIComponent(
          countryCode
        )}/indicators/${encodeURIComponent(indicatorId)}/expert-responses`,
        {
          params: topicName ? { topic: topicName } : {},
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching expert responses for ${indicatorId}:`,
        error
      );
      throw error;
    }
  },
};
