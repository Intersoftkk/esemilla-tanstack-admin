// #/features/auth/components/role-permission-header.tsx

'use client'

import { Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge } from '#/components/ui/badge.tsx'

export function RolePermissionHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex items-start gap-2">
        <div className="relative">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground ring-1 ring-primary/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-background flex items-center justify-center">
            <Sparkles className="h-2.5 w-2.5 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Access Control Center
            </h1>
            <Badge
              variant="outline"
              className="hidden sm:inline-flex border-primary/30 bg-primary/5 text-primary text-[10px] font-semibold uppercase tracking-wider"
            >
              <Lock className="mr-1 h-2.5 w-2.5" />
              Secure
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Fine-tune feature permissions for roles and users with granular,
            real-time control.
          </p>
        </div>
      </div>
    </div>
  )
}
