// #/features/auth/queries/user-permission.keys.ts

export const USER_PERMISSION_KEYS = {
  all: ['user-permissions'] as const,
  lists: (params?: Record<string, unknown>) =>
    [...USER_PERMISSION_KEYS.all, 'lists', params ?? {}] as const,
  list: (params?: Record<string, unknown>) =>
    [...USER_PERMISSION_KEYS.all, 'list', params ?? {}] as const,
  details: () => [...USER_PERMISSION_KEYS.all, 'detail'] as const,
  detail: (id: string | number) =>
    [...USER_PERMISSION_KEYS.details(), String(id)] as const,
}
