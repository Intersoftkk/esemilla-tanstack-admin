import { Check, Plus } from "lucide-react";
import type * as React from "react";
import { Badge } from "#/components/ui/badge";
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
import { Separator } from "#/components/ui/separator";
import { cn } from "#/lib/utils";
import type { Option } from "#/types";

interface DataTableFacetedFilterProps {
	title?: string;
	icon?: React.ComponentType<{ className?: string }>;
	options: Array<Option>;
	selectedValues: Array<string>;
	onChange: (values: Array<string>) => void;
}

export function DataTableFacetedFilter({
	title,
	icon = Plus,
	options,
	selectedValues,
	onChange,
}: DataTableFacetedFilterProps) {
	const selectedSet = new Set(selectedValues);

	const handleSelect = (value: string) => {
		const newSet = new Set(selectedSet);
		if (newSet.has(value)) {
			newSet.delete(value);
		} else {
			newSet.add(value);
		}
		onChange(Array.from(newSet));
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" className="border-dashed">
					{icon &&
						(() => {
							const IconComponent = icon;
							return (
								<IconComponent className="text-muted-foreground w-4 mr-1" />
							);
						})()}
					{title}
					{selectedSet.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{selectedSet.size}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedSet.size > 10 ? (
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal"
									>
										{selectedSet.size} selected
									</Badge>
								) : (
									options
										.filter((option) => selectedSet.has(String(option.value)))
										.map((option) => (
											<Badge
												variant="secondary"
												key={option.value}
												className="rounded-sm px-1 font-normal"
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-50 p-0" align="start">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const stringValue = String(option.value);
								const isSelected = selectedSet.has(stringValue);
								return (
									<CommandItem
										key={option.value}
										onSelect={() => handleSelect(stringValue)}
									>
										<div
											className={cn(
												"border-primary flex h-4 w-4 items-center justify-center rounded-sm border",
												isSelected
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<Check className="h-4 w-4" />
										</div>
										{option.icon && (
											<option.icon className="text-muted-foreground h-4 w-4" />
										)}
										<span>{option.label}</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
					{selectedSet.size > 0 && (
						<>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem
									onSelect={() => onChange([])}
									className="justify-center text-center"
								>
									Clear filters
								</CommandItem>
							</CommandGroup>
						</>
					)}
				</Command>
			</PopoverContent>
		</Popover>
	);
}
