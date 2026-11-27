// #/features/invoices/utils/invoices.utils.ts
import { saveBlob } from '#/lib/download.ts'
import type { InvoiceRecord, InvoiceStatus } from '#/features/invoices/types/invoices.ts'

/** Quotes a CSV cell and escapes embedded double quotes. */
function escapeCsv(value: string | number | null | undefined): string {
    const text = value === null || value === undefined ? '' : String(value)
    return `"${text.replaceAll('"', '""')}"`
}

/** Converts invoices into a CSV document with a header row. */
export function invoicesToCsv(invoices: InvoiceRecord[]): string {
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

    const rows = invoices.map((invoice) =>
        [
            invoice.id,
            invoice.name,
            invoice.company?.name ?? '',
            invoice.description ?? '',
            invoice.start_date ?? '',
            invoice.end_date ?? '',
            invoice.status,
        ]
            .map(escapeCsv)
            .join(','),
    )

    return [header, ...rows].join('\r\n')
}

/** Downloads the visible invoices as a CSV file. */
export function downloadInvoicesCsv(invoices: InvoiceRecord[]): void {
    saveBlob(
        new Blob([invoicesToCsv(invoices)], { type: 'text/csv;charset=utf-8;' }),
        `invoices-${new Date().toISOString().slice(0, 10)}.csv`,
    )
}

/** Counts invoices per status for the summary cards. */
export function countInvoicesByStatus(
    invoices: InvoiceRecord[],
): Record<InvoiceStatus, number> {
    const counts: Record<InvoiceStatus, number> = {
        draft: 0,
        active: 0,
        completed: 0,
        archived: 0,
    }

    for (const invoice of invoices) counts[invoice.status] += 1
    return counts
}
