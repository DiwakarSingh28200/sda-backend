export const hasPermission = (userPermissions: string[], requiredPermissions: string[]) => {
  return requiredPermissions.some((perm) => userPermissions.includes(perm))
}

export const hasRole = (userRoles: string[], allowedRoles: string[]) => {
  return allowedRoles.some((role) => userRoles.includes(role))
}
