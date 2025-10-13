export const MENU_TYPES = {
  WORKING_GROUP: "working-group",
  PROFILE: "profile",
  DASHBOARD: "dashboard",
  MESSAGING: "messaging",
};

export const WORKING_GROUP_MENU_ITEMS = [
  {
    key: "methodology",
    path: "methodology",
    title: "Methodology",
    required: true,
    isHidden: true,
  },
  {
    key: "historical-data",
    path: "historical-data",
    title: "Historical data",
    required: true,
    isHidden: true,
  },
  {
    key: "what-to-reform",
    path: "what-to-reform",
    title: "What to reform",
    required: true,
    isHidden: true,
  },
  {
    key: "business-comparison",
    path: "business-comparison",
    title: "Compare with other countries",
    required: true,
    isHidden: true,
  },
];

export const DASHBOARD_MENU_ITEMS = [
  {
    key: "home",
    path: "/dashboard/home",
    labelKey: "Home",
    style: { minWidth: 50 },
  },
  {
    key: "db-ranking-simulator",
    path: "/dashboard/db-ranking-simulator",
    labelKey: "DB Ranking Simulator",
  },
  {
    key: "reform-update-for-db-team",
    path: "/dashboard/reform-update-for-db-team",
    labelKey: "Reform Update for DB Team",
  },
];

export const USER_MANAGEMENT_SUBMENU = {
  key: "SubMenu",
  titleKey: "Manage Users",
  items: [
    {
      key: "members",
      path: "/dashboard/members",
      labelKey: "Manage Users",
      roles: ["superuser", "coordinator", "leader"],
    },
    {
      key: "audit",
      path: "/dashboard/audit",
      labelKey: "Audit log",
      roles: ["superuser", "coordinator"],
    },
  ],
};

export const PROFILE_MENU_ITEMS = [
  {
    key: "profile",
    path: "/profile",
    labelKey: "Profile",
    exact: true,
  },
  {
    key: "notification-settings",
    path: "/profile/notification-settings",
    labelKey: "Notification settings",
  },
  {
    key: "security",
    path: "/profile/security",
    labelKey: "Security",
  },
  ...USER_MANAGEMENT_SUBMENU.items,
];

export const APPROVAL_MENU_ITEM = {
  key: "approvals",
  path: "/dashboard/approvals",
  labelKey: "Approval inbox",
  roles: ["superuser"],
  hasLeaderGroups: true,
  badge: true,
};

export const SIDEBAR_MENU_ITEMS = [
  {
    key: "dashboard",
    path: "/dashboard",
    labelKey: "Dashboard",
    icon: "dashboard",
  },
];

export const ROLE_PERMISSIONS = {
  superuser: ["superuser", "coordinator", "leader", "member", "observer"],
  coordinator: ["coordinator", "leader", "member", "observer"],
  leader: ["leader", "member", "observer"],
  member: ["member", "observer"],
  observer: ["observer"],
};

export const MENU_STYLES = {
  header: {
    padding: "0 40px",
    background: "var(--background-color)",
  },
  sidebar: {
    maxHeight: "100vh",
    height: "100",
    minHeight: "100vh",
    position: "sticky",
    top: 0,
    borderRight: "1px solid var(--border-grey)",
  },
};
