import * as countryInfo from "country-js";
import { useMemo } from "react";

import { Field, FieldError, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import { TIMEZONE_OPTIONS } from "#/features/schools/config/school.config.ts";
import type { SchoolAddressValues } from "#/features/schools/schema/school.schema.ts";

interface SchoolAddressFieldsProps {
	value: SchoolAddressValues;
	errors?: Record<string, string | undefined>;
	onChange: (next: SchoolAddressValues) => void;
}

export function SchoolAddressFields({
	value,
	errors = {},
	onChange,
}: SchoolAddressFieldsProps) {
	const countries = useMemo(() => {
		try {
			const list = countryInfo.getAll();
			if (!Array.isArray(list)) return [];
			return list
				.map((item) => ({
					code: item.code.toUpperCase(),
					name: item.name
						.toLowerCase()
						.split(" ")
						.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
						.join(" "),
				}))
				.sort((a, b) => a.name.localeCompare(b.name));
		} catch {
			return [];
		}
	}, []);

	const update = <K extends keyof SchoolAddressValues>(
		key: K,
		nextVal: SchoolAddressValues[K],
	) => {
		onChange({ ...value, [key]: nextVal });
	};

	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<Field
				className="sm:col-span-2"
				data-invalid={errors["address.line1"] ? "true" : undefined}
			>
				<FieldLabel htmlFor="addr-line1">Street address *</FieldLabel>
				<Input
					id="addr-line1"
					placeholder="123 Campus Avenue"
					value={value.line1}
					onChange={(e) => update("line1", e.target.value)}
				/>
				{errors["address.line1"] && (
					<FieldError>{errors["address.line1"]}</FieldError>
				)}
			</Field>

			<Field className="sm:col-span-2">
				<FieldLabel htmlFor="addr-line2">Address line 2 (optional)</FieldLabel>
				<Input
					id="addr-line2"
					placeholder="Building, suite, or landmark"
					value={value.line2}
					onChange={(e) => update("line2", e.target.value)}
				/>
			</Field>

			<Field data-invalid={errors["address.city"] ? "true" : undefined}>
				<FieldLabel htmlFor="addr-city">City *</FieldLabel>
				<Input
					id="addr-city"
					placeholder="Kolkata"
					value={value.city}
					onChange={(e) => update("city", e.target.value)}
				/>
				{errors["address.city"] && (
					<FieldError>{errors["address.city"]}</FieldError>
				)}
			</Field>

			<Field>
				<FieldLabel htmlFor="addr-state">State / province</FieldLabel>
				<Input
					id="addr-state"
					placeholder="West Bengal"
					value={value.state}
					onChange={(e) => update("state", e.target.value)}
				/>
			</Field>

			<Field>
				<FieldLabel htmlFor="addr-postal">Postal code</FieldLabel>
				<Input
					id="addr-postal"
					placeholder="700001"
					value={value.postalCode}
					onChange={(e) => update("postalCode", e.target.value)}
				/>
			</Field>

			<Field data-invalid={errors["address.country"] ? "true" : undefined}>
				<FieldLabel>Country *</FieldLabel>
				<Select
					value={value.country}
					onValueChange={(next) => update("country", next)}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select country" />
					</SelectTrigger>
					<SelectContent>
						{countries.length > 0 ? (
							countries.map((country) => (
								<SelectItem key={country.code} value={country.code}>
									{country.name} ({country.code})
								</SelectItem>
							))
						) : (
							<>
								<SelectItem value="IN">India (IN)</SelectItem>
								<SelectItem value="US">United States (US)</SelectItem>
								<SelectItem value="GB">United Kingdom (GB)</SelectItem>
							</>
						)}
					</SelectContent>
				</Select>
				{errors["address.country"] && (
					<FieldError>{errors["address.country"]}</FieldError>
				)}
			</Field>

			<Field
				className="sm:col-span-2"
				data-invalid={errors["address.timezone"] ? "true" : undefined}
			>
				<FieldLabel>Timezone *</FieldLabel>
				<Select
					value={value.timezone}
					onValueChange={(next) => update("timezone", next)}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select timezone" />
					</SelectTrigger>
					<SelectContent>
						{TIMEZONE_OPTIONS.map((tz) => (
							<SelectItem key={tz.value} value={tz.value}>
								{tz.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors["address.timezone"] && (
					<FieldError>{errors["address.timezone"]}</FieldError>
				)}
			</Field>
		</div>
	);
}
