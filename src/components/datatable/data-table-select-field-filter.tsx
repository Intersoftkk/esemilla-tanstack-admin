import type React from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { cn } from "#/lib/utils";
import type { Option } from "#/types";

interface SelectFieldFilterProps {
	options: Array<Option>;
	placeholder?: string;
	selectedValues: string;
	onChange: (value: string) => void;
	isLoading?: boolean;
	disabled?: boolean;
	className?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

export const DataTableSelectFieldFilter = ({
	options,
	placeholder = "Select...",
	selectedValues,
	onChange,
	isLoading = false,
	disabled = false,
	className,
	icon: Icon,
}: SelectFieldFilterProps) => {
	return (
		<Select
			onValueChange={onChange}
			value={selectedValues}
			disabled={disabled || isLoading}
		>
			<SelectTrigger className={cn(className)}>
				{Icon && <Icon className="text-muted-foreground h-4 w-4" />}
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{options.map((opt) => {
						const optValue = opt.id ?? opt.value ?? "";
						const optLabel = opt.name ?? opt.label ?? optValue;
						return (
							<SelectItem key={optValue} value={String(optValue)}>
								{optLabel}
							</SelectItem>
						);
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
