import { useMemo } from "react";
import { Select } from "antd"; // Using Ant Select for now - has complex features
import { useHistory } from "react-router-dom";
import { withLocale } from "../../utils/locale";
import { CountryReportPillars } from "../../data";
import styled from "styled-components";

const { Option } = Select;

const CountrySelectWrapper = styled.div`
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  label {
    font-weight: 600;
    font-size: 16px;
    color: #0d0c21;
    white-space: nowrap;
  }

  .country-select {
    min-width: 300px;
    max-width: 400px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    .country-select {
      width: 100%;
      max-width: 100%;
    }
  }
`;

const CountrySelect = ({ value, onChange, t }) => {
  const history = useHistory();

  // Get available countries from countryReportPillars.json
  // Filter out groups (entries with Group field not empty or EconomyCode that looks like a group name)
  const availableCountries = useMemo(() => {
    return CountryReportPillars.filter((item) => {
      // Filter out groups (income groups, etc.)
      const economyCode = item.EconomyCode || "";
      const isGroup =
        item.Group !== "" ||
        economyCode === "High income" ||
        economyCode === "Low income" ||
        economyCode === "Lower middle income" ||
        economyCode === "Upper middle income";
      return !isGroup && economyCode.length === 3; // Country codes are typically 3 letters
    }).map((item) => ({
      code: item.EconomyCode,
      name: item.Economy, // Full country name from Economy field
    }));
  }, []);

  // Handle country selection
  const handleCountryChange = (countryCode) => {
    if (onChange) {
      onChange(countryCode);
    } else if (history && typeof history.push === "function") {
      // Default behavior: update URL with country_code param
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("country_code", countryCode);
      history.push(`/dashboard/country-report?${urlParams.toString()}`);
    }
  };

  return (
    <CountrySelectWrapper>
      <label>{t("Select Country")}:</label>
      <Select
        className="country-select"
        showSearch
        placeholder={t("Select a country")}
        optionFilterProp="children"
        optionLabelProp="label"
        value={value}
        onChange={handleCountryChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {availableCountries.map((country) => (
          <Option key={country.code} value={country.code} label={country.name}>
            {country.name}
          </Option>
        ))}
      </Select>
    </CountrySelectWrapper>
  );
};

export default withLocale(CountrySelect);

