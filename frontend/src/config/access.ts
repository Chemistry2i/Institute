import { navigationItems } from './navigation'
import { roleProfiles, type Permission, type RoleId } from './roles'
import type { NavigationItem } from './navigation'

export function hasPermission(roleId: RoleId, permission: Permission): boolean {
  return roleProfiles[roleId].permissions.includes(permission)
}

export function hasAnyPermission(roleId: RoleId, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(roleId, permission))
}

export function getNavigationForRole(roleId: RoleId): NavigationItem[] {
  return navigationItems.filter((item) => hasAnyPermission(roleId, item.permissions))
}
