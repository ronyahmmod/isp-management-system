export const roles = {
  admin: ["admin", "manager", "employee", "cashier", "technician"],
  manager: ["employee", "cashier", "technician"],
  employee: [],
};

export function canAccess(userRole, allowedRoles) {
  return allowedRoles.includes(userRole);
}
