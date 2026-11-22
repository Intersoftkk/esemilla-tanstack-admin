// #/features/auth/components/role-permission-skeletons.tsx

'use client'

import { Skeleton } from '#/components/ui/skeleton.tsx'

export function PermissionTableSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, s) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders never reorder
          key={`skeleton-card-${s}`}
          className="rounded-2xl border bg-card overflow-hidden"
        >
          <div className="h-16 bg-gradient-to-r from-muted/40 to-transparent px-5 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
          <div className="p-5 space-y-4">
            {Array.from({ length: 3 }).map((__, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders never reorder
                key={`skeleton-row-${s}-${i}`}
                className="flex items-start justify-between gap-2 py-3 border-b last:border-0"
              >
                <div className="space-y-2 min-w-[200px]">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex gap-2 flex-wrap flex-1">
                  {Array.from({ length: 4 }).map((___, k) => (
                    <Skeleton
                      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders never reorder
                      key={`skeleton-chip-${s}-${i}-${k}`}
                      className="h-8 w-24 rounded-lg"
                    />
                  ))}
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ControlPanelSkeleton() {
  return (
    <div className="relative rounded-2xl border bg-card/80 backdrop-blur-xl shadow-sm overflow-hidden p-5 lg:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-11 w-72 rounded-md" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  )
}
