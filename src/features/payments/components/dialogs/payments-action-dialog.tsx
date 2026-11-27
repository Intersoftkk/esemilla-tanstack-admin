// #/features/payments/components/dialogs/payments-action-dialog.tsx
import { CalendarRange, Edit, Loader, Plus } from 'lucide-react'
import { Controller, useForm, type Control, type SubmitHandler } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { Button } from '#/components/ui/button.tsx'
import { Field, FieldError, FieldLabel } from '#/components/ui/field.tsx'
import { Textarea } from '#/components/ui/textarea.tsx'
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
import { paymentStatusOptions } from '#/features/payments/data/payment.constant'
import { paymentSchema, type PaymentFormData } from '#/features/payments/schema/payments-form.schema.ts'
import {
    useCompaniesQuery,
    useCreatePaymentMutation,
    useUpdatePaymentMutation,
} from '#/features/payments/queries/payment.queries.ts'
import type { PaymentRecord } from '#/features/payments/types/payments.type.ts'
import type { Option } from '#/types'

interface Props {
    currentRow?: PaymentRecord | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Converts an API date string into the value expected by DateField. */
function toDateInput(value?: string | null): string {
    return value ? value.slice(0, 10) : ''
}

/** Dialog for creating or editing a payment. */
export function PaymentsActionDialog({ currentRow, open, onOpenChange }: Props) {
    const isEditMode = Boolean(currentRow?.id)

    const form = useForm<PaymentFormData>({
        resolver: standardSchemaResolver(paymentSchema),
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
    } = useCompaniesQuery()

    const companyOptions: Option[] = companies.map((company) => ({
        value: String(company.id),
        label: company.name ?? `Company ${company.id}`,
    }))

    const closeDialog = () => {
        form.reset()
        onOpenChange(false)
    }

    const createMutation = useCreatePaymentMutation({ onSuccess: closeDialog })
    const updateMutation = useUpdatePaymentMutation({ onSuccess: closeDialog })
    const mutation = isEditMode ? updateMutation : createMutation

    const onSubmit: SubmitHandler<PaymentFormData> = (data) => {
        if (isEditMode && currentRow?.id) {
            updateMutation.mutate({ id: currentRow.id, payload: data })
            return
        }
        createMutation.mutate(data)
    }

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
                                Edit Payment
                            </>
                        ) : (
                            <>
                                <CalendarRange className="h-5 w-5" />
                                Add Payment
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        Fill out the payment details below.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="payments-form"
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
                            label="Payment Name"
                            placeholder="e.g. Mid-Year Review 2026"
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <Controller
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid ? 'true' : undefined
                                    }
                                >
                                    <FieldLabel>Description</FieldLabel>
                                    <Textarea
                                        {...field}
                                        rows={3}
                                        value={field.value ?? ''}
                                        placeholder="Enter payment description"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.error && (
                                        <FieldError>
                                            {fieldState.error.message}
                                        </FieldError>
                                    )}
                                </Field>
                            )}
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
                                    options={paymentStatusOptions}
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
                        form="payments-form"
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
                                Create Payment
                                <Plus className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
