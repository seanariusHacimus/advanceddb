import { useState, useMemo } from "react";
import { AutoComplete } from "antd";
import { noop } from "lodash";
import { useLocale } from "../../../utils/locale";
import { getIndicatorByTopicName } from "./util";

const ActionNameSelection = ({
  onChange = noop,
  onSelect = noop,
  value = "",
  topicName = "",
  placeholder = "",
}) => {
  const [t] = useLocale();
  const [options, setOptions] = useState([]);
  const indicatorOptions = useMemo(
    () => getIndicatorByTopicName(topicName),
    [topicName]
  );

  const onSearch = (searchText) => {
    setOptions(
      !searchText
        ? []
        : indicatorOptions.filter((item) =>
            item.value.toLowerCase().includes(searchText.toLowerCase())
          )
    );
  };

  const handleOnSelect = (_, record) => {
    const { pillar_number, subcategory_name, category_name } = record;
    onSelect({
      pillar_number,
      category: category_name,
      sub_category: subcategory_name,
    });
  };

  const handleChange = (data) => {
    console.log("onChange", data);
    onChange(data);
  };

  return (
    <AutoComplete
      value={value}
      id="action-title"
      options={options}
      tabIndex="1"
      autoFocus
      className={`custom-select dynamic-input grey ${name ? "has-value" : ""}`}
      style={{ width: "100%" }}
      onSelect={handleOnSelect}
      onSearch={onSearch}
      onChange={handleChange}
      placeholder={t(placeholder)}
    />
  );
};

export default ActionNameSelection;
