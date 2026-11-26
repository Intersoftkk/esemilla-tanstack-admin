import type {SubmitHandler} from 'react-hook-form'
import {useForm} from 'react-hook-form'
import {standardSchemaResolver} from '@hookform/resolvers/standard-schema'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {toast} from 'sonner'
import {CalendarRange, Edit, Loader, Plus} from 'lucide-react'
import type {AppraisalCycleRecord} from '@/features/appraisal-cycle/types/appraisal-cycle'
import {
    createAppraisalCycle,
    updateAppraisalCycle,
} from '@/features/appraisal-cycle/service/appraisal-cycle.service.ts'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx'
import {Button} from '@/components/ui/button.tsx'
import {InputField} from '@/components/fields/input-field.tsx'
import {SelectField} from '@/components/fields/select-field.tsx'
import {appraisalCycleStatusOptions} from '@/features/appraisal-cycle/data/data.ts'
import {
    AppraisalCycleFormData,
    appraisalCycleSchema
} from "../../schema/appraisal-cycle-form.schema.ts";
import {fetchCompanies} from "@/services/companies.service.ts";
import type {Option} from "@/types";
import {ComboboxField} from "@/components/fields/combobox-field.tsx";
import {DateField} from "@/components/fields/date-field.tsx";

interface Props {
    currentRow?: AppraisalCycleRecord | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AppraisalCycleActionDialog({
                                               currentRow,
                                               open,
                                               onOpenChange,
                                           }: Props) {

    const isEditMode = !!currentRow?.id
    const queryClient = useQueryClient()

    const form = useForm<AppraisalCycleFormData>({
        resolver: standardSchemaResolver(appraisalCycleSchema),
        defaultValues: {
            company_id: currentRow?.company_id ? String(currentRow.company_id) : '',
            name: currentRow?.name ? String(currentRow.name) : '',
            description: currentRow?.description ? String(currentRow.description) : '',
            start_date: currentRow?.start_date ? String(currentRow.start_date) : '',
            end_date: currentRow?.end_date ? String(currentRow.end_date) : '',
            status: currentRow?.status ?? 'draft',
        },
    })

    const {data: companiesRaw = [], isLoading: companiesLoading} = useQuery({
        queryKey: ["companies"],
        queryFn: () => fetchCompanies({}),
    })

    const companyOptions: Option[] = companiesRaw.map((t: any) => ({value: String(t.id), label: t.name}))

    const mutation = useMutation({
        mutationFn: async (data: AppraisalCycleFormData) => {
            return isEditMode && currentRow?.id
                ? updateAppraisalCycle(currentRow.id, data)
                : createAppraisalCycle(data)
        },
        onSuccess: () => {
            form.reset()
            onOpenChange(false)
            queryClient.invalidateQueries({ queryKey: ['appraisal-cycles'] })
            toast.success('Appraisal cycle saved successfully.')
        },
        onError: (error: any) => {
            console.error('Failed to save appraisal cycle:', error)
            const message =
                error?.response?.data?.message || 'Failed to save. Please try again.'
            toast.error(message)
        },
    })

    const onSubmit: SubmitHandler<AppraisalCycleFormData> = (data) => {
        mutation.mutate(data)
    }

    const onInvalid = (errors: any) => {
        console.log('Form Errors:', errors)
        toast.error('Please fix the highlighted fields.')
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                if (!state) {
                    form.reset()
                }
                onOpenChange(state)
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle className="flex items-center gap-2">
                        {isEditMode ? (
                            <>
                                <Edit className="h-5 w-5"/>
                                Edit Appraisal Cycle
                            </>
                        ) : (
                            <>
                                <CalendarRange className="h-5 w-5"/>
                                Add Appraisal Cycle
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        Fill out the appraisal cycle details below.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="appraisal-cycle-form"
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="grid gap-6 p-1 sm:grid-cols-2"
                >

                    <div className="sm:col-span-2">
                        <ComboboxField
                            control={form.control}
                            name="company_id"
                            label="Company"
                            options={companyOptions}
                            placeholder={companiesLoading ? "Loading..." : "Select company..."}
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <InputField
                            control={form.control}
                            name="name"
                            label="Cycle Name"
                            placeholder="e.g. Mid-Year Review 2026"
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <InputField
                            control={form.control}
                            name="description"
                            label="Description"
                            placeholder="Enter cycle description"
                        />
                    </div>

                    <DateField
                        control={form.control}
                        name="start_date"
                        label="Start Date"
                        required
                    />

                    <DateField
                        control={form.control}
                        name="end_date"
                        label="End Date"
                        required
                    />

                    <div className="sm:col-span-2">
                        <SelectField
                            name="status"
                            control={form.control}
                            label="Status"
                            options={appraisalCycleStatusOptions}
                            placeholder="Select status..."
                            required
                        />
                    </div>
                </form>

                <DialogFooter className="gap-y-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button
                        type="submit"
                        form="appraisal-cycle-form"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <>
                                Saving...
                                <Loader className="ml-2 h-4 w-4 animate-spin"/>
                            </>
                        ) : isEditMode ? (
                            <>
                                Save Changes
                                <Edit className="ml-2 h-4 w-4"/>
                            </>
                        ) : (
                            <>
                                Create Cycle
                                <Plus className="ml-2 h-4 w-4"/>
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
