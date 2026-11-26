// #/features/plans/components/dialogs/plans-action-dialog.tsx
import { CalendarRange, Edit, Loader, Plus } from 'lucide-react'
import { Controller, useForm, type Control, type SubmitHandler } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button.tsx'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '#/components/ui/dialog.tsx'
import { ComboboxField } from '#/components/fields/combobox-field.tsx'
import { DateField } from '#/components/fields/date-field.tsx'
import { InputField } from '#/components/fields/input-field.tsx'
import { SelectField } from '#/components/fields/select-field.tsx'
import { PLAN_KEYS } from '#/features/plans/queries/plan.keys.ts'
import { planStatusOptions } from '#/features/plans/data/data.ts'
import { planSchema, type PlanFormData } from '#/features/plans/schema/plans-form.schema.ts'
import {
    createPlan,
    fetchCompanies,
    updatePlan,
} from '#/features/plans/service/plans.service.ts'
import type { PlanRecord } from '#/features/plans/types/plans.ts'
import type { Option } from '#/types'

interface Props {
    currentRow?: PlanRecord | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Converts an API date string into the value expected by DateField. */
function toDateInput(value?: string | null): string {
    return value ? value.slice(0, 10) : ''
}

/** Dialog for creating or editing a plan. */
export function PlansActionDialog({ currentRow, open, onOpenChange }: Props) {
    const isEditMode = Boolean(currentRow?.id)
    const queryClient = useQueryClient()

    const form = useForm<PlanFormData>({
        resolver: standardSchemaResolver(planSchema),
        defaultValues: {
            company_id: currentRow?.company_id ? String(currentRow.company_id) : '',
            name: currentRow?.name ?? '',
            description: currentRow?.description ?? '',
            start_date: toDateInput(currentRow?.start_date),
            end_date: toDateInput(currentRow?.end_date),
            status: currentRow?.status ?? 'draft',
        },
    })

    const {
        data: companies = [],
        isLoading: companiesLoading,
        isError: companiesError,
    } = useQuery({
        queryKey: PLAN_KEYS.companies(),
        queryFn: fetchCompanies,
    })

    const companyOptions: Option[] = companies.map((company) => ({
        value: String(company.id),
        label: company.name ?? `Company ${company.id}`,
    }))

    const mutation = useMutation({
        mutationFn: (data: PlanFormData) =>
            isEditMode && currentRow?.id
                ? updatePlan(currentRow.id, data)
                : createPlan(data),
        onSuccess: () => {
            form.reset()
            void queryClient.invalidateQueries({ queryKey: PLAN_KEYS.all })
            toast.success('Plan saved successfully.')
            onOpenChange(false)
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save. Please try again.')
        },
    })

    const onSubmit: SubmitHandler<PlanFormData> = (data) => mutation.mutate(data)

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                if (!state) form.reset()
                onOpenChange(state)
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle className="flex items-center gap-2">
                        {isEditMode ? (
                            <>
                                <Edit className="h-5 w-5" />
                                Edit Plan
                            </>
                        ) : (
                            <>
                                <CalendarRange className="h-5 w-5" />
                                Add Plan
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        Fill out the plan details below.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="plans-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-6 p-1 sm:grid-cols-2"
                >
                    <div className="sm:col-span-2">
                        <ComboboxField
                            control={form.control as unknown as Control<any>}
                            name="company_id"
                            label="Company"
                            options={companyOptions}
                            placeholder={
                                companiesLoading
                                    ? 'Loading...'
                                    : companiesError
                                      ? 'Could not load companies'
                                      : 'Select company...'
                            }
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <InputField
                            control={form.control}
                            name="name"
                            label="Plan Name"
                            placeholder="e.g. Mid-Year Review 2026"
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <InputField
                            control={form.control}
                            name="description"
                            label="Description"
                            placeholder="Enter plan description"
                        />
                    </div>

                    <DateField
                        control={form.control as unknown as Control<any>}
                        name="start_date"
                        label="Start Date"
                        required
                    />

                    <DateField
                        control={form.control as unknown as Control<any>}
                        name="end_date"
                        label="End Date"
                        required
                    />

                    <div className="sm:col-span-2">
                        <Controller
                            control={form.control}
                            name="status"
                            render={({ field, fieldState }) => (
                                <SelectField
                                    name="status"
                                    label="Status"
                                    options={planStatusOptions}
                                    value={field.value ?? ''}
                                    onChange={field.onChange}
                                    errors={fieldState.error ? [fieldState.error] : undefined}
                                    required
                                />
                            )}
                        />
                    </div>
                </form>

                <DialogFooter className="gap-y-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button
                        type="submit"
                        form="plans-form"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <>
                                Saving...
                                <Loader className="ml-2 h-4 w-4 animate-spin" />
                            </>
                        ) : isEditMode ? (
                            <>
                                Save Changes
                                <Edit className="ml-2 h-4 w-4" />
                            </>
                        ) : (
                            <>
                                Create Plan
                                <Plus className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
