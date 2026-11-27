// #/features/users/service/users.service.ts
import type { PaginatedResponse } from '#/types'

import type { UserFormData } from '#/features/users/schema/users-form.schema.ts'
import type { UsersListParams } from '#/features/users/schema/users-search.schema.ts'
import type { UserRecord } from '#/features/users/types/users.ts'
import {
    createUserFn,
    deleteUserFn,
    deleteUsersFn,
    getCompaniesFn,
    getUsersFn,
    updateUserFn,
} from '#/features/users/server/users.functions.ts'

/** Client-side wrappers around the server functions for the users feature. */
export async function fetchPaginatedUsers(
    params: UsersListParams,
): Promise<PaginatedResponse<UserRecord>> {
    return getUsersFn({ data: params })
}

/** Client wrapper for the companies query. */
export async function fetchCompanies(): Promise<
    Awaited<ReturnType<typeof getCompaniesFn>>
> {
    return getCompaniesFn()
}

/** Client wrapper for creating a user. */
export async function createUser(
    data: UserFormData,
): Promise<UserRecord> {
    return createUserFn({ data })
}

/** Client wrapper for updating a user. */
export async function updateUser(
    id: string,
    data: UserFormData,
): Promise<UserRecord> {
    return updateUserFn({ data: { id, payload: data } })
}

/** Client wrapper for deleting a user. */
export async function deleteUser(id: string): Promise<void> {
    await deleteUserFn({ data: id })
}

/** Client wrapper for deleting several users. */
export async function deleteUsers(ids: string[]): Promise<void> {
    await deleteUsersFn({ data: ids })
}
