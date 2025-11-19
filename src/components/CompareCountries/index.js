import React, { PureComponent, createRef } from "react";
import { Row, Col, Select, Tooltip, Button } from "antd"; // Using Ant components for now
import { Info } from "lucide-react";
import { connect } from "react-redux";
import BarChart from "./BarChart";
import { TitleH1, TitleH3, Flex } from "../../styles";
import CountryPage from "../../styles/compareCountries";
import Print from "../../components/UI/Printer";

import EmptyData from "./EmptyData";
import Axios from "../../utils/axios";
import getQuery from "./queryGenerator";
import countriesList from "./countriesList";
import indicatorDescription from "../../constants/indicatorsMetaDescription";
import indicatorTitles from "../../constants/indicatorTitles";
import constants from "../../constants";
import { ReactComponent as IconMale } from "../../assets/startBusiness/male.svg";
import { ReactComponent as IconFemale } from "../../assets/startBusiness/female.svg";
import { withLocale } from "../../utils/locale";
import { GROUP_NAMES } from "../../constants/groups";

const { Option } = Select;
const colors = ["#527BDD", "#F4D581", "#F4C9D9", "#E5E7EF", "#313976"];
const { defaultCountry } = constants;

class Compare extends PureComponent {
  state = {
    data: [],
    countries: [],
    selectedOption: "_men",
  };

  printRef = createRef();

  async componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const { title } = this.props.match.params;
    const countries = Object.keys(this.state.countries);
    const query = getQuery([defaultCountry.code, ...countries], title);

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
            const value =
              years[y][0].indicators[Object.keys(indicatorParent)][x];
            console.log(value);
            obj.name = countriesList[y].name;
            obj.value = +Number(value).toFixed(1);
            obj.noPractice = value === null;
            obj.key = x;
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
  };

  selectHandler = (val) => {
    if (Object.keys(this.state.countries).length < 4) {
      this.setState(
        (prevState) => ({
          countries: { ...prevState.countries, [val]: countriesList[val] },
        }),
        () => this.fetchData()
      );
    }
  };

  removeCountry = (val) => {
    console.log(val, Object.keys(this.state.countries));
    const remainingCountries = Object.values(this.state.countries).filter(
      (item) => item.code !== val
    );
    const data = {};
    remainingCountries.forEach((item) => (data[item.code] = item));
    this.setState(
      (prevState) => ({ countries: { ...data } }),
      () => this.fetchData()
    );
  };

  handleFilter = (e) => {
    this.setState({ selectedOption: e.currentTarget.value });
  };

  render() {
    const { data, selectedOption, countries } = this.state;
    const { t } = this.props;

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
    return (
      <CountryPage className="graph-with-box" ref={this.printRef}>
        <TitleH1
          margin="0 0 30px"
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {t(title)} {t("Comparison")}
          <Print ref={this.printRef.current} />
        </TitleH1>
        <div className="compare-countries sub-title">
          {t("Select up to 4 countries")}
        </div>
        <Flex style={{ flexWrap: "wrap" }} className="filter-field">
          <div className="country-btn" key={defaultCountry.code}>
            <span className="color" style={{ background: colors[0] }} />
            {defaultCountry.name}
          </div>
          {Object.values(countries).map((item, index) => (
            <div className="country-btn" key={index}>
              <span
                className="color"
                style={{ background: colors[index + 1] }}
              />
              {item.name}
              <button
                type="button"
                onClick={() => this.removeCountry(item.code)}
              >
                x
              </button>
            </div>
          ))}
          <div id="search">
            <Select
              showSearch
              autoClearSearchValue
              className="select-country"
              ref={(el) => (this.searchRef = el)}
              style={{ minWidth: 170 }}
              placeholder={t("Select a country")}
              optionFilterProp="children"
              value={null}
              suffixIcon={null}
              dropdownStyle={{ backgroundColor: "#535263" }}
              onFocus={(e) =>
                (e.target.style.cssText =
                  "width: 100% !important; min-width: 160px;")
              }
              onSelect={(val) => this.selectHandler(val)}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0 ||
                option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {Object.keys(countriesList).map((item, index) => {
                if (item !== defaultCountry.code) {
                  return (
                    <Option key={index} value={countriesList[item].code}>
                      {countriesList[item].name}
                    </Option>
                  );
                }
                return null;
              })}
            </Select>
          </div>
        </Flex>

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
                selectedOption === "_men" && "ant-radio-button-wrapper-checked"
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
        <Row className="graph-wrapper">
          {filteredData.map((item, index) => {
            return (
              <Col key={index} span={24} lg={12} className="col-1">
                <div className="inner-block">
                  <TitleH3 style={{ marginBottom: 15 }}>
                    {item[0].title}
                    {item[0].description && (
                      <Tooltip
                        overlayClassName="custom-tooltip"
                        placement="topRight"
                        color="#535263"
                        title={item[0].description}
                      >
                        <Info style={{ marginLeft: 5 }} size={16} />
                      </Tooltip>
                    )}
                  </TitleH3>
                  <BarChart color={colors} data={item} />
                </div>
              </Col>
            );
          })}
        </Row>
        {!data.length && <EmptyData />}
      </CountryPage>
    );
  }
}

const mapStateToProps = (state) => ({
  indicators: state.workingGroups.data,
  selectedWorkingGroup: state.selectedWorkingGroup,
});

export default connect(mapStateToProps)(withLocale(Compare));
