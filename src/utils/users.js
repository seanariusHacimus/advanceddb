export const isUserRole = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};

export const hasPermission = (
  userRole,
  leaderGroups,
  requiredRole,
  needsLeaderGroup = false
) => {
  const hasRole = isUserRole(userRole, requiredRole);
  const hasLeaderGroup = needsLeaderGroup ? leaderGroups?.length > 0 : true;
  return hasRole && hasLeaderGroup;
};
