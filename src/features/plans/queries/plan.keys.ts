// #/features/plans/queries/plan.keys.ts

export const PLAN_KEYS = {
  all: ['plans'] as const,
  /** Keys for paginated plan lists. */
  lists: (params?: Record<string, unknown>) =>
    [...PLAN_KEYS.all, 'lists', params ?? {}] as const,
  /** Key for a single (unpaginated) plan list. */
  list: (params?: Record<string, unknown>) =>
    [...PLAN_KEYS.all, 'list', params ?? {}] as const,
  /** Base key for plan details. */
  details: () => [...PLAN_KEYS.all, 'detail'] as const,
  /** Key for a single plan detail. */
  detail: (id: string | number) =>
    [...PLAN_KEYS.details(), String(id)] as const,
  /** Key for the companies available to plans. */
  companies: () => [...PLAN_KEYS.all, 'companies'] as const,
}
