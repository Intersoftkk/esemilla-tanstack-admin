import {Skeleton} from '#/components/ui/skeleton'

export function DataTablePaginationSkeleton() {
    return (
        <div
            className="flex items-center justify-between overflow-clip px-2"
            style={{overflowClipMargin: 1}}
        >
            <div className="hidden flex-1 sm:block">
                <Skeleton className="h-4 w-32"/>
            </div>
            <div className="flex items-center sm:space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-24"/>
                    <Skeleton className="h-8 w-17.5 rounded-md"/>
                </div>
                <Skeleton className="h-4 w-28"/>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md"/>
                    <Skeleton className="h-8 w-8 rounded-md"/>
                    <Skeleton className="h-8 w-8 rounded-md"/>
                    <Skeleton className="h-8 w-8 rounded-md"/>
                </div>
            </div>
        </div>
    )
}
