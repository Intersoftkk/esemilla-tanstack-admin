// #/features/support/components/dialogs/support-action-dialog.tsx

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Edit, Loader, Plus, Ticket } from "lucide-react";
import {
	type Control,
	Controller,
	type SubmitHandler,
	useForm,
} from "react-hook-form";
import { ComboboxField } from "#/components/fields/combobox-field.tsx";
import { DateField } from "#/components/fields/date-field.tsx";
import { InputField } from "#/components/fields/input-field.tsx";
import { SelectField } from "#/components/fields/select-field.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog.tsx";
import { Field, FieldError, FieldLabel } from "#/components/ui/field.tsx";
import { Textarea } from "#/components/ui/textarea.tsx";
import {
	supportPriorityOptions,
	supportStatusOptions,
} from "#/features/support/data/support.constant";
import {
	useCompaniesQuery,
	useCreateSupportMutation,
	useUpdateSupportMutation,
} from "#/features/support/queries/support.queries.ts";
import {
	type SupportFormData,
	supportSchema,
} from "#/features/support/schema/support-form.schema.ts";
import type { SupportRecord } from "#/features/support/types/support.type.ts";
import type { Option } from "#/types";

interface Props {
	currentRow?: SupportRecord | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/** Converts an API date string into the value expected by DateField. */
function toDateInput(value?: string | null): string {
	return value ? value.slice(0, 10) : "";
}

/** Dialog for raising or editing a support ticket. */
export function SupportActionDialog({ currentRow, open, onOpenChange }: Props) {
	const isEditMode = Boolean(currentRow?.id);

	const form = useForm<SupportFormData>({
		resolver: standardSchemaResolver(supportSchema),
		defaultValues: {
			company_id: currentRow?.company_id ? String(currentRow.company_id) : "",
			subject: currentRow?.subject ?? "",
			description: currentRow?.description ?? "",
			priority: currentRow?.priority ?? "normal",
			status: currentRow?.status ?? "open",
			opened_at: toDateInput(currentRow?.opened_at ?? new Date().toISOString()),
			closed_at: toDateInput(currentRow?.closed_at),
		},
	});

	const {
		data: companies = [],
		isLoading: companiesLoading,
		isError: companiesError,
	} = useCompaniesQuery();

	const companyOptions: Option[] = companies.map((company) => ({
		value: String(company.id),
		label: company.name ?? `Company ${company.id}`,
	}));

	const closeDialog = () => {
		form.reset();
		onOpenChange(false);
	};

	const createMutation = useCreateSupportMutation({ onSuccess: closeDialog });
	const updateMutation = useUpdateSupportMutation({ onSuccess: closeDialog });
	const mutation = isEditMode ? updateMutation : createMutation;

	const onSubmit: SubmitHandler<SupportFormData> = (data) => {
		if (isEditMode && currentRow?.id) {
			updateMutation.mutate({ id: currentRow.id, payload: data });
			return;
		}
		createMutation.mutate(data);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(state) => {
				if (!state) form.reset();
				onOpenChange(state);
			}}
		>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader className="text-left">
					<DialogTitle className="flex items-center gap-2">
						{isEditMode ? (
							<>
								<Edit className="h-5 w-5" />
								Edit Ticket
							</>
						) : (
							<>
								<Ticket className="h-5 w-5" />
								New Ticket
							</>
						)}
					</DialogTitle>
					<DialogDescription>
						Fill out the ticket details below.
					</DialogDescription>
				</DialogHeader>

				<form
					id="support-form"
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
									? "Loading..."
									: companiesError
										? "Could not load companies"
										: "Select company..."
							}
							required
						/>
					</div>

					<div className="sm:col-span-2">
						<InputField
							control={form.control}
							name="subject"
							label="Subject"
							placeholder="e.g. Cannot export invoices"
							required
						/>
					</div>

					<div className="sm:col-span-2">
						<Controller
							control={form.control}
							name="description"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid ? "true" : undefined}>
									<FieldLabel>Description</FieldLabel>
									<Textarea
										{...field}
										rows={3}
										value={field.value ?? ""}
										placeholder="Describe the issue..."
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>
					</div>

					<Controller
						control={form.control}
						name="priority"
						render={({ field, fieldState }) => (
							<SelectField
								name="priority"
								label="Priority"
								options={supportPriorityOptions}
								value={field.value ?? ""}
								onChange={field.onChange}
								errors={fieldState.error ? [fieldState.error] : undefined}
								required
							/>
						)}
					/>

					<Controller
						control={form.control}
						name="status"
						render={({ field, fieldState }) => (
							<SelectField
								name="status"
								label="Status"
								options={supportStatusOptions}
								value={field.value ?? ""}
								onChange={field.onChange}
								errors={fieldState.error ? [fieldState.error] : undefined}
								required
							/>
						)}
					/>

					<DateField
						control={form.control as unknown as Control<any>}
						name="opened_at"
						label="Opened"
						required
					/>

					<DateField
						control={form.control as unknown as Control<any>}
						name="closed_at"
						label="Closed"
						description="Leave empty while the ticket is still open."
					/>
				</form>

				<DialogFooter className="gap-y-2">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>

					<Button
						type="submit"
						form="support-form"
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
								Create Ticket
								<Plus className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
