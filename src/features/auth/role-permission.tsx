'use client'

import * as React from 'react'
import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { CheckCircle2, Shield, Users } from 'lucide-react'
import { toast } from 'sonner'
import * as z from 'zod'

// ── UI Containers ────────────────────────────────────────────────────
import { TooltipProvider } from '#/components/ui/tooltip.tsx'
import { FieldGroup } from '#/components/ui/field.tsx'

// ── Queries ──────────────────────────────────────────────────────────
import { useRolesQuery } from '#/features/auth/queries/role.queries.ts'
import { usePermissionsQuery } from '#/features/auth/queries/permission.queries.ts'
import { useUsersQuery } from '#/features/auth/queries/user.queries.ts'
import { useRolePermissionQueryByRoleId } from '#/features/auth/queries/role-permission.queries.ts'
import { useUserPermissionQueryByUserId } from '#/features/auth/queries/user-permission.queries.ts'
import { ROLE_PERMISSION_KEYS } from '#/features/auth/queries/role-permission.keys.ts'
import { USER_PERMISSION_KEYS } from '#/features/auth/queries/user-permission.keys.ts'

// ── Server Functions ─────────────────────────────────────────────────
import { syncRolePermissionsFn } from '#/features/auth/server/role-permission.functions.ts'
import { syncUserPermissionsFn } from '#/features/auth/server/user-permission.functions.ts'

// ── Types ────────────────────────────────────────────────────────────
import type {
  GroupedPermissions,
  PermissionRecord,
  Role,
  TargetType,
} from '#/features/auth/types/role-permission.types.ts'
import type { User } from '#/features/auth/types/user.types.ts'
import type { Option } from '#/types'

import type { TargetTypeOption } from '#/components/fields/target-type-field.tsx'
// ── Shared Generic Components ────────────────────────────────────────
import { TargetTypeField } from '#/components/fields/target-type-field.tsx'
import { SelectField } from '#/components/fields/select-field.tsx'
import { SearchField } from '#/components/fields/search-field.tsx'

// ── Modular Feature Components ───────────────────────────────────────
import { RolePermissionMatrix } from '#/features/auth/components/role-permission-matrix.tsx'
import { RolePermissionEmptyState } from '#/features/auth/components/role-permission-empty-state.tsx'
import { PermissionTableSkeleton } from '#/features/auth/components/role-permission-skeletons.tsx'
import { RolePermissionStats } from '#/features/auth/components/role-permission-stats.tsx'
import { RolePermissionActionButtons } from '#/features/auth/components/role-permission-action-buttons.tsx'
import { RolePermissionHeader } from '#/features/auth/components/role-permission-header.tsx'

const formSchema = z.object({
  targetType: z.enum(['role', 'user']),
  selectedId: z.string().min(1, 'Please select a role or user first'),
  permissions: z.record(z.string(), z.boolean()),
})

/** Shape of a raw entity returned by the query (role or user with permissions) */
type RawEntity = { permissions?: PermissionRecord[]; name?: string }

