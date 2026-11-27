"use client";

import { Search, X } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

/**
 * Controlled search input with a leading icon and a clear button.
 * The parent owns the value (and any debouncing).
 */
export function SearchField({
	value,
	onChange,
	label,
	placeholder = "Search...",
	disabled = false,
	className,
}: SearchFieldProps) {
	return (
		<Field className={cn("w-full", className)}>
			{label && <FieldLabel>{label}</FieldLabel>}

			<div className="group relative flex items-center">
				<div className="pointer-events-none absolute left-3 text-muted-foreground transition-colors group-focus-within:text-foreground">
					<Search className="size-4" strokeWidth={2} />
				</div>

				<Input
					type="search"
					role="searchbox"
					value={value}
					placeholder={placeholder}
					disabled={disabled}
					onChange={(event) => onChange(event.target.value)}
					className="pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
				/>

				{value && !disabled && (
					<button
						type="button"
						aria-label="Clear search"
						onClick={() => onChange("")}
						className="absolute right-2.5 rounded-md p-0.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
					>
						<X className="size-4" />
					</button>
				)}
			</div>
		</Field>
	);
}
