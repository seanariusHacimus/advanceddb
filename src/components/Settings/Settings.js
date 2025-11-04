import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withLocale } from "../../utils/locale";
import { Form, Button, Select, Space, message, Alert, Switch } from "antd";
import {
  getSettings,
  saveDefaultCountry,
  saveChartColors,
  saveShowCountrySelect,
  resetSettings,
  DEFAULT_SETTINGS,
} from "../../utils/settings";
import countries from "../../data/countries.json";
import { USER_ROLES } from "../../constants/userRoles";
import PropTypes from "prop-types";
import {
  SettingsContainer,
  StyledCard,
  ColorInputWrapper,
  ColorInput,
  ColorPreview,
  SettingsTitle,
} from "./Settings.style";

const { Option } = Select;

const Settings = ({ user, t }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const currentSettings = getSettings();
    setSettings(currentSettings);
    form.setFieldsValue({
      countryCode: currentSettings.defaultCountry?.code,
      pillar_i_color: currentSettings.chartColors?.pillar_i,
      pillar_ii_color: currentSettings.chartColors?.pillar_ii,
      pillar_iii_color: currentSettings.chartColors?.pillar_iii,
      showCountrySelect:
        currentSettings.showCountrySelect !== undefined
          ? currentSettings.showCountrySelect
          : DEFAULT_SETTINGS.showCountrySelect,
    });
  }, [form]);

  // Filter countries - only show actual countries, not regions
  const countryOptions = countries.filter(
    (country) => country.type === "country"
  );

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const selectedCountry = countryOptions.find(
        (c) => c.id === values.countryCode
      );

      // Save default country
      if (selectedCountry) {
        saveDefaultCountry(selectedCountry.id, selectedCountry.name);
      }

      // Save chart colors
      saveChartColors({
        pillar_i: values.pillar_i_color,
        pillar_ii: values.pillar_ii_color,
        pillar_iii: values.pillar_iii_color,
      });

      // Save show country select setting
      saveShowCountrySelect(values.showCountrySelect);

      const updatedSettings = getSettings();
      setSettings(updatedSettings);

      message.success(t("Settings saved successfully"));

      // Reload page to apply changes
      window.location.reload();
    } catch (error) {
      message.error(t("Failed to save settings"));
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    try {
      resetSettings();
      const defaultSettings = getSettings();
      setSettings(defaultSettings);
      form.setFieldsValue({
        countryCode: defaultSettings.defaultCountry?.code,
        pillar_i_color: defaultSettings.chartColors?.pillar_i,
        pillar_ii_color: defaultSettings.chartColors?.pillar_ii,
        pillar_iii_color: defaultSettings.chartColors?.pillar_iii,
        showCountrySelect: defaultSettings.showCountrySelect,
      });
      message.success(t("Settings reset to default"));
    } catch (error) {
      message.error(t("Failed to reset settings"));
      console.error("Error resetting settings:", error);
    }
  };

  // Check if user is superuser
  if (!user || user.role !== USER_ROLES.SUPERUSER) {
    return (
      <SettingsContainer>
        <Alert
          message={t("Access Denied")}
          description={t("You do not have permission to access this page.")}
          type="error"
          showIcon
        />
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsTitle>{t("General Settings")}</SettingsTitle>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <StyledCard title={t("Default Country")}>
          <Form.Item
            name="countryCode"
            label={t("Select Default Country")}
            rules={[{ required: true, message: t("Please select a country") }]}
          >
            <Select
              showSearch
              placeholder={t("Select a country")}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ maxWidth: 400 }}
            >
              {countryOptions.map((country) => (
                <Option key={country.id} value={country.id}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </StyledCard>

        <StyledCard title={t("Display Options")}>
          <Form.Item
            name="showCountrySelect"
            label={t("Show Country Select")}
            valuePropName="checked"
            tooltip={t(
              "Enable or disable the country select dropdown on the Country Report page"
            )}
          >
            <Switch />
          </Form.Item>
        </StyledCard>

        <StyledCard title={t("Chart Colors")}>
          <Form.Item
            name="pillar_i_color"
            label={t("Pillar I Color")}
            rules={[
              { required: true, message: t("Please enter a color") },
              {
                pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                message: t("Please enter a valid hex color"),
              },
            ]}
          >
            <ColorInputWrapper>
              <ColorPreview color={form.getFieldValue("pillar_i_color")} />
              <ColorInput
                placeholder="#e35f20"
                prefix="#"
                maxLength={7}
                onChange={(e) => {
                  const value = e.target.value.startsWith("#")
                    ? e.target.value
                    : `#${e.target.value}`;
                  form.setFieldValue("pillar_i_color", value);
                }}
              />
            </ColorInputWrapper>
          </Form.Item>

          <Form.Item
            name="pillar_ii_color"
            label={t("Pillar II Color")}
            rules={[
              { required: true, message: t("Please enter a color") },
              {
                pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                message: t("Please enter a valid hex color"),
              },
            ]}
          >
            <ColorInputWrapper>
              <ColorPreview color={form.getFieldValue("pillar_ii_color")} />
              <ColorInput
                placeholder="#f6871e"
                prefix="#"
                maxLength={7}
                onChange={(e) => {
                  const value = e.target.value.startsWith("#")
                    ? e.target.value
                    : `#${e.target.value}`;
                  form.setFieldValue("pillar_ii_color", value);
                }}
              />
            </ColorInputWrapper>
          </Form.Item>

          <Form.Item
            name="pillar_iii_color"
            label={t("Pillar III Color")}
            rules={[
              { required: true, message: t("Please enter a color") },
              {
                pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                message: t("Please enter a valid hex color"),
              },
            ]}
          >
            <ColorInputWrapper>
              <ColorPreview color={form.getFieldValue("pillar_iii_color")} />
              <ColorInput
                placeholder="#fcac18"
                prefix="#"
                maxLength={7}
                onChange={(e) => {
                  const value = e.target.value.startsWith("#")
                    ? e.target.value
                    : `#${e.target.value}`;
                  form.setFieldValue("pillar_iii_color", value);
                }}
              />
            </ColorInputWrapper>
          </Form.Item>
        </StyledCard>

        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t("Save Settings")}
          </Button>
          <Button onClick={handleReset}>{t("Reset to Default")}</Button>
        </Space>
      </Form>
    </SettingsContainer>
  );
};

Settings.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }),
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.account,
});

export default connect(mapStateToProps)(withLocale(Settings));
