"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Option } from "@/types";

interface ComboboxFieldProps {
	name: string;
	label: string;
	description?: string;
	options: Array<Option>;
	placeholder?: string;
	control: Control<any>;
	required?: boolean;
	disabled?: boolean;
	isLoading?: boolean;
	onChange?: (value: string) => void;
	getOptionDisabled?: (option: Option) => boolean;
}

export function ComboboxField({
	name,
	label,
	description,
	options,
	placeholder = "Select an option...",
	control,
	required = false,
	disabled = false,
	isLoading = false,
	onChange,
	getOptionDisabled,
}: ComboboxFieldProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const selectedOption = options.find((opt) => opt.value === field.value);
				const displayValue = selectedOption?.label || placeholder;
				const hasValue = !!field.value;

				const clearValue = () => {
					field.onChange("");
					onChange?.("");
					setOpen(false);
				};

				return (
					<Field data-invalid={fieldState.invalid ? "true" : undefined}>
						<FieldLabel>
							{label}
							{required && <span className="text-destructive ml-1">*</span>}
						</FieldLabel>
						{description && <FieldDescription>{description}</FieldDescription>}

						<Popover open={open} onOpenChange={setOpen} modal={true}>
							<PopoverTrigger asChild>
								<Button
									type="button"
									variant="outline"
									role="combobox"
									aria-expanded={open}
									disabled={disabled || isLoading}
									className="w-full justify-between"
								>
									<span className="truncate text-left">
										{isLoading ? "Loading options..." : displayValue}
									</span>
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>

							<PopoverContent
								className="p-0 w-(--radix-popover-trigger-width)"
								align="start"
							>
								<Command>
									<CommandInput
										placeholder={`Search ${label.toLowerCase()}...`}
										disabled={disabled || isLoading}
									/>

									<CommandList className="max-h-55 overflow-y-auto scrollbar-thin">
										<CommandEmpty>No results found.</CommandEmpty>
										<CommandGroup>
											{options.map((option) => {
												const isOptionDisabled =
													disabled ||
													isLoading ||
													option.disabled ||
													!!getOptionDisabled?.(option);
												const isSelected = field.value === option.value;
												return (
													<CommandItem
														key={option.value}
														value={`${option.label} ${option.value}`}
														disabled={isOptionDisabled}
														onSelect={() => {
															if (isOptionDisabled) return;
															field.onChange(option.value);
															if (typeof option?.value === "string") {
																onChange?.(option?.value);
															}
															setOpen(false);
														}}
													>
														{option.label}
														<Check
															className={cn(
																"ml-auto h-4 w-4",
																isSelected ? "opacity-100" : "opacity-0",
															)}
														/>
													</CommandItem>
												);
											})}
										</CommandGroup>
									</CommandList>

									{hasValue && (
										<>
											<CommandSeparator />
											<CommandGroup>
												<CommandItem
													value="__clear__"
													onSelect={clearValue}
													className="justify-center text-center text-destructive text-xs cursor-pointer"
												>
													Clear selected value
												</CommandItem>
											</CommandGroup>
										</>
									)}
								</Command>
							</PopoverContent>
						</Popover>
						{fieldState.error && (
							<FieldError>{fieldState.error.message}</FieldError>
						)}
					</Field>
				);
			}}
		/>
	);
}
