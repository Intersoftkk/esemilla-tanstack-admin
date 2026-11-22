export interface QueryBuilderInput {
  page?: number
  perPage?: number
  sort?: string | string[]
  filters?: Record<
    string,
    string | number | boolean | (string | number | boolean)[] | undefined
  >
  include?: string[]
  fields?: Record<string, string[]>
}

/**
 * Builds a URL query string compatible with backend query builders (e.g., Spatie QueryBuilder).
 * Automatically removes empty, null, or undefined values.
 */
export function buildQueryString(params: QueryBuilderInput): string {
  const searchParams = new URLSearchParams()

  // 1. Pagination
  if (params.page && params.page > 0) {
    searchParams.set('page', String(params.page))
  }

  if (params.perPage && params.perPage > 0) {
    searchParams.set('perPage', String(params.perPage))
  }

  // 2. Sorting
  if (params.sort) {
    const sortValue = Array.isArray(params.sort)
      ? params.sort.filter(Boolean).join(',')
      : params.sort.trim()

    if (sortValue) {
      searchParams.set('sort', sortValue)
    }
  }

  // 3. Includes / Relations
  if (params.include?.length) {
    const includes = params.include.filter(Boolean).join(',')
    if (includes) {
      searchParams.set('include', includes)
    }
  }

  // 4. Sparse Fieldsets
  if (params.fields) {
    Object.entries(params.fields).forEach(([key, fields]) => {
      if (fields.length) {
        searchParams.set(`fields[${key}]`, fields.filter(Boolean).join(','))
      }
    })
  }

  // 5. Dynamic Filters
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        return
      }

      if (Array.isArray(value)) {
        const cleanValues = value.map((v) => String(v).trim()).filter(Boolean)

        if (cleanValues.length > 0) {
          searchParams.set(`filter[${key}]`, cleanValues.join(','))
        }
      } else {
        const cleanVal = String(value).trim()
        if (cleanVal) {
          searchParams.set(`filter[${key}]`, cleanVal)
        }
      }
    })
  }

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}
