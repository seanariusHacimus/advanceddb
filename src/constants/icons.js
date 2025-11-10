import React from "react";
import { ReactComponent as IconDashboard } from "../assets/header/indicatorIcons/dashboard.svg";
import { ReactComponent as IconElectricity } from "../assets/header/indicatorIcons/flash.svg";
import { ReactComponent as IconBusinessEntry } from "../assets/header/indicatorIcons/business-entry.svg";
import { ReactComponent as IconBusinessInsolvency } from "../assets/header/indicatorIcons/business-insolvency.svg";
import { ReactComponent as IconBusinessLocation } from "../assets/header/indicatorIcons/business-location.svg";
import { ReactComponent as IconDisputeResolution } from "../assets/header/indicatorIcons/dispute-resolution.svg";
import { ReactComponent as IconFinancialServices } from "../assets/header/indicatorIcons/financial-services.svg";
import { ReactComponent as IconInternationalTrade } from "../assets/header/indicatorIcons/international-trade.svg";
import { ReactComponent as IconLabor } from "../assets/header/indicatorIcons/labor.svg";
import { ReactComponent as IconMarketCompetition } from "../assets/header/indicatorIcons/market-competition.svg";
import { ReactComponent as IconTaxation } from "../assets/header/indicatorIcons/taxation.svg";
import { GROUP_NAMES } from "./groups";

// Export components (not JSX elements) for use as React components
export const IconComponents = {
  "/dashboard": IconDashboard,
  [GROUP_NAMES.BUSINESS_ENTRY.id]: IconBusinessEntry,
  [GROUP_NAMES.BUSINESS_LOCATION.id]: IconBusinessLocation,
  [GROUP_NAMES.UTILITY_SERVICES.id]: IconElectricity,
  [GROUP_NAMES.LABOR.id]: IconLabor,
  [GROUP_NAMES.FINANCIAL_SERVICES.id]: IconFinancialServices,
  [GROUP_NAMES.INTERNATIONAL_TRADE.id]: IconInternationalTrade,
  [GROUP_NAMES.TAXATION.id]: IconTaxation,
  [GROUP_NAMES.DISPUTE_RESOLUTION.id]: IconDisputeResolution,
  [GROUP_NAMES.MARKET_COMPETITION.id]: IconMarketCompetition,
  [GROUP_NAMES.BUSINESS_INSOLVENCY.id]: IconBusinessInsolvency,
};

// Keep the old format for backward compatibility with existing code
// This exports JSX elements for places that still use them
const iconsLegacy = {
  "/dashboard": <IconDashboard className="menu-icon" />,
  [GROUP_NAMES.BUSINESS_ENTRY.id]: <IconBusinessEntry className="menu-icon" />,
  [GROUP_NAMES.BUSINESS_LOCATION.id]: (
    <IconBusinessLocation className="menu-icon" />
  ),
  [GROUP_NAMES.UTILITY_SERVICES.id]: (
    <IconElectricity className="menu-icon stroke" />
  ),
  [GROUP_NAMES.LABOR.id]: <IconLabor className="menu-icon" />,
  [GROUP_NAMES.FINANCIAL_SERVICES.id]: (
    <IconFinancialServices className="menu-icon" />
  ),
  [GROUP_NAMES.INTERNATIONAL_TRADE.id]: (
    <IconInternationalTrade className="menu-icon stroke" />
  ),
  [GROUP_NAMES.TAXATION.id]: <IconTaxation className="menu-icon" />,
  [GROUP_NAMES.DISPUTE_RESOLUTION.id]: (
    <IconDisputeResolution className="menu-icon" />
  ),
  [GROUP_NAMES.MARKET_COMPETITION.id]: (
    <IconMarketCompetition className="menu-icon" />
  ),
  [GROUP_NAMES.BUSINESS_INSOLVENCY.id]: (
    <IconBusinessInsolvency className="menu-icon" />
  ),
};

export default iconsLegacy;
