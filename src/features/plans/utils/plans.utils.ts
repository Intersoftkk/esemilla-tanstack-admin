// #/features/plans/utils/plans.utils.ts
import { saveBlob } from '#/lib/download.ts'
import type { PlanRecord, PlanStatus } from '#/features/plans/types/plans.ts'

/** Quotes a CSV cell and escapes embedded double quotes. */
function escapeCsv(value: string | number | null | undefined): string {
    const text = value === null || value === undefined ? '' : String(value)
    return `"${text.replaceAll('"', '""')}"`
}

/** Converts plans into a CSV document with a header row. */
export function plansToCsv(plans: PlanRecord[]): string {
    const header = [
        'ID',
        'Name',
        'Company',
        'Description',
        'Start Date',
        'End Date',
        'Status',
    ]
        .map(escapeCsv)
        .join(',')

    const rows = plans.map((plan) =>
        [
            plan.id,
            plan.name,
            plan.company?.name ?? '',
            plan.description ?? '',
            plan.start_date ?? '',
            plan.end_date ?? '',
            plan.status,
        ]
            .map(escapeCsv)
            .join(','),
    )

    return [header, ...rows].join('\r\n')
}

/** Downloads the visible plans as a CSV file. */
export function downloadPlansCsv(plans: PlanRecord[]): void {
    saveBlob(
        new Blob([plansToCsv(plans)], { type: 'text/csv;charset=utf-8;' }),
        `plans-${new Date().toISOString().slice(0, 10)}.csv`,
    )
}

/** Counts plans per status for the summary cards. */
export function countPlansByStatus(
    plans: PlanRecord[],
): Record<PlanStatus, number> {
    const counts: Record<PlanStatus, number> = {
        draft: 0,
        active: 0,
        completed: 0,
        archived: 0,
    }

    for (const plan of plans) counts[plan.status] += 1
    return counts
}
