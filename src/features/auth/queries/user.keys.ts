// #/features/auth/queries/user.keys.ts

export const USER_KEYS = {
  all: ['users'] as const,
  lists: (params?: Record<string, unknown>) =>
    [...USER_KEYS.all, 'lists', params ?? {}] as const,
  list: (params?: Record<string, unknown>) =>
    [...USER_KEYS.all, 'list', params ?? {}] as const,
  details: () => [...USER_KEYS.all, 'detail'] as const,
  detail: (id: string | number) =>
    [...USER_KEYS.details(), String(id)] as const,
}
