import { useState, useEffect } from "react";
import { countryService } from "../../../services/country";

export const useIndicatorExpertResponses = (
  countryCode,
  indicatorId,
  topicName
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!countryCode || !indicatorId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await countryService.getIndicatorExpertResponses(
        countryCode,
        indicatorId,
        topicName
      );
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to fetch expert responses");
      console.error("Error in useIndicatorExpertResponses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [countryCode, indicatorId, topicName]);

  return { data, loading, error, refetch: fetchData };
};
