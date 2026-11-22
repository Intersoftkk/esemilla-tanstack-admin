// #/features/auth/queries/permission.queries.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { PERMISSION_KEYS } from '#/features/auth/queries/permission.keys'
import {
  getPermissionsFn,
  getPermissionByIdFn,
  createPermissionFn,
  updatePermissionFn,
  deletePermissionFn,
} from '#/features/auth/server/permission.functions'
import type {
  PermissionRecord,
} from '#/features/auth/types/role-permission.types'
import type {
  PermissionFormData,
} from '#/features/auth/schema/role-permission.schema'

type QOpts<TRes, TData, TParams = void> = Omit<
  UseQueryOptions<TRes, Error, TData>,
  'queryKey' | 'queryFn'
> & {
  params?: TParams
  include?: string[]
}

/** Grouped permissions by module (searchable) */
export function usePermissionsQuery(opts?: { params: {} }) {
  const { params, ...queryOpts } = opts ?? {}
  const getPermissions = useServerFn(getPermissionsFn)

  return useQuery({
    queryKey: PERMISSION_KEYS.list(params),
    queryFn: () => getPermissions({ data: params ?? {} }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
    ...queryOpts,
  })
}

/** Single permission detail by ID or UUID */
export function usePermissionQuery<T = PermissionRecord>(
  idOrUuid: string | number,
  opts?: QOpts<PermissionRecord, T>,
) {
  const { include, enabled = true, ...queryOpts } = opts ?? {}
  const getPermissionById = useServerFn(getPermissionByIdFn)

  return useQuery({
    queryKey: PERMISSION_KEYS.detail(idOrUuid),
    queryFn: () =>
      getPermissionById({ data: { id: Number(idOrUuid), include } }),
    staleTime: 1000 * 60 * 10,
    ...queryOpts,
    enabled: Boolean(idOrUuid) && enabled,
  })
}

/** Create permission mutation */
export function useCreatePermissionMutation() {
  const queryClient = useQueryClient()
  const createPermission = useServerFn(createPermissionFn)

  return useMutation({
    mutationFn: (payload: PermissionFormData) =>
      createPermission({ data: payload }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PERMISSION_KEYS.all })
    },
  })
}

/** Update permission mutation */
export function useUpdatePermissionMutation() {
  const queryClient = useQueryClient()
  const updatePermission = useServerFn(updatePermissionFn)

  return useMutation({
    mutationFn: (data: {
      id: number | string
      payload: Partial<PermissionFormData>
    }) =>
      updatePermission({
        data: { id: Number(data.id), payload: data.payload },
      }),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: PERMISSION_KEYS.all })
      if (data.id) {
        void queryClient.invalidateQueries({
          queryKey: PERMISSION_KEYS.detail(data.id),
        })
      }
    },
  })
}

/** Delete permission mutation */
export function useDeletePermissionMutation() {
  const queryClient = useQueryClient()
  const deletePermission = useServerFn(deletePermissionFn)

  return useMutation({
    mutationFn: (id: number | string) =>
      deletePermission({ data: { id: Number(id) } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PERMISSION_KEYS.all })
    },
  })
}
