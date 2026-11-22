import type {Table} from '@tanstack/react-table'
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,} from 'lucide-react'
import {Button} from '#/components/ui/button'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '#/components/ui/select'

interface DataTablePaginationProps {
    table: Table<any, any>
    isLoading?: boolean
    pageSizeOptions?: number[]
}

export function DataTablePagination({
                                        table,
                                        isLoading = false,
                                        pageSizeOptions = [10, 20, 30, 40, 50],
                                    }: DataTablePaginationProps) {

    const { pageIndex, pageSize } = table.store?.state?.pagination ?? {
        pageIndex: 0,
        pageSize: 10,
    }

    const totalRows = table.getRowCount?.() ?? 0
    const pageCount = table.getPageCount?.() ?? 1
    const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)
    const selectedRows = table.getSelectedRowModel?.()?.rows?.length ?? 0

    return (
        <div className="flex flex-col gap-3 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
            {/* Row count / selection status */}
            <div className="text-muted-foreground order-2 flex-1 text-sm sm:order-1">
                {selectedRows > 0 ? (
                    <span>
            {selectedRows} of {totalRows} row(s) selected
          </span>
                ) : (
                    <span>
            Showing {startRow} to {endRow} of {isLoading ? '...' : totalRows} row(s)
          </span>
                )}
            </div>

            {/* Pagination controls */}
            <div className="order-1 flex w-full flex-col gap-3 sm:order-2 sm:w-auto sm:flex-row sm:items-center sm:space-x-4 lg:space-x-8">
                {/* Page size dropdown */}
                <div className="flex items-center justify-between gap-2 sm:justify-start">
                    <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => table.setPageSize?.(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-18">
                            <SelectValue placeholder={`${pageSize}`} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Current page index indicator */}
                <div className="flex items-center justify-center text-sm font-medium sm:w-25">
                    Page {pageIndex + 1} of {pageCount || 1}
                </div>

                {/* Page navigation buttons */}
                <div className="flex items-center justify-center gap-1 sm:justify-end">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.firstPage?.()}
                        disabled={!table.getCanPreviousPage?.()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.previousPage?.()}
                        disabled={!table.getCanPreviousPage?.()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.nextPage?.()}
                        disabled={!table.getCanNextPage?.()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.lastPage?.()}
                        disabled={!table.getCanNextPage?.()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}