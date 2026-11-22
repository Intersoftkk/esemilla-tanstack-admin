// #/features/auth/components/role-permission-stats.tsx

'use client'

interface StatsProps {
  totalCount: number
  grantedCount: number
  coveragePercent: number
}

export function RolePermissionStats({
  totalCount,
  grantedCount,
  coveragePercent,
}: StatsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <StatPill label="Total" value={totalCount} variant="default" />
      <StatPill label="Granted" value={grantedCount} variant="success" />
      <StatPill
        label="Coverage"
        value={`${coveragePercent}%`}
        variant="primary"
      />
    </div>
  )
}

function StatPill({
  label,
  value,
  variant,
}: {
  label: string
  value: string | number
  variant: 'default' | 'success' | 'primary'
}) {
  const variants = {
    default: 'bg-muted/50 text-foreground border-border',
    success:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    primary: 'bg-primary/10 text-primary border-primary/20',
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${variants[variant]}`}
    >
      <span className="text-xs font-medium uppercase tracking-wider opacity-70">
        {label}
      </span>
      <span className="text-sm font-bold tabular-nums">{value}</span>
    </div>
  )
}
