// #/features/auth/queries/role-permission.queries.ts

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { ROLE_PERMISSION_KEYS } from '#/features/auth/queries/role-permission.keys'
import {
  getRolePermissionsFn,
  getRolePermissionByIdFn,
  getPaginatedRolePermissionsFn,
} from '#/features/auth/server/role-permission.functions'
import type { PaginatedResponse } from '#/types'
import type { RolePermission } from '#/features/auth/types/role-permission.types'
import type { RolePermissionSearchInput } from '#/features/auth/schema/role-permission.schema'

type QOpts<TRes, TData, TParams = void> = Omit<
  UseQueryOptions<TRes, Error, TData>,
  'queryKey' | 'queryFn'
> & {
  params?: TParams
  include?: string[]
}

/** Paginated role permissions */
export function useRolePermissionsPaginateQuery<
  T = PaginatedResponse<RolePermission>,
>(
  opts?: QOpts<PaginatedResponse<RolePermission>, T, RolePermissionSearchInput>,
) {
  const { params, ...queryOpts } = opts ?? {}
  const getRolePermissions = useServerFn(getPaginatedRolePermissionsFn)

  return useQuery({
    queryKey: ROLE_PERMISSION_KEYS.lists(params),
    queryFn: () => getRolePermissions({ data: params ?? {} }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...queryOpts,
  })
}

/** List role permissions (searchable) */
export function useRolePermissionsQuery<T = RolePermission[]>(
  opts?: QOpts<RolePermission[], T, RolePermissionSearchInput>,
) {
  const { params, ...queryOpts } = opts ?? {}
  const getRolePermissions = useServerFn(getRolePermissionsFn)

  return useQuery({
    queryKey: ROLE_PERMISSION_KEYS.list(params),
    queryFn: () => getRolePermissions({ data: params ?? {} }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...queryOpts,
  })
}

/** Role permissions detail by Role ID */
export function useRolePermissionQueryByRoleId<T = RolePermission>(
  roleId: string | number,
  opts?: QOpts<RolePermission, T>,
) {
  const { include, enabled = true, ...queryOpts } = opts ?? {}
  const getRolePermissionById = useServerFn(getRolePermissionByIdFn)

  return useQuery({
    queryKey: ROLE_PERMISSION_KEYS.detail(roleId),
    queryFn: () =>
      getRolePermissionById({
        data: { role_id: Number(roleId), id: Number(roleId), include },
      }),
    staleTime: 1000 * 60 * 10,
    ...queryOpts,
    enabled: Boolean(roleId) && enabled,
  })
}