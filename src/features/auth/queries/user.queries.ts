// #/features/auth/queries/user.queries.ts

import {
  useQuery,
  keepPreviousData
} from '@tanstack/react-query'
import type {UseQueryOptions} from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start'
import { USER_KEYS } from '#/features/auth/queries/user.keys'
import {
  getUsersFn,
  getUserByIdFn,
  getPaginatedUsersFn,
} from '#/features/auth/server/user.functions'
import type { PaginatedResponse } from '#/types'
import type { User } from '#/features/auth/types/user.types'
import type { UserSearchInput } from '#/features/auth/schema/user.schema'

type QOpts<TRes, TData, TParams = void> = Omit<
  UseQueryOptions<TRes, Error, TData>,
  'queryKey' | 'queryFn'
> & {
  params?: TParams
  include?: string[]
}

/** Paginated users */
export function useUsersPaginateQuery<T = PaginatedResponse<User>>(
  opts?: QOpts<PaginatedResponse<User>, T, UserSearchInput>,
) {
  const { params, ...queryOpts } = opts ?? {}
  const getUsers = useServerFn(getPaginatedUsersFn)

  return useQuery({
    queryKey: USER_KEYS.lists(params),
    queryFn: () => getUsers({ data: params ?? {} }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...queryOpts,
  })
}


/** List users (searchable) */
export function useUsersQuery<T = User[]>(
  opts?: QOpts<User[], T, UserSearchInput>,
) {
  const { params, ...queryOpts } = opts ?? {}
  const getUsers = useServerFn(getUsersFn)

  return useQuery({
    queryKey: USER_KEYS.list(params),
    queryFn: () => getUsers({ data: params ?? {} }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...queryOpts,
  })
}

/** Single user detail by ID */
export function useUserQuery<T = User>(
  id: string | number,
  opts?: QOpts<User, T>,
) {
  const { include, enabled = true, ...queryOpts } = opts ?? {}
  const getUserById = useServerFn(getUserByIdFn)

  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => getUserById({ data: { id: Number(id), include } }),
    staleTime: 1000 * 60 * 10,
    ...queryOpts,
    enabled: Boolean(id) && enabled,
  })
}
