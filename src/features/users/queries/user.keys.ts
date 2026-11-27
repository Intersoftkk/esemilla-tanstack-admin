// #/features/users/queries/user.keys.ts

export const USER_KEYS = {
    all: ['users'] as const,
    /** Keys for paginated user lists. */
    lists: (params?: Record<string, unknown>) =>
        [...USER_KEYS.all, 'lists', params ?? {}] as const,
    /** Key for a single (unpaginated) user list. */
    list: (params?: Record<string, unknown>) =>
        [...USER_KEYS.all, 'list', params ?? {}] as const,
    /** Base key for user details. */
    details: () => [...USER_KEYS.all, 'detail'] as const,
    /** Key for a single user detail. */
    detail: (id: string | number) =>
        [...USER_KEYS.details(), String(id)] as const,
    /** Key for the companies available to users. */
    companies: () => [...USER_KEYS.all, 'companies'] as const,
}
