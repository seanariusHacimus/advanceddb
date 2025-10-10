import React, { PureComponent, createRef } from "react";
import { Row, Col, Tooltip, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import BarChart from "./BarChart";
import { TitleH1, TitleH3, Flex } from "../../styles";
import CountryPage from "../../styles/compareCountries";
import Print from "../../components/UI/Printer";

import EmptyData from "./EmptyData";
import Axios from "../../utils/axios";
import getQuery from "./queryGenerator";
import colors from "../../constants/chartColors";
import constants from "../../constants";
import indicatorDescription from "../../constants/indicatorsMetaDescription";
import indicatorTitles from "../../constants/indicatorTitles";
import { ReactComponent as IconMale } from "../../assets/startBusiness/male.svg";
import { ReactComponent as IconFemale } from "../../assets/startBusiness/female.svg";
import { withLocale } from "../../utils/locale";
import { GROUP_NAMES } from "../../constants/groups";

class Compare extends PureComponent {
  state = {
    data: [],
    selectedOption: "_men",
  };

  async componentDidMount() {
    const { title } = this.props.match.params;
    const query = getQuery({ title });

    try {
      const res = await Axios.post("/graphql", { query: `{${query}}` });
      if (res.data) {
        const years = res.data.data;
        const result = [];
        const firstIndicatorName = Object.keys(res.data.data)[0];
        const indicatorParent = res.data.data[firstIndicatorName][0].indicators;
        const list = indicatorParent[Object.keys(indicatorParent)];
        const parentName = title.toLowerCase().replace(/\-/g, "_");

        for (const x in list) {
          const innerData = [];

          for (const y in years) {
            const obj = {};
            const value = years[y][0]
              ? years[y][0]?.indicators[Object.keys(indicatorParent)][x]
              : [];
            obj.name = y.slice(4);
            obj.value = +Number(value).toFixed(1);
            obj.key = x;
            obj.noPractice = value === null;
            obj.title = indicatorTitles[parentName][x];
            obj.description = indicatorDescription[title.replace(/-/g, "_")][x];
            innerData.push(obj);
          }
          result.push(innerData);
        }
        this.setState({ data: result });
      }
    } catch (err) {
      console.error("[Custom Catch Error]-->", err);
    }
  }

  handleFilter = (e) => {
    this.setState({ selectedOption: e.currentTarget.value });
  };

  render() {
    const { t } = this.props;
    const { data, selectedOption } = this.state;
    const { title } = this.props.selectedWorkingGroup;
    let filteredData = data;
    const isTitleEqualToBusinessEntry =
      title === GROUP_NAMES.BUSINESS_ENTRY.name;
    const isTitleEqualToInternationalTrade =
      title === GROUP_NAMES.INTERNATIONAL_TRADE.name;

    if (isTitleEqualToBusinessEntry) {
      if (selectedOption) {
        filteredData = data.filter((item) => {
          const notSelectedOption =
            selectedOption === "_women" ? "_men" : "_women";
          if (
            item[0].key.toLowerCase().endsWith(selectedOption) &&
            !item[0].key.toLowerCase().endsWith(notSelectedOption)
          ) {
            return item;
          }
          if (
            !item[0].key.toLowerCase().endsWith(selectedOption) &&
            !item[0].key.toLowerCase().endsWith(notSelectedOption)
          ) {
            return item;
          }
        });
      }
    } else if (isTitleEqualToInternationalTrade) {
      if (selectedOption) {
        filteredData = data.filter((item) => {
          const notSelectedOption =
            selectedOption === "_export" ? "_import" : "_export";
          if (
            item[0].key.toLowerCase().includes(selectedOption) &&
            !item[0].key.toLowerCase().includes(notSelectedOption)
          ) {
            return item;
          }
          if (
            !item[0].key.toLowerCase().includes(selectedOption) &&
            !item[0].key.toLowerCase().includes(notSelectedOption)
          ) {
            return item;
          }
        });
      }
    }

    let count = 0;
    if (data.length) {
      return (
        <CountryPage
          className="graph-with-box"
          ref={(el) => (this.customRef = el)}
        >
          <TitleH1
            margin="0 0 30px"
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            {t("Historical data %s", constants.defaultCountry.name)}
            <Print ref={this.customRef} />
          </TitleH1>
          {/* Show Men Women toggle buttons */}
          {isTitleEqualToBusinessEntry && (
            <Flex className="filter-btn">
              <Button
                value=""
                className={`btn-group ${
                  selectedOption === "" && "ant-radio-button-wrapper-checked"
                }`}
                onClick={this.handleFilter}
              >
                {" "}
                {t("All")}
              </Button>
              <Button
                value="_men"
                icon={<IconMale height={14} />}
                onClick={this.handleFilter}
                className={`btn-group ${
                  selectedOption === "_men" &&
                  "ant-radio-button-wrapper-checked"
                }`}
              >
                {t("Men")}
              </Button>
              <Button
                value="_women"
                icon={<IconFemale height={14} />}
                onClick={this.handleFilter}
                className={`btn-group ${
                  selectedOption === "_women" &&
                  "ant-radio-button-wrapper-checked"
                }`}
              >
                {t("Women")}
              </Button>
            </Flex>
          )}
          {/* Show Import Export toggle buttons */}
          {isTitleEqualToInternationalTrade && (
            <Flex className="filter-btn">
              <Button
                value=""
                className={`btn-group ${
                  selectedOption === "" && "ant-radio-button-wrapper-checked"
                }`}
                onClick={this.handleFilter}
              >
                {" "}
                {t("All")}
              </Button>
              <Button
                value="_import"
                onClick={this.handleFilter}
                className={`btn-group ${
                  selectedOption === "_import" &&
                  "ant-radio-button-wrapper-checked"
                }`}
              >
                {t("Import")}
              </Button>
              <Button
                value="_export"
                onClick={this.handleFilter}
                className={`btn-group ${
                  selectedOption === "_export" &&
                  "ant-radio-button-wrapper-checked"
                }`}
              >
                {t("Export")}
              </Button>
            </Flex>
          )}

          <Row className="graph-wrapper historical-data">
            {filteredData.map((item, index) => {
              if (count < colors.length - 1) {
                count++;
                return (
                  <Col key={index} span={24} lg={12} className="col-1">
                    <div className="inner-block">
                      <TitleH3>
                        {item[0].title}
                        {item[0].description && (
                          <Tooltip
                            overlayClassName="custom-tooltip"
                            placement="topRight"
                            color="#535263"
                            title={item[0].description}
                          >
                            <InfoCircleOutlined style={{ marginLeft: 5 }} />
                          </Tooltip>
                        )}
                      </TitleH3>
                      <BarChart color={colors[count].value} data={item} />
                    </div>
                  </Col>
                );
              }
              count = 0;
              return (
                <Col key={index} span={24} lg={12} className="col-1">
                  <div className="inner-block">
                    <TitleH3>
                      {item[0].title}
                      {item[0].description && (
                        <Tooltip
                          overlayClassName="custom-tooltip"
                          placement="topRight"
                          color="#535263"
                          title={item[0].description}
                        >
                          <InfoCircleOutlined style={{ marginLeft: 5 }} />
                        </Tooltip>
                      )}
                    </TitleH3>
                    <BarChart color={colors[0].value} data={item} />
                  </div>
                </Col>
              );
            })}
          </Row>
        </CountryPage>
      );
    }

    return <EmptyData />;
  }
}

const mapStateToProps = (state) => ({
  indicators: state.workingGroups.data,
  selectedWorkingGroup: state.selectedWorkingGroup,
});

export default connect(mapStateToProps)(withLocale(Compare));
