// #/features/users/components/users-dialogs.tsx
import { UsersActionDialog } from "#/features/users/components/dialogs/users-action-dialog.tsx";
import { UsersDeleteDialog } from "#/features/users/components/dialogs/users-delete-dialog.tsx";
import { UsersViewDialog } from "#/features/users/components/dialogs/users-view-dialog.tsx";
import { useUsers } from "#/features/users/context/users-context.tsx";

/** Renders all dialogs controlled by the users context. */
export function UsersDialogs() {
	const { open, setOpen, currentRow, setCurrentRow } = useUsers();

	const clearRow = () => {
		setTimeout(() => setCurrentRow(null), 500);
	};

	return (
		<>
			<UsersActionDialog
				key="users-add"
				open={open === "add"}
				onOpenChange={() => setOpen("add")}
			/>

			{currentRow && (
				<>
					<UsersActionDialog
						key={`users-edit-${currentRow.id}`}
						open={open === "edit"}
						onOpenChange={() => {
							setOpen("edit");
							clearRow();
						}}
						currentRow={currentRow}
					/>

					<UsersViewDialog
						key={`users-view-${currentRow.id}`}
						open={open === "view"}
						onOpenChange={() => {
							setOpen("view");
							clearRow();
						}}
						currentRow={currentRow}
					/>

					<UsersDeleteDialog
						key={`users-delete-${currentRow.id}`}
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
