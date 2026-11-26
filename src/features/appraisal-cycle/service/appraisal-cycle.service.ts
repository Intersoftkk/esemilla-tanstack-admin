import type {PaginatedResponse, QueryParams} from '@/types'
import type {AppraisalCycleRecord} from '@/features/appraisal-cycle/types/appraisal-cycle'
import api from '@/lib/axios.ts'
import {buildQueryParams} from '@/lib/query-params-builder.ts'
import {AppraisalCycleFormData} from "@/features/appraisal-cycle/schema/appraisal-cycle-form.schema.ts";

export async function fetchPaginatedAppraisalCycles(
    params: QueryParams,
): Promise<PaginatedResponse<AppraisalCycleRecord>> {
    const queryString = buildQueryParams(params)
    const {data} = await api.get(`/performance-cycle?${queryString.toString()}`)

    return data
}

export async function fetchAppraisalCycles(
    params: QueryParams,
): Promise<AppraisalCycleRecord[]> {
    const queryString = buildQueryParams(params)
    const {data} = await api.get(`performance-cycle?${queryString.toString()}`)

    return data
}

export async function getAppraisalCycle(
    id: number | string,
): Promise<AppraisalCycleRecord> {
    const {data} = await api.get<AppraisalCycleRecord>(`/performance-cycle/${id}`)

    return data
}

export async function createAppraisalCycle(
    data: AppraisalCycleFormData,
): Promise<AppraisalCycleRecord> {
    const {data: created} = await api.post<AppraisalCycleRecord>('/performance-cycle', data,)

    return created
}

export async function updateAppraisalCycle(
    id: number | string,
    data: AppraisalCycleFormData,
): Promise<AppraisalCycleRecord> {

    const {data: updated} = await api.put<AppraisalCycleRecord>(`/performance-cycle/${id}`, data,)

    return updated
}


export async function deleteAppraisalCycle(id: number): Promise<void> {
    await api.delete(`/performance-cycle/${id}`)
}
