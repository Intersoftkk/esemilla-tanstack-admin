// #/features/auth/components/role-permission-empty-state.tsx

'use client'

import { Shield, Users } from 'lucide-react'
import type { TargetType } from '#/features/auth/types/role-permission.types.ts'

interface EmptyStateProps {
  targetType: TargetType
}

export function RolePermissionEmptyState({ targetType }: EmptyStateProps) {
  return (
    <div className="relative rounded-2xl border-2 border-dashed border-border/60 bg-gradient-to-br from-muted/20 via-background to-muted/10 overflow-hidden">
      <div className="relative flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20">
            {targetType === 'role' ? (
              <Shield className="h-10 w-10" />
            ) : (
              <Users className="h-10 w-10" />
            )}
          </div>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1.5">
          No {targetType} selected
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Choose a {targetType} from the dropdown above to begin configuring
          their permissions.
        </p>
      </div>
    </div>
  )
}
