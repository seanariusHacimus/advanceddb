import React from "react";
import {
  LayoutDashboard,
  Store,
  MapPin,
  Zap,
  Users,
  Coins,
  Globe,
  Receipt,
  Scale,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

// Export Lucide React icons that match the menu item names
// Keys must match what groupTitleToUrl returns (lowercase with hyphens)
export const IconComponents = {
  "/dashboard": LayoutDashboard,
  "business-entry": Store, // Business Entry - storefront represents new business
  "business-location": MapPin, // Business Location - map pin for location
  "utility-services": Zap, // Utility Services - lightning for electricity/utilities
  "labor": Users, // Labor - people/workforce
  "financial-services": Coins, // Financial Services - money/currency
  "international-trade": Globe, // International Trade - world/global trade
  "taxation": Receipt, // Taxation - receipt/invoice for taxes
  "dispute-resolution": Scale, // Dispute Resolution - scales of justice
  "market-competition": TrendingUp, // Market Competition - growth/competition
  "business-insolvency": AlertTriangle, // Business Insolvency - warning/alert
};

// Keep the old format for backward compatibility with existing code
// This exports JSX elements for places that still use them
const iconsLegacy = {
  "/dashboard": <LayoutDashboard className="menu-icon" />,
  "business-entry": <Store className="menu-icon" />,
  "business-location": <MapPin className="menu-icon" />,
  "utility-services": <Zap className="menu-icon" />,
  "labor": <Users className="menu-icon" />,
  "financial-services": <Coins className="menu-icon" />,
  "international-trade": <Globe className="menu-icon" />,
  "taxation": <Receipt className="menu-icon" />,
  "dispute-resolution": <Scale className="menu-icon" />,
  "market-competition": <TrendingUp className="menu-icon" />,
  "business-insolvency": <AlertTriangle className="menu-icon" />,
};

export default iconsLegacy;
