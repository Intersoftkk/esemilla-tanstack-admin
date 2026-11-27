// #/features/support/utils/support.utils.ts
import { saveBlob } from '#/lib/download.ts'
import type { SupportRecord, SupportStatus } from '#/features/support/types/support.ts'

/** Quotes a CSV cell and escapes embedded double quotes. */
function escapeCsv(value: string | number | null | undefined): string {
    const text = value === null || value === undefined ? '' : String(value)
    return `"${text.replaceAll('"', '""')}"`
}

/** Converts support records into a CSV document with a header row. */
export function supportToCsv(records: SupportRecord[]): string {
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

    const rows = records.map((record) =>
        [
            record.id,
            record.name,
            record.company?.name ?? '',
            record.description ?? '',
            record.start_date ?? '',
            record.end_date ?? '',
            record.status,
        ]
            .map(escapeCsv)
            .join(','),
    )

    return [header, ...rows].join('\r\n')
}

/** Downloads the visible support records as a CSV file. */
export function downloadSupportCsv(records: SupportRecord[]): void {
    saveBlob(
        new Blob([supportToCsv(records)], { type: 'text/csv;charset=utf-8;' }),
        `support-${new Date().toISOString().slice(0, 10)}.csv`,
    )
}

/** Counts support records per status for the summary cards. */
export function countSupportByStatus(
    records: SupportRecord[],
): Record<SupportStatus, number> {
    const counts: Record<SupportStatus, number> = {
        draft: 0,
        active: 0,
        completed: 0,
        archived: 0,
    }

    for (const record of records) counts[record.status] += 1
    return counts
}
