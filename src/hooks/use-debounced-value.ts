import { useEffect, useState } from "react";

/**
 * Returns `value` only after it has stopped changing for `delay` ms.
 * Used to keep search inputs and slug checks from firing on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timeout = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timeout);
	}, [value, delay]);

	return debounced;
}
