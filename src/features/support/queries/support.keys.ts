// #/features/support/queries/support.keys.ts

export const SUPPORT_KEYS = {
    all: ['support'] as const,
    /** Keys for paginated support lists. */
    lists: (params?: Record<string, unknown>) =>
        [...SUPPORT_KEYS.all, 'lists', params ?? {}] as const,
    /** Key for a single (unpaginated) support list. */
    list: (params?: Record<string, unknown>) =>
        [...SUPPORT_KEYS.all, 'list', params ?? {}] as const,
    /** Base key for support details. */
    details: () => [...SUPPORT_KEYS.all, 'detail'] as const,
    /** Key for a single support detail. */
    detail: (id: string | number) =>
        [...SUPPORT_KEYS.details(), String(id)] as const,
    /** Key for the companies available to support. */
    companies: () => [...SUPPORT_KEYS.all, 'companies'] as const,
}
