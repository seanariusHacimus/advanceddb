import React from "react";
import { Row, Col } from "antd";
import BarChart from "./BarChart";
import { TitleH1, TitleH3 } from "../../styles";
import CountryPage from "../../styles/compareCountries";
import { PureComponent } from "react";
import constants from "../../constants";
import { withLocale } from "../../utils/locale";

const chartData = [
  {
    name: 2017,
    value: 0,
    color: "#527BDD",
  },
  {
    name: 2018,
    value: 0,
    color: "#F4D581",
  },
  {
    name: 2019,
    value: 0,
    color: "#F4C9D9",
  },
  {
    name: 2020,
    value: 0,
    color: "#E5E7EF",
  },
];

const colors = ["#F4C9D9", "#313976", "#527BDD", "#F4D581", "#EFA5C1"];

class Compare extends PureComponent {
  render() {
    const { t } = this.props;
    return (
      <CountryPage>
        <TitleH1 margin="0 0 30px">
          {t("Historical data")} {constants.defaultCountry.name}
        </TitleH1>
        <Row className="graph-wrapper empty">
          <Col span={24} lg={12} className="col-1 border-right border-bottom">
            <TitleH3>{t("DB score (0-100)")}</TitleH3>
            <BarChart color={colors[0]} data={chartData} />
          </Col>
          <Col span={24} lg={12} className="col-2 border-bottom">
            <TitleH3>{t("Procedures (number)")}</TitleH3>
            <BarChart color={colors[1]} data={chartData} />
          </Col>
          <Col span={24} lg={12} className="col-3 border-right">
            <TitleH3>{t("Time (days)")}</TitleH3>
            <BarChart color={colors[2]} data={chartData} />
          </Col>
          <Col span={24} lg={12} className="col-4">
            <TitleH3>{t("Cost (% of GNI per capita) Historical")}</TitleH3>
            <BarChart color={colors[3]} data={chartData} />
          </Col>
          <Col span={24} lg={12} className="col-3 border-right">
            <TitleH3>
              {t(
                "Reliability of supply and transparency of tariff index (0-8) Historical"
              )}
            </TitleH3>
            <BarChart color={colors[4]} data={chartData} />
          </Col>
        </Row>
      </CountryPage>
    );
  }
}

export default withLocale(Compare);
