import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withLocale } from "../../utils/locale";
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
import { 
  Button, 
  Select, 
  Switch, 
  Label, 
  FormGroup,
  AlertWithIcon,
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "../UI/shadcn";
import { useToast } from "../UI/shadcn/toast";

const Settings = ({ user, t }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  
  // Form state
  const [countryCode, setCountryCode] = useState('');
  const [pillarIColor, setPillarIColor] = useState('');
  const [pillarIIColor, setPillarIIColor] = useState('');
  const [pillarIIIColor, setPillarIIIColor] = useState('');
  const [showCountrySelect, setShowCountrySelect] = useState(true);

  useEffect(() => {
    const currentSettings = getSettings();
    setSettings(currentSettings);
    setCountryCode(currentSettings.defaultCountry?.code || '');
    setPillarIColor(currentSettings.chartColors?.pillar_i || DEFAULT_SETTINGS.chartColors.pillar_i);
    setPillarIIColor(currentSettings.chartColors?.pillar_ii || DEFAULT_SETTINGS.chartColors.pillar_ii);
    setPillarIIIColor(currentSettings.chartColors?.pillar_iii || DEFAULT_SETTINGS.chartColors.pillar_iii);
    setShowCountrySelect(
      currentSettings.showCountrySelect !== undefined
        ? currentSettings.showCountrySelect
        : DEFAULT_SETTINGS.showCountrySelect
    );
  }, []);

  // Filter countries - only show actual countries, not regions
  const countryOptions = countries.filter(
    (country) => country.type === "country"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedCountry = countryOptions.find(
        (c) => c.id === countryCode
      );

      // Save default country
      if (selectedCountry) {
        saveDefaultCountry(selectedCountry.id, selectedCountry.name);
      }

      // Save chart colors
      saveChartColors({
        pillar_i: pillarIColor,
        pillar_ii: pillarIIColor,
        pillar_iii: pillarIIIColor,
      });

      // Save show country select setting
      saveShowCountrySelect(showCountrySelect);

      const updatedSettings = getSettings();
      setSettings(updatedSettings);

      toast.success({
        title: t("Success!"),
        description: t("Settings saved successfully"),
      });

      // Reload page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error({
        title: t("Error"),
        description: t("Failed to save settings"),
      });
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
      setCountryCode(defaultSettings.defaultCountry?.code || '');
      setPillarIColor(defaultSettings.chartColors?.pillar_i || '');
      setPillarIIColor(defaultSettings.chartColors?.pillar_ii || '');
      setPillarIIIColor(defaultSettings.chartColors?.pillar_iii || '');
      setShowCountrySelect(defaultSettings.showCountrySelect);
      
      toast.success({
        title: t("Success!"),
        description: t("Settings reset to default"),
      });
    } catch (error) {
      toast.error({
        title: t("Error"),
        description: t("Failed to reset settings"),
      });
      console.error("Error resetting settings:", error);
    }
  };

  // Check if user is superuser
  if (!user || user.role !== USER_ROLES.SUPERUSER) {
    return (
      <SettingsContainer>
        <AlertWithIcon
          variant="destructive"
          title={t("Access Denied")}
          description={t("You do not have permission to access this page.")}
        />
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsTitle>{t("General Settings")}</SettingsTitle>

      <form onSubmit={handleSubmit}>
        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle>{t("Default Country")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <Label data-required="true">{t("Select Default Country")}</Label>
              <Select
                value={countryCode}
                onValueChange={setCountryCode}
                placeholder={t("Select a country")}
              >
                {countryOptions.map((country) => (
                  <Select.Item key={country.id} value={country.id}>
                    {country.name}
                  </Select.Item>
                ))}
              </Select>
            </FormGroup>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle>{t("Display Options")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <Switch
                checked={showCountrySelect}
                onCheckedChange={setShowCountrySelect}
                label={t("Show Country Select")}
              />
              <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginTop: '4px', marginLeft: '44px' }}>
                {t("Enable or disable the country select dropdown on the Country Report page")}
              </p>
            </FormGroup>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: '24px' }}>
          <CardHeader>
            <CardTitle>{t("Chart Colors")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <Label data-required="true">{t("Pillar I Color")}</Label>
              <ColorInputWrapper>
                <ColorPreview color={pillarIColor} />
                <ColorInput
                  placeholder="#e35f20"
                  value={pillarIColor}
                  maxLength={7}
                  onChange={(e) => {
                    const value = e.target.value.startsWith("#")
                      ? e.target.value
                      : `#${e.target.value}`;
                    setPillarIColor(value);
                  }}
                />
              </ColorInputWrapper>
            </FormGroup>

            <FormGroup>
              <Label data-required="true">{t("Pillar II Color")}</Label>
              <ColorInputWrapper>
                <ColorPreview color={pillarIIColor} />
                <ColorInput
                  placeholder="#f6871e"
                  value={pillarIIColor}
                  maxLength={7}
                  onChange={(e) => {
                    const value = e.target.value.startsWith("#")
                      ? e.target.value
                      : `#${e.target.value}`;
                    setPillarIIColor(value);
                  }}
                />
              </ColorInputWrapper>
            </FormGroup>

            <FormGroup>
              <Label data-required="true">{t("Pillar III Color")}</Label>
              <ColorInputWrapper>
                <ColorPreview color={pillarIIIColor} />
                <ColorInput
                  placeholder="#fcac18"
                  value={pillarIIIColor}
                  maxLength={7}
                  onChange={(e) => {
                    const value = e.target.value.startsWith("#")
                      ? e.target.value
                      : `#${e.target.value}`;
                    setPillarIIIColor(value);
                  }}
                />
              </ColorInputWrapper>
            </FormGroup>
          </CardContent>
        </Card>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button type="submit" disabled={loading}>
            {loading ? t("Saving...") : t("Save Settings")}
          </Button>
          <Button variant="outline" type="button" onClick={handleReset}>
            {t("Reset to Default")}
          </Button>
        </div>
      </form>
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
