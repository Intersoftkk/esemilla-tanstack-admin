// #/features/notifications/context/notifications-context.tsx
import React, { useState } from "react";
import type { NotificationRecord } from "#/features/notifications/types/notifications.type.ts";
import useDialogState from "#/hooks/use-dialog-state";

type NotificationsDialogType = "add" | "view" | "edit" | "delete";

interface NotificationsContextType {
	open: NotificationsDialogType | null;
	setOpen: (type: NotificationsDialogType | null) => void;
	currentRow: NotificationRecord | null;
	setCurrentRow: React.Dispatch<
		React.SetStateAction<NotificationRecord | null>
	>;
}

const NotificationsContext =
	React.createContext<NotificationsContextType | null>(null);

interface Props {
	children: React.ReactNode;
}

/** Provides the dialog state shared by the notifications page components. */
export default function NotificationsProvider({ children }: Props) {
	const [open, setOpen] = useDialogState<NotificationsDialogType>(null);
	const [currentRow, setCurrentRow] = useState<NotificationRecord | null>(null);

	return (
		<NotificationsContext.Provider
			value={{ open, setOpen, currentRow, setCurrentRow }}
		>
			{children}
		</NotificationsContext.Provider>
	);
}

/** Accesses the notifications dialog context. */
export const useNotifications = () => {
	const context = React.useContext(NotificationsContext);
	if (!context) {
		throw new Error(
			"useNotifications must be used within a NotificationsProvider",
		);
	}
	return context;
};
