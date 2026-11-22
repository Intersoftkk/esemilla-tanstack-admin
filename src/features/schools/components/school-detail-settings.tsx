import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Field, FieldError, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import { Textarea } from "#/components/ui/textarea.tsx";
import { SchoolAddressFields } from "#/features/schools/components/school-address-fields.tsx";
import {
	CURRENCY_OPTIONS,
	SCHOOL_TYPE_OPTIONS,
} from "#/features/schools/config/school.config.ts";
import { useUpdateSchoolMutation } from "#/features/schools/queries/school.queries.ts";
import {
	type SchoolSettingsFormValues,
	schoolSettingsSchema,
} from "#/features/schools/schema/school.schema.ts";
import type {
	School,
	SchoolType,
} from "#/features/schools/types/school.types.ts";
import {
	buildSchoolSettingsDefaults,
	toUpdateSchoolPayload,
} from "#/features/schools/utils/onboarding.utils.ts";

export function SchoolDetailSettings({ school }: { school: School }) {
	const updateMutation = useUpdateSchoolMutation();
	const [values, setValues] = useState<SchoolSettingsFormValues>(() =>
		buildSchoolSettingsDefaults(school),
	);
	const [errors, setErrors] = useState<Record<string, string | undefined>>({});

	useEffect(() => {
		setValues(buildSchoolSettingsDefaults(school));
		setErrors({});
	}, [school]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const parsed = schoolSettingsSchema.safeParse(values);
		if (!parsed.success) {
			const nextErrors: Record<string, string> = {};
			for (const issue of parsed.error.issues) {
				const path = issue.path.join(".");
				if (!nextErrors[path]) nextErrors[path] = issue.message;
			}
			setErrors(nextErrors);
			return;
		}
		setErrors({});
		updateMutation.mutate({
			id: school.id,
			payload: toUpdateSchoolPayload(parsed.data),
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<Card className="shadow-xs">
				<CardHeader>
					<CardTitle className="text-base">Profile & domain</CardTitle>
					<CardDescription>
						Update public institution details, portal slug, and custom domain.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<Field data-invalid={errors.name ? "true" : undefined}>
							<FieldLabel htmlFor="sd-name">Name *</FieldLabel>
							<Input
								id="sd-name"
								value={values.name}
								onChange={(e) =>
									setValues((prev) => ({ ...prev, name: e.target.value }))
								}
							/>
							{errors.name && <FieldError>{errors.name}</FieldError>}
						</Field>

						<Field>
							<FieldLabel>Type</FieldLabel>
							<Select
								value={values.type}
								onValueChange={(next) =>
									setValues((prev) => ({ ...prev, type: next as SchoolType }))
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{SCHOOL_TYPE_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>

						<Field data-invalid={errors.email ? "true" : undefined}>
							<FieldLabel htmlFor="sd-email">Email *</FieldLabel>
							<Input
								id="sd-email"
								type="email"
								value={values.email}
								onChange={(e) =>
									setValues((prev) => ({ ...prev, email: e.target.value }))
								}
							/>
							{errors.email && <FieldError>{errors.email}</FieldError>}
						</Field>

						<Field data-invalid={errors.phone ? "true" : undefined}>
							<FieldLabel htmlFor="sd-phone">Phone</FieldLabel>
							<Input
								id="sd-phone"
								value={values.phone}
								onChange={(e) =>
									setValues((prev) => ({ ...prev, phone: e.target.value }))
								}
							/>
							{errors.phone && <FieldError>{errors.phone}</FieldError>}
						</Field>

						<Field data-invalid={errors.slug ? "true" : undefined}>
							<FieldLabel htmlFor="sd-slug">Portal slug *</FieldLabel>
							<Input
								id="sd-slug"
								value={values.slug}
								onChange={(e) =>
									setValues((prev) => ({
										...prev,
										slug: e.target.value.toLowerCase(),
									}))
								}
							/>
							{errors.slug && <FieldError>{errors.slug}</FieldError>}
						</Field>

						<Field data-invalid={errors.customDomain ? "true" : undefined}>
							<FieldLabel htmlFor="sd-domain">Custom domain</FieldLabel>
							<Input
								id="sd-domain"
								value={values.customDomain}
								onChange={(e) =>
									setValues((prev) => ({
										...prev,
										customDomain: e.target.value,
									}))
								}
							/>
							{errors.customDomain && (
								<FieldError>{errors.customDomain}</FieldError>
							)}
						</Field>
					</div>

					<Field data-invalid={errors.website ? "true" : undefined}>
						<FieldLabel htmlFor="sd-website">Website</FieldLabel>
						<Input
							id="sd-website"
							value={values.website}
							onChange={(e) =>
								setValues((prev) => ({ ...prev, website: e.target.value }))
							}
						/>
						{errors.website && <FieldError>{errors.website}</FieldError>}
					</Field>

					<Field>
						<FieldLabel htmlFor="sd-desc">Description</FieldLabel>
						<Textarea
							id="sd-desc"
							rows={3}
							value={values.description}
							onChange={(e) =>
								setValues((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
						/>
					</Field>
				</CardContent>
			</Card>

			<Card className="shadow-xs">
				<CardHeader>
					<CardTitle className="text-base">Address & currency</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<SchoolAddressFields
						value={values.address}
						errors={errors}
						onChange={(address) => setValues((prev) => ({ ...prev, address }))}
					/>
					<Field>
						<FieldLabel>Currency</FieldLabel>
						<Select
							value={values.currency}
							onValueChange={(currency) =>
								setValues((prev) => ({ ...prev, currency }))
							}
						>
							<SelectTrigger className="w-full sm:w-72">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{CURRENCY_OPTIONS.map((currency) => (
									<SelectItem key={currency.value} value={currency.value}>
										{currency.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				</CardContent>
				<CardFooter className="border-t pt-4">
					<Button type="submit" disabled={updateMutation.isPending}>
						{updateMutation.isPending ? (
							<>
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
								Saving changes...
							</>
						) : (
							<>
								<Save className="mr-1.5 h-3.5 w-3.5" />
								Save changes
							</>
						)}
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
