// #/features/payments/utils/payments.utils.ts
import { saveBlob } from '#/lib/download.ts'
import type { PaymentRecord, PaymentStatus } from '#/features/payments/types/payments.ts'

/** Quotes a CSV cell and escapes embedded double quotes. */
function escapeCsv(value: string | number | null | undefined): string {
    const text = value === null || value === undefined ? '' : String(value)
    return `"${text.replaceAll('"', '""')}"`
}

/** Converts payments into a CSV document with a header row. */
export function paymentsToCsv(payments: PaymentRecord[]): string {
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

    const rows = payments.map((payment) =>
        [
            payment.id,
            payment.name,
            payment.company?.name ?? '',
            payment.description ?? '',
            payment.start_date ?? '',
            payment.end_date ?? '',
            payment.status,
        ]
            .map(escapeCsv)
            .join(','),
    )

    return [header, ...rows].join('\r\n')
}

/** Downloads the visible payments as a CSV file. */
export function downloadPaymentsCsv(payments: PaymentRecord[]): void {
    saveBlob(
        new Blob([paymentsToCsv(payments)], { type: 'text/csv;charset=utf-8;' }),
        `payments-${new Date().toISOString().slice(0, 10)}.csv`,
    )
}

/** Counts payments per status for the summary cards. */
export function countPaymentsByStatus(
    payments: PaymentRecord[],
): Record<PaymentStatus, number> {
    const counts: Record<PaymentStatus, number> = {
        draft: 0,
        active: 0,
        completed: 0,
        archived: 0,
    }

    for (const payment of payments) counts[payment.status] += 1
    return counts
}
