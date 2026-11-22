import type {QueryParams} from '@/types'

export function buildQueryParams(params: QueryParams): string {
    const searchParams = new URLSearchParams()

    // Filters
    if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (
                value === undefined ||
                value === null ||
                value === '' ||
                key === 'pageIndex' ||
                key === 'pageSize' ||
                key === 'sort'
            )
                return

            if (Array.isArray(value)) {
                if (value.length > 0) {
                    searchParams.append(`filter[${key}]`, value.join(','))
                }
            } else {
                searchParams.append(`filter[${key}]`, String(value))
            }
        })
    }

    // Sorting (Spatie style): sort=field,-field2
    if (params.sorting && params.sorting.length > 0) {
        const sort = params.sorting
            .map(({ id, desc }) => (desc ? `-${id}` : id))
            .join(",")
        searchParams.set("sort", sort) // set (not append) so it doesn't duplicate
    }

    // Includes (relationships)
    if (params.includes) {
        searchParams.append('include', params.includes.join(','))
    }

    // Selecting fields
    if (params.fields) {
        Object.entries(params.fields).forEach(([resource, fields]) => {
            if (fields.length > 0) {
                searchParams.append(`fields[${resource}]`, fields.join(','))
            }
        })
    }

    // Pagination
    if (params.pagination) {
        const page = params.pagination.pageIndex + 1
        searchParams.append('page', page.toString())
        searchParams.append(
            'per_page',
            params.pagination.pageSize.toString()
        )
    }

    return searchParams.toString()
}
