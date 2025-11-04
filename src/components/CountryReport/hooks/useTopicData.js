import { useState, useEffect } from "react";
import { countryService } from "../../../services/country";

export const useTopicData = (countryCode, topicName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryCode || !topicName) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await countryService.getTopicData(
          countryCode,
          topicName
        );

        console.log("result", result);

        setData(result);
      } catch (err) {
        setError(err.message || "Failed to fetch topic data");
        console.error("Error in useTopicData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [countryCode, topicName]);

  return { data, loading, error };
};
