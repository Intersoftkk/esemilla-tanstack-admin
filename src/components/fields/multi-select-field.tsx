"use client";

import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react";
import type * as React from "react";
import { type Control, Controller } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
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

interface MultiSelectFieldProps {
	name: string;
	control: Control<any>;
	label?: string;
	description?: string;
	options: Option[];
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	maxDisplay?: number;

	[key: string]: any;
}

export function MultiSelectField({
	name,
	control,
	label,
	description,
	options,
	placeholder = "Select options",
	required = false,
	disabled = false,
	maxDisplay = 3,
	...props
}: MultiSelectFieldProps) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const selectedValues = new Set<string>(
					Array.isArray(field.value) ? field.value.map(String) : [],
				);

				const handleSelect = (value: string | number) => {
					const val = String(value);
					const newSet = new Set(selectedValues);
					if (newSet.has(val)) {
						newSet.delete(val);
					} else {
						newSet.add(val);
					}
					field.onChange(Array.from(newSet));
				};

				const handleSelectAll = () => {
					field.onChange(options.map((o) => String(o.value)));
				};

				const handleClearAll = (e?: React.MouseEvent) => {
					e?.preventDefault();
					e?.stopPropagation();
					field.onChange([]);
				};

				const selectedOptions = options.filter((option) =>
					selectedValues.has(String(option.value)),
				);

				const hasSelection = selectedValues.size > 0;

				return (
					<Field
						data-invalid={fieldState.invalid ? "true" : undefined}
						{...props}
					>
						{label && (
							<FieldLabel>
								{label}
								{required && <span className="text-destructive ml-1">*</span>}
							</FieldLabel>
						)}

						{description && <FieldDescription>{description}</FieldDescription>}

						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									disabled={disabled}
									aria-invalid={fieldState.invalid}
									className={cn(
										"w-full justify-between font-normal h-9",
										hasSelection && "h-auto min-h-9 py-1.5",
										!hasSelection && "text-muted-foreground",
										"aria-invalid:border-destructive aria-invalid:ring-destructive/20",
									)}
								>
									{!hasSelection ? (
										<span className="flex items-center">
											<PlusCircle className="mr-2 h-4 w-4" />
											{placeholder}
										</span>
									) : (
										<div className="flex flex-1 flex-wrap items-center gap-1">
											{selectedOptions.slice(0, maxDisplay).map((option) => (
												<Badge
													key={option.value}
													variant="secondary"
													className="rounded-sm px-1.5 py-0 font-normal"
												>
													{option.icon && (
														<span className="mr-1 flex items-center">
															{typeof option.icon === "string" ? (
																option.icon
															) : (
																<option.icon className="h-3 w-3" />
															)}
														</span>
													)}
													{option.label}
													<button
														type="button"
														aria-label={`Remove ${option.label}`}
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															if (option.value === undefined) return;
															handleSelect(option.value);
														}}
														className="ml-1 rounded-sm outline-none hover:bg-muted-foreground/20 focus:ring-1 focus:ring-ring"
													>
														<X className="h-3 w-3" />
													</button>
												</Badge>
											))}
											{selectedValues.size > maxDisplay && (
												<Badge
													variant="secondary"
													className="rounded-sm px-1.5 py-0 font-normal"
												>
													+{selectedValues.size - maxDisplay} more
												</Badge>
											)}
										</div>
									)}

									<div className="ml-2 flex shrink-0 items-center gap-1">
										{hasSelection && (
											<button
												type="button"
												aria-label="Clear all"
												onClick={handleClearAll}
												className="rounded-sm p-0.5 outline-none hover:bg-muted focus:ring-1 focus:ring-ring"
												title="Clear all"
											>
												<X className="h-3.5 w-3.5 text-muted-foreground" />
											</button>
										)}
										<ChevronsUpDown className="h-4 w-4 opacity-50" />
									</div>
								</Button>
							</PopoverTrigger>

							<PopoverContent
								className="w-[--radix-popover-trigger-width] min-w-[220px] p-0"
								align="start"
							>
								<Command>
									<CommandInput
										placeholder={`Search ${label?.toLowerCase() || "options"}...`}
										className="h-9"
									/>
									<CommandList>
										<CommandEmpty>No options found.</CommandEmpty>
										<CommandGroup>
											{options.map((option) => {
												if (option.value === undefined) return null;
												const isSelected = selectedValues.has(
													String(option.value),
												);

												return (
													<CommandItem
														key={option.value}
														onSelect={() => {
															if (option.value === undefined) return;
															handleSelect(option.value);
														}}
														disabled={disabled}
													>
														<div
															className={cn(
																"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
																isSelected
																	? "bg-primary text-primary-foreground"
																	: "opacity-50 [&_svg]:invisible",
															)}
														>
															<Check className="h-3.5 w-3.5" />
														</div>

														{option.icon && (
															<span className="mr-2 flex items-center text-muted-foreground">
																{typeof option.icon === "string" ? (
																	option.icon
																) : (
																	<option.icon className="h-4 w-4" />
																)}
															</span>
														)}

														<span className="flex-1">{option.label}</span>
													</CommandItem>
												);
											})}
										</CommandGroup>
									</CommandList>

									{hasSelection && (
										<>
											<CommandSeparator />
											<div className="flex items-center justify-between px-2 py-1.5">
												<span className="text-xs text-muted-foreground">
													{selectedValues.size} of {options.length} selected
												</span>
												<Button
													variant="ghost"
													size="sm"
													className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
													onClick={handleClearAll}
												>
													<X className="mr-1 h-3 w-3" />
													Clear all
												</Button>
											</div>
										</>
									)}

									{!hasSelection && options.length > 0 && (
										<>
											<CommandSeparator />
											<CommandGroup>
												<CommandItem
													onSelect={handleSelectAll}
													className="justify-center text-center text-sm"
												>
													Select all
												</CommandItem>
											</CommandGroup>
										</>
									)}

									{hasSelection && selectedValues.size < options.length && (
										<>
											<CommandSeparator />
											<CommandGroup>
												<CommandItem
													onSelect={handleSelectAll}
													className="justify-center text-center text-sm"
												>
													Select all
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
