import { useState } from "react";

type DialogState<T> = T | null | T[];

type UseDialogStateArrayReturn<T> = readonly [
	T[],
	(type: T | null) => void,
	(type: T) => void,
	(type: T) => void,
	(type: T) => boolean,
];

type UseDialogStateSingleReturn<T> = readonly [
	T | null,
	(type: T | null) => void,
	(type: T) => void,
	(type: T) => void,
	(type: T) => boolean,
];

function useDialogState<T>(initial: T[]): UseDialogStateArrayReturn<T>;
function useDialogState<T>(initial?: T | null): UseDialogStateSingleReturn<T>;
function useDialogState<T>(initial: DialogState<T> = null) {
	const [open, _setOpen] = useState<DialogState<T>>(initial);

	const openDialog = (type: T) => {
		_setOpen((prev) =>
			Array.isArray(prev)
				? prev.includes(type)
					? prev
					: [...prev, type]
				: prev,
		);
	};

	const closeDialog = (type: T) => {
		_setOpen((prev) =>
			Array.isArray(prev) ? prev.filter((t) => t !== type) : prev,
		);
	};

	const isOpen = (type: T): boolean =>
		Array.isArray(open) ? open.includes(type) : open === type;

	const setOpen = (type: T | null) =>
		_setOpen((prev) => (prev === type ? null : type));

	return [open, setOpen, openDialog, closeDialog, isOpen] as const;
}

export default useDialogState;
