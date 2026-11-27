"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "#/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";
import type { Option } from "#/types";

interface SearchableSelectProps {
	placeholder?: string;
	options: Option[];
	value?: string | number;
	onChange: (val?: string | number) => void;
	className?: string;
}

export function DataTableSearchableSelectFilter({
	placeholder = "Select option",
	options,
	value,
	onChange,
	className,
}: SearchableSelectProps) {
	const selected = options.find((opt) => String(opt.value) === String(value));

	// Safe calculation of dynamic width
	const longestLabel = options.reduce((max, opt) => {
		const label = opt.label || "";
		return label.length > max.length ? label : max;
	}, placeholder);

	const calculatedWidth = Math.min(
		Math.max(longestLabel.length * 8 + 60, 160), // 8px per char + padding
		420,
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					className={cn(
						"justify-between px-3 text-sm",
						!selected && "text-muted-foreground",
						className,
					)}
					style={{ width: calculatedWidth }}
				>
					{selected ? selected.label : placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				className="p-0 w-[--radix-popover-trigger-width] max-h-[300px] overflow-y-auto"
				align="start"
			>
				<Command>
					<CommandInput
						placeholder="Search..."
						className="h-9 border-b px-3 text-sm"
					/>
					<CommandList className="max-h-[200px] overflow-y-auto">
						<CommandEmpty className="py-2 text-center text-sm text-muted-foreground">
							No results found.
						</CommandEmpty>
						<CommandGroup>
							{options.map((opt) => {
								if (opt.value === undefined) return null;

								return (
									<CommandItem
										key={opt.value}
										value={opt.label || ""}
										onSelect={() => onChange(opt.value)}
										className="flex items-center px-3 py-1.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4 text-primary",
												String(value) === String(opt.value)
													? "opacity-100"
													: "opacity-0",
											)}
										/>
										<span className="truncate">{opt.label}</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>

					{value !== undefined && value !== null && (
						<>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem
									onSelect={() => onChange(undefined)}
									className="justify-center text-center text-sm text-destructive"
								>
									Clear selection
								</CommandItem>
							</CommandGroup>
						</>
					)}
				</Command>
			</PopoverContent>
		</Popover>
	);
}
