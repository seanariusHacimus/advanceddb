import { useState, useEffect } from "react";
import { countryService } from "../../../services/country";

export const useCountryData = (countryCode, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryCode) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await countryService.getCountryData(
          countryCode,
          options
        );
        setData(result);
      } catch (err) {
        setError(err.message || "Failed to fetch country data");
        console.error("Error in useCountryData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [countryCode, JSON.stringify(options)]);

  return { data, loading, error };
};
