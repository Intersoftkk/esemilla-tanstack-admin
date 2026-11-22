// #/features/auth/queries/role-permission.keys.ts

export const ROLE_PERMISSION_KEYS = {
  all: ['role-permissions'] as const,
  lists: (params?: Record<string, unknown>) =>
    [...ROLE_PERMISSION_KEYS.all, 'lists', params ?? {}] as const,
  list: (params?: Record<string, unknown>) =>
    [...ROLE_PERMISSION_KEYS.all, 'list', params ?? {}] as const,
  details: () => [...ROLE_PERMISSION_KEYS.all, 'detail'] as const,
  detail: (id: string | number) =>
    [...ROLE_PERMISSION_KEYS.details(), String(id)] as const,
}
