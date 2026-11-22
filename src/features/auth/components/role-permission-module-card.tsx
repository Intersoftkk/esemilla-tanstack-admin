// #/features/auth/components/role-permission-module-card.tsx

'use client'

import { Layers } from 'lucide-react'
import { Checkbox } from '#/components/ui/checkbox.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx'
import { formatModuleName } from '#/features/auth/hooks/use-permission.ts'
import type { PermissionRecord } from '#/features/auth/types/role-permission.types.ts'
import { RolePermissionChip } from '#/features/auth/components/role-permission-chip.tsx'

interface RolePermissionModuleCardProps {
  moduleName: string
  modIdx: number
  subGroups: Record<string, PermissionRecord[]>
  checked: Record<string, boolean>
  togglePermission: (name: string, value: boolean) => void
  toggleModule: (perms: PermissionRecord[], value: boolean) => void
}

export function RolePermissionModuleCard({
  moduleName,
  modIdx,
  subGroups,
  checked,
  togglePermission,
  toggleModule,
}: RolePermissionModuleCardProps) {
  const subGroupEntries = Object.entries(subGroups)
  const allSectionPerms: PermissionRecord[] = subGroupEntries.flatMap(
    ([_, perms]) => (Array.isArray(perms) ? perms : []),
  )

  const allSectionChecked =
    allSectionPerms.length > 0 &&
    allSectionPerms.every((p) => Boolean(checked[p.name]))

  const someSectionChecked =
    allSectionPerms.some((p) => Boolean(checked[p.name])) && !allSectionChecked

  const sectionSelectedCount = allSectionPerms.filter((p) =>
    Boolean(checked[p.name]),
  ).length

  const sectionPercent =
    allSectionPerms.length > 0
      ? Math.round((sectionSelectedCount / allSectionPerms.length) * 100)
      : 0

  return (
    <div className="group/module rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Module Header Bar */}
      <div className="relative overflow-hidden">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
              <Layers className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-bold text-base tracking-tight text-foreground leading-none">
                {formatModuleName(moduleName)}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{allSectionPerms.length} permissions</span>
                <span className="text-muted-foreground/40">•</span>
                <span className="font-medium text-primary">
                  {sectionSelectedCount} active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                  style={{ width: `${sectionPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono font-semibold text-muted-foreground tabular-nums w-9 text-right">
                {sectionPercent}%
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-background hover:bg-muted/50 transition-colors">
              <Checkbox
                id={`module-checkbox-${moduleName}-${modIdx}`}
                checked={
                  allSectionChecked
                    ? true
                    : someSectionChecked
                      ? 'indeterminate'
                      : false
                }
                onCheckedChange={(val) =>
                  toggleModule(allSectionPerms, Boolean(val))
                }
              />
              <label
                htmlFor={`module-checkbox-${moduleName}-${modIdx}`}
                className="text-xs font-semibold select-none text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                Select All
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/20 hover:bg-muted/20 border-b">
            <TableHead className="w-[240px] sm:w-[280px] font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Feature
            </TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Granular Permissions
            </TableHead>
            <TableHead className="w-[140px] text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Toggle All
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subGroupEntries.map(([subGroupName, perms], subIdx) => {
            const permList: PermissionRecord[] = Array.isArray(perms)
              ? perms
              : []

            const allRowChecked =
              permList.length > 0 &&
              permList.every((p) => Boolean(checked[p.name]))

            const someRowChecked =
              permList.some((p) => Boolean(checked[p.name])) && !allRowChecked

            const rowSelectedCount = permList.filter((p) =>
              Boolean(checked[p.name]),
            ).length

            return (
              <TableRow
                key={`row-${moduleName}-${subGroupName}`}
                className={`group/row transition-colors border-b last:border-b-0 ${
                  allRowChecked
                    ? 'bg-primary/[0.02] hover:bg-primary/[0.04]'
                    : 'hover:bg-muted/30'
                }`}
              >
                <TableCell className="align-top py-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 h-2 w-2 rounded-full shrink-0 transition-colors ${
                        allRowChecked
                          ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                          : rowSelectedCount > 0
                            ? 'bg-amber-500 ring-2 ring-amber-500/20'
                            : 'bg-muted-foreground/20'
                      }`}
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground truncate">
                        {formatModuleName(subGroupName)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span
                          className={`font-mono tabular-nums font-medium ${
                            allRowChecked
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : rowSelectedCount > 0
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-muted-foreground'
                          }`}
                        >
                          {rowSelectedCount}/{permList.length}
                        </span>
                        <span className="text-muted-foreground">granted</span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Permission Chips */}
                <TableCell className="align-top py-4">
                  <div className="flex flex-wrap gap-2">
                    {permList.map((p, pIdx) => {
                      const permName = p?.name ?? ''
                      if (!permName) return null
                      const isChecked = Boolean(checked[permName])
                      const chipKey = `perm-chip-${moduleName}-${subGroupName}-${permName}-${pIdx}`

                      return (
                        <RolePermissionChip
                          key={chipKey}
                          name={permName}
                          isChecked={isChecked}
                          onToggle={() =>
                            togglePermission(permName, !isChecked)
                          }
                        />
                      )
                    })}
                  </div>
                </TableCell>

                {/* Row Toggle All */}
                <TableCell className="align-top py-4 text-right">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
                    <label
                      htmlFor={`row-checkbox-${moduleName}-${subGroupName}-${subIdx}`}
                      className="text-xs text-muted-foreground font-medium cursor-pointer select-none"
                    >
                      All
                    </label>
                    <Checkbox
                      id={`row-checkbox-${moduleName}-${subGroupName}-${subIdx}`}
                      checked={
                        allRowChecked
                          ? true
                          : someRowChecked
                            ? 'indeterminate'
                            : false
                      }
                      onCheckedChange={(val) =>
                        toggleModule(permList, Boolean(val))
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
