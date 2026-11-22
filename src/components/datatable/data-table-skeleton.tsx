import type {Column} from '@tanstack/react-table'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '#/components/ui/table'
import {Skeleton} from '#/components/ui/skeleton'

interface SkeletonProps {
    columns: Array<Column<any,any>>
    rowCount?: number
}

export default function DataTableSkeleton({
                                              columns,
                                              rowCount = 10,
                                          }: SkeletonProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.id}>
                                <Skeleton className="h-4 w-24"/>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({length: rowCount}).map((_, rowIdx) => (
                        <TableRow key={rowIdx}>
                            {columns.map((col) => (
                                <TableCell key={col.id}>
                                    <Skeleton className="h-4 w-full"/>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
