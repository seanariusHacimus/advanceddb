import { useState, useMemo, useCallback } from "react";
import { AutoComplete } from "antd"; // Keep for now - complex component
import { noop } from "lodash";
import { useLocale } from "../../../../utils/locale";
import { getIndicatorByTopicName } from "../util";

const ActionNameSelection = ({
  onChange = noop,
  onSelect = noop,
  value = "",
  topicName = "",
  placeholder = "",
  onClear = noop,
  existingActions = [],
}) => {
  const [t] = useLocale();
  const [options, setOptions] = useState([]);
  const indicatorOptions = useMemo(
    () => getIndicatorByTopicName(topicName),
    [topicName]
  );

  const onSearch = useCallback(
    (searchText) => {
      const filteredOptions = !searchText
        ? []
        : indicatorOptions.filter((item) =>
            item.value.toLowerCase().includes(searchText.toLowerCase())
          );

      // Mark options as disabled if they include existing action names
      const optionsWithDisabled = filteredOptions.map((item) => ({
        ...item,
        disabled: existingActions.some((existingName) =>
          item.value.toLowerCase().includes(existingName.toLowerCase())
        ),
      }));

      setOptions(optionsWithDisabled);
    },
    [indicatorOptions, existingActions]
  );

  const handleOnSelect = (_, record) => {
    const { pillar_number, subcategory_name, category_name } = record;
    onSelect({
      pillar_number,
      category: category_name,
      sub_category: subcategory_name,
    });
  };

  const handleChange = (data) => {
    onChange(data);
  };

  return (
    <AutoComplete
      value={value}
      id="action-title"
      options={options}
      tabIndex="1"
      maxLength={280}
      autoFocus
      allowClear
      onClear={onClear}
      className={`custom-select dynamic-input grey ${value ? "has-value" : ""}`}
      style={{ width: "100%" }}
      onSelect={handleOnSelect}
      onSearch={onSearch}
      onChange={handleChange}
      placeholder={t(placeholder)}
      getPopupContainer={(node) => node.parentNode}
      dropdownStyle={{ zIndex: 1090 }}
    />
  );
};

export default ActionNameSelection;
