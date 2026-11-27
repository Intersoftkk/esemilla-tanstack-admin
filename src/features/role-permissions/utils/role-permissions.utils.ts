// #/features/role-permissions/utils/role-permissions.utils.ts
import { saveBlob } from '#/lib/download.ts'
import type { RolePermissionRecord, RolePermissionStatus } from '#/features/role-permissions/types/role-permissions.ts'

/** Quotes a CSV cell and escapes embedded double quotes. */
function escapeCsv(value: string | number | null | undefined): string {
    const text = value === null || value === undefined ? '' : String(value)
    return `"${text.replaceAll('"', '""')}"`
}

/** Converts rolePermissions into a CSV document with a header row. */
export function rolePermissionsToCsv(rolePermissions: RolePermissionRecord[]): string {
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

    const rows = rolePermissions.map((rolePermission) =>
        [
            rolePermission.id,
            rolePermission.name,
            rolePermission.company?.name ?? '',
            rolePermission.description ?? '',
            rolePermission.start_date ?? '',
            rolePermission.end_date ?? '',
            rolePermission.status,
        ]
            .map(escapeCsv)
            .join(','),
    )

    return [header, ...rows].join('\r\n')
}

/** Downloads the visible rolePermissions as a CSV file. */
export function downloadRolePermissionsCsv(rolePermissions: RolePermissionRecord[]): void {
    saveBlob(
        new Blob([rolePermissionsToCsv(rolePermissions)], { type: 'text/csv;charset=utf-8;' }),
        `role-permissions-${new Date().toISOString().slice(0, 10)}.csv`,
    )
}

/** Counts rolePermissions per status for the summary cards. */
export function countRolePermissionsByStatus(
    rolePermissions: RolePermissionRecord[],
): Record<RolePermissionStatus, number> {
    const counts: Record<RolePermissionStatus, number> = {
        draft: 0,
        active: 0,
        completed: 0,
        archived: 0,
    }

    for (const rolePermission of rolePermissions) counts[rolePermission.status] += 1
    return counts
}
