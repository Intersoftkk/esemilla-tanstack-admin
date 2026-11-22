// #/features/auth/queries/permission.keys.ts

export const PERMISSION_KEYS = {
  all: ['permissions'] as const,
  lists: (params?: Record<string, unknown>) =>
    [...PERMISSION_KEYS.all, 'lists', params ?? {}] as const,
  list: (params?: Record<string, unknown>) =>
    [...PERMISSION_KEYS.all, 'list', params ?? {}] as const,
  details: () => [...PERMISSION_KEYS.all, 'detail'] as const,
  detail: (id: string | number) =>
    [...PERMISSION_KEYS.details(), String(id)] as const,
}
