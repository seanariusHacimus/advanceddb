export const isUserRole = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};
