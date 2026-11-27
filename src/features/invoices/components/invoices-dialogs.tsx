// #/features/invoices/components/invoices-dialogs.tsx

import { FeaturesManagerDialog } from "#/features/invoices/components/dialogs/features-manager-dialog.tsx";
import { InvoicesActionDialog } from "#/features/invoices/components/dialogs/invoices-action-dialog.tsx";
import { InvoicesDeleteDialog } from "#/features/invoices/components/dialogs/invoices-delete-dialog.tsx";
import { InvoicesFeaturesDialog } from "#/features/invoices/components/dialogs/invoices-features-dialog.tsx";
import { InvoicesViewDialog } from "#/features/invoices/components/dialogs/invoices-view-dialog.tsx";
import { useInvoices } from "#/features/invoices/context/invoices-context.tsx";

/** Renders all dialogs controlled by the invoices context. */
export function InvoicesDialogs() {
	const { open, setOpen, currentRow, setCurrentRow } = useInvoices();

	const clearRow = () => {
		setTimeout(() => setCurrentRow(null), 500);
	};

	return (
		<>
			<FeaturesManagerDialog
				open={open === "feature-manager"}
				onOpenChange={() => setOpen("feature-manager")}
			/>

			<InvoicesActionDialog
				key="invoices-add"
				open={open === "add"}
				onOpenChange={() => setOpen("add")}
			/>

			{currentRow && (
				<>
					<InvoicesActionDialog
						key={`invoices-edit-${currentRow.id}`}
						open={open === "edit"}
						onOpenChange={() => {
							setOpen("edit");
							clearRow();
						}}
						currentRow={currentRow}
					/>

					<InvoicesViewDialog
						key={`invoices-view-${currentRow.id}`}
						open={open === "view"}
						onOpenChange={() => {
							setOpen("view");
							clearRow();
						}}
						currentRow={currentRow}
					/>

					<InvoicesDeleteDialog
						key={`invoices-delete-${currentRow.id}`}
						open={open === "delete"}
						onOpenChange={() => {
							setOpen("delete");
							clearRow();
						}}
						currentRow={currentRow}
					/>

					<InvoicesFeaturesDialog
						key={`invoices-features-${currentRow.id}`}
						open={open === "features"}
						onOpenChange={() => {
							setOpen("features");
							clearRow();
						}}
						currentRow={currentRow}
					/>
				</>
			)}
		</>
	);
}
