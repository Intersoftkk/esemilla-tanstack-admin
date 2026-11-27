import type React from "react";
import { DatePicker } from "#/components/ui/date-picker";
import { cn } from "#/lib/utils";

interface DataTableDatePickerFilterProps {
	placeholder?: string;
	value?: any; // use Date | string | undefined
	onChange: (value: any) => void;
	isLoading?: boolean;
	disabled?: boolean;
	className?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export const DataTableDatePickerFilter = ({
	placeholder = "Pick a date",
	value,
	onChange,
	isLoading = false,
	disabled = false,
	className,
	icon: Icon,
}: DataTableDatePickerFilterProps) => {
	return (
		<div className={cn("flex items-center gap-2", className)}>
			{Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}

			<DatePicker
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				disabled={disabled || isLoading}
			/>
		</div>
	);
};
