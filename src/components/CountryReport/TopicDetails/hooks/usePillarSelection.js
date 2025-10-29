import { useState, useEffect, useCallback } from "react";

export const usePillarSelection = (history) => {
  const [selectedPillar, setSelectedPillar] = useState("all");

  useEffect(() => {
    // Handle active pillar parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const activePillar = urlParams.get("active_pillar");
    if (activePillar) {
      const pillarMap = {
        1: "pillar_i",
        2: "pillar_ii",
        3: "pillar_iii",
      };
      setSelectedPillar(pillarMap[activePillar] || "all");
    }
  }, []);

  const selectPillarAndSyncUrl = useCallback(
    (pillarId) => {
      console.log("selectPillarAndSyncUrl", pillarId);
      setSelectedPillar(pillarId);

      if (!history || typeof history.replace !== "function") {
        console.warn("History object is not available");
        return;
      }

      try {
        const url = new URL(window.location.href);
        if (pillarId === "all") {
          url.searchParams.delete("active_pillar");
        } else {
          // Convert pillar ID to number for URL parameter
          const pillarNumberMap = {
            pillar_i: "1",
            pillar_ii: "2",
            pillar_iii: "3",
          };
          const pillarNumber = pillarNumberMap[pillarId] || pillarId;
          url.searchParams.set("active_pillar", pillarNumber);
        }
        history.replace(
          url.pathname + (url.search ? `?${url.searchParams.toString()}` : "")
        );
      } catch (error) {
        console.error("Error updating URL:", error);
      }
    },
    [history]
  );

  return {
    selectedPillar,
    selectPillarAndSyncUrl,
  };
};