export default function RolePermissions() {
  const queryClient = useQueryClient()

  const [targetType, setTargetType] = useState<TargetType>('role')
  const [selectedId, setSelectedId] = useState('')
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')

  // Debounce search input — React defers the value until the browser is idle
  const deferredSearch = useDeferredValue(searchQuery)

  const targetTypeOptions = useMemo<TargetTypeOption<TargetType>[]>(
    () => [
      { value: 'role', label: 'Role', icon: Shield },
      { value: 'user', label: 'User', icon: Users },
    ],
    [],
  )

  // ── Server-side filtered permissions ────────────────────────────────
  const {
    data: permissionData,
    isLoading: permissionsLoading,
  } = usePermissionsQuery({
    params: {
      ...(deferredSearch ? { search: deferredSearch } : {}),
    },
  })

  const { data: rolesData, isLoading: rolesLoading } = useRolesQuery({
    enabled: targetType === 'role',
  })

  const { data: usersData, isLoading: usersLoading } = useUsersQuery({
    enabled: targetType === 'user',
  })

  const { data: rolePermissionData, isLoading: isRoleLoading } =
    useRolePermissionQueryByRoleId(selectedId, {
      enabled: targetType === 'role' && Boolean(selectedId),
    })

  const { data: userPermissionData, isLoading: isUserLoading } =
    useUserPermissionQueryByUserId(selectedId, {
      enabled: targetType === 'user' && Boolean(selectedId),
    })

  const isEntityLoading =
    Boolean(selectedId) &&
    (targetType === 'role' ? isRoleLoading : isUserLoading)

  const flatPermissions = useMemo<PermissionRecord[]>(() => {
    if (!permissionData) return []
    const flat: PermissionRecord[] = []
    const typed = permissionData as Record<
      string,
      Record<string, PermissionRecord[]>
    >

    Object.values(typed).forEach((subGroup) => {
      if (!subGroup) return
      Object.values(subGroup).forEach((perms) => {
        if (Array.isArray(perms)) {
          flat.push(
            ...perms.filter((p): p is PermissionRecord => Boolean(p && p.name)),
          )
        }
      })
    })
    return flat
  }, [permissionData])

  const assignedList = useMemo<PermissionRecord[]>(() => {
    if (targetType === 'role') {
      if (!rolePermissionData) return []
      if (Array.isArray(rolePermissionData)) {
        return (rolePermissionData as unknown as RawEntity[]).flatMap(
          (rp) => rp?.permissions ?? (rp?.name ? [rp as PermissionRecord] : []),
        )
      }
      return (rolePermissionData as unknown as RawEntity).permissions ?? []
    } else {
      if (!userPermissionData) return []
      if (Array.isArray(userPermissionData)) {
        return (userPermissionData as unknown as RawEntity[]).flatMap(
          (up) => up?.permissions ?? (up?.name ? [up as PermissionRecord] : []),
        )
      }
      return (userPermissionData as unknown as RawEntity).permissions ?? []
    }
  }, [targetType, rolePermissionData, userPermissionData])

  React.useEffect(() => {
    if (!selectedId || flatPermissions.length === 0) {
      setChecked({})
      return
    }

    const assignedSet = new Set(
      assignedList
        .map((p) => p.name)
        .filter((name): name is string => Boolean(name)),
    )

    const next: Record<string, boolean> = {}
    for (const p of flatPermissions) {
      if (p.name) {
        next[p.name] = assignedSet.has(p.name)
      }
    }
    setChecked(next)
  }, [selectedId, flatPermissions, assignedList])

  const handleTargetTypeChange = (newType: TargetType) => {
    setTargetType(newType)
    setSelectedId('')
    setChecked({})
    form.setFieldValue('targetType', newType)
    form.setFieldValue('selectedId', '')
  }

  const updateRoleMutation = useMutation({
    mutationFn: (payload: { role_id: number; permissions: string[] }) =>
      syncRolePermissionsFn({ data: payload }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROLE_PERMISSION_KEYS.all })
      toast.success('Role permissions updated successfully', {
        icon: <CheckCircle2 className="h-4 w-4" />,
      })
    },
    onError: (err: Error) =>
      toast.error(err.message || 'Failed to update role permissions'),
  })

  const updateUserMutation = useMutation({
    mutationFn: (payload: { user_id: number; permissions: string[] }) =>
      syncUserPermissionsFn({ data: payload }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_PERMISSION_KEYS.all })
      toast.success('User permissions updated successfully', {
        icon: <CheckCircle2 className="h-4 w-4" />,
      })
    },
    onError: (err: Error) =>
      toast.error(err.message || 'Failed to update user permissions'),
  })

  const isSaving = updateRoleMutation.isPending || updateUserMutation.isPending

  const options = useMemo<Option[]>(() => {
    if (targetType === 'role') {
      return (rolesData ?? [])
        .filter((r): r is Role => Boolean(r && r.id != null))
        .map((r: Role) => ({
          value: String(r.id),
          label: r.name || `Role #${r.id}`,
        }))
    }
    return (usersData ?? [])
      .filter((u): u is User => Boolean(u && u.id != null))
      .map((u: User) => ({
        value: String(u.id),
        label: u.name || `User #${u.id}`,
      }))
  }, [targetType, rolesData, usersData])

  const optionsLoading =
    (targetType === 'role' ? rolesLoading : usersLoading) ||
    permissionsLoading ||
    isEntityLoading

  const actionsDisabled = !selectedId || optionsLoading || isSaving

  const form = useForm({
    defaultValues: {
      targetType: targetType,
      selectedId: selectedId,
      permissions: checked,
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const selectedPermissions = Object.entries(checked)
        .filter(([, isChecked]) => isChecked)
        .map(([name]) => name)

      if (value.targetType === 'role') {
        updateRoleMutation.mutate({
          role_id: Number(value.selectedId),
          permissions: selectedPermissions,
        })
      } else {
        updateUserMutation.mutate({
          user_id: Number(value.selectedId),
          permissions: selectedPermissions,
        })
      }
    },
  })

  const togglePermission = useCallback((name: string, value: boolean) => {
    setChecked((prev) => ({ ...prev, [name]: value }))
  }, [])

  const toggleModule = useCallback(
    (perms: PermissionRecord[], value: boolean) => {
      const list: PermissionRecord[] = Array.isArray(perms)
        ? perms
        : (Object.values(perms || {}))
      setChecked((prev) => {
        const next = { ...prev }
        list.forEach((p) => {
          if (p?.name) next[p.name] = value
        })
        return next
      })
    },
    [],
  )

  const selectAll = useCallback(() => {
    const next: Record<string, boolean> = {}
    flatPermissions.forEach((p) => {
      if (p.name) next[p.name] = true
    })
    setChecked(next)
  }, [flatPermissions])

  const clearAll = useCallback(() => {
    const next: Record<string, boolean> = {}
    flatPermissions.forEach((p) => {
      if (p.name) next[p.name] = false
    })
    setChecked(next)
  }, [flatPermissions])

  // ── Stats ───────────────────────────────────────────────────────────
  const totalCount = flatPermissions.length
  const grantedCount = Object.values(checked).filter(Boolean).length
  const coveragePercent =
    totalCount > 0 ? Math.round((grantedCount / totalCount) * 100) : 0

  // Use API-filtered data directly (no client-side filtering)
  const groupedPermissions = (permissionData as GroupedPermissions) ?? {}

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col gap-4 mx-auto">
        <RolePermissionHeader />

        {/* Form Controls Card */}
        <form
          id="role-permissions-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="relative rounded-2xl border bg-card/80 backdrop-blur-xl shadow-sm overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <FieldGroup className="p-5 lg:p-6 gap-2">
              {/* Target Type Field (Unified Generic component) */}
              <form.Field name="targetType">
                {(field) => (
                  <TargetTypeField
                    value={field.state.value}
                    onChange={handleTargetTypeChange}
                    options={targetTypeOptions}
                    label="Assign to"
                  />
                )}
              </form.Field>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-border/60" />
                </div>
              </div>

              {/* Entity Selector + Search Field */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <form.Field name="selectedId">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length
                    return (
                      <SelectField
                        name={field.name}
                        value={field.state.value}
                        onChange={(val) => {
                          field.handleChange(val)
                          setSelectedId(val)
                        }}
                        options={options}
                        label={
                          targetType === 'role' ? 'Select Role' : 'Select User'
                        }
                        placeholder={
                          targetType === 'role'
                            ? 'Choose a role to configure'
                            : 'Choose a user to configure'
                        }
                        isLoading={optionsLoading}
                        disabled={isSaving}
                        isInvalid={isInvalid}
                        errors={field.state.meta.errors}
                      />
                    )
                  }}
                </form.Field>

                <SearchField
                  value={searchQuery}
                  onChange={setSearchQuery}
                  label="Search Permissions"
                  placeholder="Filter by name, module, or action..."
                  disabled={!selectedId}
                />
              </div>

              {/* Stats + Actions Row */}
              {selectedId && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t">
                  <RolePermissionStats
                    totalCount={totalCount}
                    grantedCount={grantedCount}
                    coveragePercent={coveragePercent}
                  />
                  <RolePermissionActionButtons
                    onSelectAll={selectAll}
                    onClearAll={clearAll}
                    isSaving={isSaving}
                    disabled={actionsDisabled}
                  />
                </div>
              )}
            </FieldGroup>
          </div>
        </form>

        {/* Matrix / Empty State / Loading */}
        {!selectedId ? (
          <RolePermissionEmptyState targetType={targetType} />
        ) : optionsLoading ? (
          <PermissionTableSkeleton />
        ) : (
          <RolePermissionMatrix
            filteredGrouped={groupedPermissions}
            checked={checked}
            togglePermission={togglePermission}
            toggleModule={toggleModule}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
