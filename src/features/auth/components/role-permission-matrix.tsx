// #/features/auth/components/role-permission-matrix.tsx

'use client'

import type {
  GroupedPermissions,
  PermissionRecord,
} from '#/features/auth/types/role-permission.types.ts'
import { RolePermissionModuleCard } from '#/features/auth/components/role-permission-module-card.tsx'

interface RolePermissionMatrixProps {
  filteredGrouped: GroupedPermissions
  checked: Record<string, boolean>
  togglePermission: (name: string, value: boolean) => void
  toggleModule: (perms: PermissionRecord[], value: boolean) => void
}

export function RolePermissionMatrix({
  filteredGrouped,
  checked,
  togglePermission,
  toggleModule,
}: RolePermissionMatrixProps) {
  return (
    <div className="space-y-6">
      {Object.entries(filteredGrouped).map(
        ([moduleName, subGroups], modIdx) => (
          <RolePermissionModuleCard
            key={`module-card-${moduleName}`}
            moduleName={moduleName}
            modIdx={modIdx}
            subGroups={subGroups}
            checked={checked}
            togglePermission={togglePermission}
            toggleModule={toggleModule}
          />
        ),
      )}
    </div>
  )
}
