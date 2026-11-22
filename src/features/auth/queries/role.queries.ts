// #/features/auth/queries/role.queries.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { ROLE_KEYS } from '#/features/auth/queries/role.keys'
import {
  getRolesFn,
  getRoleByIdFn,
  getPaginatedRolesFn,
  createRoleFn,
  updateRoleFn,
  deleteRoleFn,
} from '#/features/auth/server/role.functions'
import type { PaginatedResponse } from '#/types'
import type { Role } from '#/features/auth/types/role-permission.types'
import type {
  RoleSearchInput,
  RoleFormData,
} from '#/features/auth/schema/role-permission.schema'

type QOpts<TRes, TData, TParams = void> = Omit<
  UseQueryOptions<TRes, Error, TData>,
  'queryKey' | 'queryFn'
> & {
  params?: TParams
  include?: string[]
}

/** Paginated roles */
export function useRolesPaginateQuery<T = PaginatedResponse<Role>>(
  opts?: QOpts<PaginatedResponse<Role>, T, RoleSearchInput>,
) {
  const { params, ...queryOpts } = opts ?? {}
  const getRoles = useServerFn(getPaginatedRolesFn)

  return useQuery({
    queryKey: ROLE_KEYS.lists(params),
    queryFn: () => getRoles({ data: params ?? {} }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...queryOpts,
  })
}

/** List roles (searchable) */
export function useRolesQuery<T = Role[]>(
  opts?: QOpts<Role[], T, RoleSearchInput>,
) {
  const { params, ...queryOpts } = opts ?? {}
  const getRoles = useServerFn(getRolesFn)

  return useQuery({
    queryKey: ROLE_KEYS.list(params),
    queryFn: () => getRoles({ data: params ?? {} }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...queryOpts,
  })
}

/** Single role detail by ID */
export function useRoleQuery<T = Role>(
  id: string | number,
  opts?: QOpts<Role, T>,
) {
  const { include, enabled = true, ...queryOpts } = opts ?? {}
  const getRoleById = useServerFn(getRoleByIdFn)

  return useQuery({
    queryKey: ROLE_KEYS.detail(id),
    queryFn: () => getRoleById({ data: { id: Number(id), include } }),
    staleTime: 1000 * 60 * 10,
    ...queryOpts,
    enabled: Boolean(id) && enabled,
  })
}

/** Create role mutation */
export function useCreateRoleMutation() {
  const queryClient = useQueryClient()
  const createRole = useServerFn(createRoleFn)

  return useMutation({
    mutationFn: (payload: RoleFormData) => createRole({ data: payload }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROLE_KEYS.all })
    },
  })
}

/** Update role mutation */
export function useUpdateRoleMutation() {
  const queryClient = useQueryClient()
  const updateRole = useServerFn(updateRoleFn)

  return useMutation({
    mutationFn: (data: { id: number; payload: Partial<RoleFormData> }) =>
      updateRole({ data }),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ROLE_KEYS.all })
      if (data.id) {
        void queryClient.invalidateQueries({
          queryKey: ROLE_KEYS.detail(data.id),
        })
      }
    },
  })
}

/** Delete role mutation */
export function useDeleteRoleMutation() {
  const queryClient = useQueryClient()
  const deleteRole = useServerFn(deleteRoleFn)

  return useMutation({
    mutationFn: (id: number) => deleteRole({ data: { id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROLE_KEYS.all })
    },
  })
}
