import { useState, useEffect } from "react";
import { countryService } from "../services/api/countryService";

export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await countryService.getCountries();
        setCountries(result.countries || []);
      } catch (err) {
        setError(err.message || "Failed to fetch countries");
        console.error("Error in useCountries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};
