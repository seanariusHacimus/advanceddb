import React from "react";
import { Col } from "antd";
import DonutChart from "../components/DonutChart";
import { ChartTitle } from "../../../../styles/graph";
import { TitleH3 } from "../../../../styles";
import { useLocale, withLocale } from "../../../../utils/locale";
import PropTypes from "prop-types";

const ActionStatuses = ({ chartData, showLabels = true }) => {
  const [t] = useLocale();

  return (
    <Col xs={24} md={8} lg={6} className="col-1">
      <div className="inner-block">
        <TitleH3 className="sub-title">
          {t("Overall progress of tasks")}
        </TitleH3>
        <div>
          <DonutChart data={chartData} />

          {showLabels && (
            <div
              style={{
                marginTop: 12,
                justifyContent: "space-between",
                display: "flex",
              }}
            >
              {chartData.map((item, index) => (
                <div key={index}>
                  <ChartTitle>
                    <h3>
                      <span
                        className="label"
                        style={{ backgroundColor: item.color }}
                      />
                      {t(item.title)}
                    </h3>
                    <div className="number">{item.value || 0}%</div>
                  </ChartTitle>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Col>
  );
};

ActionStatuses.propTypes = {
  chartData: PropTypes.array.isRequired,
  showLabels: PropTypes.bool,
};

export default withLocale(ActionStatuses);
