import React, { lazy, Suspense } from "react";
import iconCog from "../../assets/dashboard/cog.svg";
import { fetchStatistics } from "./utils";
import { useLocale } from "../../utils/locale";
import { ButtonAlternative } from "../../styles/buttons";

const IndicatorSettings = lazy(() => import("./Indicators"));

const CustomizeDashboardReports = () => {
  const [t] = useLocale();
  const [showIndicators, setShowIndicators] = React.useState(false);
  const modalHandler = () => setShowIndicators((prev) => !prev);

  return (
    <>
      <ButtonAlternative
        type="secondary"
        className="small customize-btn download-actions-button"
        onClick={modalHandler}
      >
        <img
          src={iconCog}
          alt="dashboard settings"
          style={{ marginRight: 5 }}
        />
        {t("Customize Dashboard Reports")}
      </ButtonAlternative>
      {showIndicators && (
        <Suspense fallback={t("Loading...")}>
          <IndicatorSettings
            modalHandler={modalHandler}
            modalVisible
            fetchDashboardReport={fetchStatistics}
          />
        </Suspense>
      )}
    </>
  );
};

export default CustomizeDashboardReports;
