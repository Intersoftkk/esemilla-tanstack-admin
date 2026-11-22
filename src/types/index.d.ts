import type {SortingState} from '@tanstack/react-table'
import * as React from "react";

export type PaginationParams = { pageIndex: number; pageSize: number }
export type SortParams = { sort: `${string}.${'asc' | 'desc'}` }
export type Filters<T> = Partial<T & PaginationParams & SortParams>

interface ApiResponse<T> {
    message: string
    data: T
}

interface ApiError {
    message: string
    errors?: Record<string, string[]>
}

export interface QueryParams {
    sorting?: SortingState
    filters?: Filters<any>
    includes?: Array<string>
    fields?: { [resource: string]: Array<string> }
    pagination?: PaginationParams
}

export interface PaginationLink {
    url: string | null
    label: string
    active: boolean
}

export type PaginatedResponse<T, TMeta = {}> = {
    current_page: number
    from: number
    last_page: number
    links: Array<PaginationLink>
    path: string
    per_page: number
    to: number
    total: number
    data: Array<T>
} & TMeta

export interface QueryKeys {
    page: string;
    perPage: string;
    sort: string;
    filters: string;
    joinOperator: string;
}

export interface Option {
    id?: string | number
    name?: string
    value?: string | number
    label?: string
    disabled?: boolean
    icon?: React.ComponentType<{ className?: string }>
}
