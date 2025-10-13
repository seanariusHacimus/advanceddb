import React from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import Simulator from "../components/Simulator/Simulator";
import Reform from "../components/Reform";
import Members from "../components/Members";
import WorkingGroups from "../components/WorkingGroups";
import EditMember from "../components/Members/EditMember";
import Profile from "../components/Profile/Profile";
import ProfileEdit from "../components/Profile/ProfileEdit";
import StartBusiness from "../components/StartBusiness/StartBusiness";
import Methodology from "../components/StartBusiness/Methodology";
import CompareCountries from "../components/CompareCountries";
import HistoricalData from "../components/HistoricalData";
import WhatToReform from "../components/StartBusiness/WhatToReform";
import NotificationSettings from "../components/Profile/ProfileNotificationSettings";
import ProfileSecurity from "../components/Profile/ProfileSecurity";
import Organizations from "../components/Organizations";
import Messaging from "../components/Messaging";
import Audit from "../components/Audit";
import Approvals from "../components/Approvals";

export const ROUTES = [
  {
    key: "Dashboard",
    path: "/dashboard/home",
    exact: true,
    component: Dashboard,
  },
  {
    key: "WorkingGroups",
    path: "/dashboard/working-groups",
    exact: true,
    secret: true,
    component: WorkingGroups,
  },
  {
    key: "Simulator",
    path: "/dashboard/db-ranking-simulator",
    exact: true,
    component: Simulator,
  },
  {
    key: "Audit",
    path: "/dashboard/audit",
    exact: true,
    admin: true,
    secret: true,
    component: Audit,
  },
  {
    key: "Approvals",
    path: "/dashboard/approvals",
    exact: true,
    admin: true,
    component: Approvals,
  },
  {
    key: "Reform",
    path: "/dashboard/reform-update-for-db-team",
    exact: true,
    component: Reform,
  },
  {
    key: "Organizations",
    path: "/dashboard/organizations",
    exact: true,
    component: Organizations,
  },
  {
    key: "Members",
    path: "/dashboard/members",
    exact: true,
    component: Members,
  },
  {
    key: "MembersEdit",
    path: "/members/:id",
    exact: true,
    admin: true,
    secret: true,
    component: EditMember,
  },
  { key: "Profile", path: "/profile", exact: true, component: Profile },
  {
    key: "ProfileNotificationsEdit",
    path: "/profile/notification-settings",
    exact: true,
    component: NotificationSettings,
  },
  {
    key: "ProfileEdit",
    path: "/profile/edit",
    exact: true,
    component: ProfileEdit,
  },
  {
    key: "ProfileSecurity",
    path: "/profile/security",
    exact: true,
    component: ProfileSecurity,
  },
  {
    key: "Messaging",
    path: "/dashboard/messaging",
    exact: true,
    component: Messaging,
  },
  {
    key: "StartBusiness",
    path: "/working-group/:title",
    exact: true,
    render: (props) => (
      <StartBusiness {...props} key={props.match?.params?.title} />
    ),
  },
  {
    key: "Methodology",
    path: "/working-group/:title/methodology",
    exact: true,
    render: (props) => (
      <Methodology {...props} key={props.match?.params?.title} />
    ),
  },
  {
    key: "CompareCountries",
    path: "/working-group/:title/business-comparison",
    exact: true,
    render: (props) => (
      <CompareCountries {...props} key={props.match?.params?.title} />
    ),
  },
  {
    key: "HistoricalData",
    path: "/working-group/:title/historical-data",
    exact: true,
    render: (props) => (
      <HistoricalData {...props} key={props.match?.params?.title} />
    ),
  },
  {
    key: "WhatToReform",
    path: "/working-group/:title/what-to-reform",
    exact: true,
    render: (props) => (
      <WhatToReform {...props} key={props.match?.params?.title} />
    ),
  },

  // Default redirect (handled by consumer when mapping)
  { key: "defaultRedirect", redirectTo: "/dashboard/home" },
];

//  create a object of route keys
export const ROUTE_KEYS = {
  Dashboard: "Dashboard",
  WorkingGroups: "WorkingGroups",
  Simulator: "Simulator",
  Audit: "Audit",
  Approvals: "Approvals",
  Reform: "Reform",
  Organizations: "Organizations",
  Members: "Members",
  MembersEdit: "MembersEdit",
  Profile: "Profile",
  ProfileNotificationsEdit: "ProfileNotificationsEdit",
  ProfileEdit: "ProfileEdit",
  ProfileSecurity: "ProfileSecurity",
  Messaging: "Messaging",
  StartBusiness: "StartBusiness",
  Methodology: "Methodology",
  CompareCountries: "CompareCountries",
  HistoricalData: "HistoricalData",
  WhatToReform: "WhatToReform",
  defaultRedirect: "defaultRedirect",
};

export const HIDDEN_ROUTES = [
  ROUTE_KEYS.HistoricalData,
  ROUTE_KEYS.WhatToReform,
  ROUTE_KEYS.CompareCountries,
  ROUTE_KEYS.Messaging,
];
