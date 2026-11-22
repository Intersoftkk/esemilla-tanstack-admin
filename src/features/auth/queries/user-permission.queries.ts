// #/features/auth/queries/user-permission.queries.ts

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { USER_PERMISSION_KEYS } from '#/features/auth/queries/user-permission.keys'
import {
  getUserPermissionsFn,
  getUserPermissionByIdFn,
  getPaginatedUserPermissionsFn,
} from '#/features/auth/server/user-permission.functions'
import type { PaginatedResponse } from '#/types'
import type { UserPermission } from '#/features/auth/types/role-permission.types'
import type { UserPermissionSearchInput } from '#/features/auth/schema/role-permission.schema'

type QOpts<TRes, TData, TParams = void> = Omit<
  UseQueryOptions<TRes, Error, TData>,
  'queryKey' | 'queryFn'
> & {
  params?: TParams
  include?: string[]
}

/** Paginated user permissions */
export function useUserPermissionsPaginateQuery<
  T = PaginatedResponse<UserPermission>,
>(
  opts?: QOpts<PaginatedResponse<UserPermission>, T, UserPermissionSearchInput>,
) {
  const { params, ...queryOpts } = opts ?? {}
  const getUserPermissions = useServerFn(getPaginatedUserPermissionsFn)

  return useQuery({
    queryKey: USER_PERMISSION_KEYS.lists(params),
    queryFn: () => getUserPermissions({ data: params ?? {} }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...queryOpts,
  })
}

/** List user permissions (searchable) */
export function useUserPermissionsQuery<T = UserPermission[]>(
  opts?: QOpts<UserPermission[], T, UserPermissionSearchInput>,
) {
  const { params, ...queryOpts } = opts ?? {}
  const getUserPermissions = useServerFn(getUserPermissionsFn)

  return useQuery({
    queryKey: USER_PERMISSION_KEYS.list(params),
    queryFn: () => getUserPermissions({ data: params ?? {} }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...queryOpts,
  })
}

/** User permissions detail by User ID */
export function useUserPermissionQueryByUserId<T = UserPermission>(
  userId: string | number,
  opts?: QOpts<UserPermission, T>,
) {
  const { include, enabled = true, ...queryOpts } = opts ?? {}
  const getUserPermissionById = useServerFn(getUserPermissionByIdFn)

  return useQuery({
    queryKey: USER_PERMISSION_KEYS.detail(userId),
    queryFn: () =>
      getUserPermissionById({
        data: { user_id: Number(userId), id: Number(userId), include },
      }),
    staleTime: 1000 * 60 * 10,
    ...queryOpts,
    enabled: Boolean(userId) && enabled,
  })
}