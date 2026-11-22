// #/features/auth/queries/role.keys.ts

export const ROLE_KEYS = {
  all: ['roles'] as const,
  lists: (params?: Record<string, unknown>) =>
    [...ROLE_KEYS.all, 'lists', params ?? {}] as const,
  list: (params?: Record<string, unknown>) =>
    [...ROLE_KEYS.all, 'list', params ?? {}] as const,
  details: () => [...ROLE_KEYS.all, 'detail'] as const,
  detail: (id: string | number) =>
    [...ROLE_KEYS.details(), String(id)] as const,
}
