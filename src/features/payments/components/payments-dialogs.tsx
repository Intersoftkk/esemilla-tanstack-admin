// #/features/payments/components/payments-dialogs.tsx
import { PaymentsActionDialog } from "#/features/payments/components/dialogs/payments-action-dialog.tsx";
import { PaymentsDeleteDialog } from "#/features/payments/components/dialogs/payments-delete-dialog.tsx";
import { PaymentsViewDialog } from "#/features/payments/components/dialogs/payments-view-dialog.tsx";
import { usePayments } from "#/features/payments/context/payments-context.tsx";

/** Renders all dialogs controlled by the payments context. */
export function PaymentsDialogs() {
	const { open, setOpen, currentRow, setCurrentRow } = usePayments();

	const clearRow = () => {
		setTimeout(() => setCurrentRow(null), 500);
	};

	return (
		<>
			<PaymentsActionDialog
				key="payments-add"
				open={open === "add"}
				onOpenChange={() => setOpen("add")}
			/>

			{currentRow && (
				<>
					<PaymentsActionDialog
						key={`payments-edit-${currentRow.id}`}
						open={open === "edit"}
						onOpenChange={() => {
							setOpen("edit");
							clearRow();
						}}
						currentRow={currentRow}
					/>

					<PaymentsViewDialog
						key={`payments-view-${currentRow.id}`}
						open={open === "view"}
						onOpenChange={() => {
							setOpen("view");
							clearRow();
						}}
						currentRow={currentRow}
					/>

					<PaymentsDeleteDialog
						key={`payments-delete-${currentRow.id}`}
						open={open === "delete"}
						onOpenChange={() => {
							setOpen("delete");
							clearRow();
						}}
						currentRow={currentRow}
					/>
				</>
			)}
		</>
	);
}
