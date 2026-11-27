import { useRouteContext } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	CheckCircle2,
	Loader2,
	Sparkles,
	XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Checkbox } from "#/components/ui/checkbox.tsx";
import { Field, FieldError, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
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
	BILLING_CYCLE_OPTIONS,
	CURRENCY_OPTIONS,
	getSchoolTypeMeta,
	SCHOOL_TYPE_OPTIONS,
} from "#/features/schools/config/school.config.ts";
import {
	useCreateSchoolMutation,
	useSchoolPlansQuery,
	useSlugAvailabilityQuery,
} from "#/features/schools/queries/school.queries.ts";
import {
	type OnboardingFormValues,
	onboardingSchema,
} from "#/features/schools/schema/school.schema.ts";
import type {
	BillingCycle,
	School,
} from "#/features/schools/types/schools.type.ts";
import {
	buildOnboardingDefaults,
	getPlan,
	monthlyEquivalent,
	recommendPlan,
	yearlySavingPercent,
	mapOnboardingErrorField,
	toOnboardPayload,
} from "#/features/schools/utils/onboarding.utils.ts";
import {
	formatMoney,
	PORTAL_ROOT_DOMAIN,
	priceForCycle,
	slugify,
} from "#/features/schools/utils/school.utils.ts";
import { cn } from "#/lib/utils.ts";

const STEPS = [
	{ id: 1, title: "Institution", subtitle: "Name, type & contact" },
	{ id: 2, title: "Location", subtitle: "Address, timezone & currency" },
	{ id: 3, title: "Plan", subtitle: "Capacity & billing cycle" },
	{ id: 4, title: "Workspace", subtitle: "Portal URL & owner account" },
	{ id: 5, title: "Review", subtitle: "Confirm & launch" },
] as const;

const STEP_FIELDS: Record<number, string[]> = {
	1: ["name", "type", "email", "phone", "website", "description"],
	2: [
		"address.line1",
		"address.line2",
		"address.city",
		"address.state",
		"address.postalCode",
		"address.country",
		"address.timezone",
		"currency",
	],
	3: ["planId", "billingCycle", "expectedStudents", "expectedBranches"],
	4: [
		"slug",
		"customDomain",
		"adminFirstName",
		"adminLastName",
		"adminEmail",
		"adminPhone",
	],
	5: ["acceptTerms"],
};

interface OnboardingWizardProps {
	onCreated: (school: School | null) => void;
}

export function OnboardingWizard({ onCreated }: OnboardingWizardProps) {
	const { user } = useRouteContext({ from: "__root__" });
	const plansQuery = useSchoolPlansQuery();
	const plans = plansQuery.data ?? [];
	const createMutation = useCreateSchoolMutation();

	const [step, setStep] = useState(1);
	const [slugTouched, setSlugTouched] = useState(false);
	const [errors, setErrors] = useState<Record<string, string | undefined>>({});
	const [formError, setFormError] = useState<string | null>(null);

	const [values, setValues] = useState<OnboardingFormValues>(() =>
		buildOnboardingDefaults(
			user
				? {
						email: user.email,
						mobile: user.mobile,
						firstName: user.name?.split(" ")[0] ?? "",
						lastName: user.name?.split(" ").slice(1).join(" ") ?? "",
					}
				: null,
		),
	);

	useEffect(() => {
		if (plans.length > 0 && !getPlan(plans, values.planId)) {
			setValues((prev) => ({
				...prev,
				planId: plans[0]?.id ?? "",
			}));
		}
	}, [plans, values.planId]);

	const slugQuery = useSlugAvailabilityQuery(values.slug, step === 4);

	const recommendedPlan = useMemo(
		() =>
			recommendPlan(
				plans,
				Number.parseInt(values.expectedStudents, 10) || 0,
				Number.parseInt(values.expectedBranches, 10) || 1,
			),
		[plans, values.expectedStudents, values.expectedBranches],
	);

	const selectedPlan = useMemo(
		() => getPlan(plans, values.planId),
		[plans, values.planId],
	);

	const setField = <K extends keyof OnboardingFormValues>(
		key: K,
		nextValue: OnboardingFormValues[K],
	) => {
		setValues((prev) => {
			const updated = { ...prev, [key]: nextValue };
			if (key === "name" && !slugTouched) {
				updated.slug = slugify(String(nextValue));
			}
			return updated;
		});
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	const validateStep = (targetStep: number): boolean => {
		const parsed = onboardingSchema.safeParse(values);
		if (parsed.success) {
			setErrors({});
			return true;
		}

		const allowedPrefixes = STEP_FIELDS[targetStep] ?? [];
		const nextErrors: Record<string, string> = {};

		for (const issue of parsed.error.issues) {
			const path = issue.path.join(".");
			if (
				allowedPrefixes.some(
					(prefix) => path === prefix || path.startsWith(`${prefix}.`),
				)
			) {
				if (!nextErrors[path]) {
					nextErrors[path] = issue.message;
				}
			}
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleNext = () => {
		if (step === 3 && (!selectedPlan || plansQuery.isError)) {
			setErrors((prev) => ({
				...prev,
				planId: "Choose an available plan to continue.",
			}));
			return;
		}
		if (!validateStep(step)) return;
		setStep((current) => Math.min(5, current + 1));
	};

	const handleSubmit = async () => {
		setFormError(null);
		if (!selectedPlan || plansQuery.isError) {
			setStep(3);
			setErrors((prev) => ({
				...prev,
				planId: "Choose an available plan to continue.",
			}));
			return;
		}
		const parsed = onboardingSchema.safeParse(values);
		if (!parsed.success) {
			const nextErrors: Record<string, string> = {};
			for (const issue of parsed.error.issues) {
				const path = issue.path.join(".");
				if (!nextErrors[path]) nextErrors[path] = issue.message;
			}
			setErrors(nextErrors);
			const firstPath = parsed.error.issues[0]?.path.join(".") ?? "";
			const owningStep = Number(
				Object.entries(STEP_FIELDS).find(([, fields]) =>
					fields.some(
						(field) => firstPath === field || firstPath.startsWith(`${field}.`),
					),
				)?.[0] ?? 1,
			);
			setStep(owningStep);
			return;
		}

		try {
			const created = await createMutation.mutateAsync(
				toOnboardPayload(parsed.data),
			);
			onCreated(created);
		} catch (error) {
			const err = error as {
				message?: string;
				errors?: Record<string, string[]>;
			};
			if (err.errors) {
				const mapped: Record<string, string> = {};
				for (const [key, messages] of Object.entries(err.errors)) {
					const target = mapOnboardingErrorField(key);
					if (target && messages[0]) mapped[target] = messages[0];
				}
				setErrors(mapped);
			}
			setFormError(err.message || "Could not complete onboarding.");
		}
	};

	return (
		<div className="space-y-6">
			<div className="grid gap-2 sm:grid-cols-5">
				{STEPS.map((item) => {
					const active = step === item.id;
					const done = step > item.id;
					return (
						<button
							key={item.id}
							type="button"
							onClick={() => {
								if (item.id < step) setStep(item.id);
							}}
							disabled={item.id > step}
							className={cn(
								"flex items-center gap-2.5 rounded-xl border p-3 text-left transition-colors",
								active
									? "border-primary bg-primary/5 ring-1 ring-primary/20"
									: done
										? "border-emerald-500/30 bg-emerald-500/5"
										: "opacity-60",
							)}
						>
							<span
								className={cn(
									"flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
									active
										? "bg-primary text-primary-foreground"
										: done
											? "bg-emerald-500 text-white"
											: "bg-muted text-muted-foreground",
								)}
							>
								{done ? <Check className="h-3.5 w-3.5" /> : item.id}
							</span>
							<div className="min-w-0">
								<p className="truncate text-xs font-semibold">{item.title}</p>
								<p className="truncate text-[10px] text-muted-foreground">
									{item.subtitle}
								</p>
							</div>
						</button>
					);
				})}
			</div>

			{formError && (
				<Alert variant="destructive">
					<AlertTitle>Onboarding error</AlertTitle>
					<AlertDescription>{formError}</AlertDescription>
				</Alert>
			)}

			<Card className="shadow-xs">
				<CardHeader>
					<CardTitle>{STEPS[step - 1]?.title}</CardTitle>
					<CardDescription>{STEPS[step - 1]?.subtitle}</CardDescription>
				</CardHeader>

				<CardContent className="space-y-5">
					{step === 1 && (
						<>
							<Field data-invalid={errors.name ? "true" : undefined}>
								<FieldLabel htmlFor="ob-name">Institution name *</FieldLabel>
								<Input
									id="ob-name"
									placeholder="Oakridge International Academy"
									value={values.name}
									onChange={(e) => setField("name", e.target.value)}
								/>
								{errors.name && <FieldError>{errors.name}</FieldError>}
							</Field>

							<Field>
								<FieldLabel>Institution type *</FieldLabel>
								<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
									{SCHOOL_TYPE_OPTIONS.map((option) => {
										const selected = values.type === option.value;
										return (
											<button
												key={option.value}
												type="button"
												onClick={() => setField("type", option.value)}
												className={cn(
													"flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors",
													selected
														? "border-primary bg-primary/5 ring-1 ring-primary/20"
														: "hover:bg-muted/40",
												)}
											>
												<option.icon
													className={cn(
														"mt-0.5 h-4 w-4 shrink-0",
														selected ? "text-primary" : "text-muted-foreground",
													)}
												/>
												<div className="min-w-0">
													<p className="text-xs font-semibold">
														{option.label}
													</p>
													<p className="text-[11px] text-muted-foreground">
														{option.description}
													</p>
												</div>
											</button>
										);
									})}
								</div>
							</Field>

							<div className="grid gap-4 sm:grid-cols-2">
								<Field data-invalid={errors.email ? "true" : undefined}>
									<FieldLabel htmlFor="ob-email">Official email *</FieldLabel>
									<Input
										id="ob-email"
										type="email"
										placeholder="admin@school.edu"
										value={values.email}
										onChange={(e) => setField("email", e.target.value)}
									/>
									{errors.email && <FieldError>{errors.email}</FieldError>}
								</Field>

								<Field data-invalid={errors.phone ? "true" : undefined}>
									<FieldLabel htmlFor="ob-phone">Phone number</FieldLabel>
									<Input
										id="ob-phone"
										placeholder="+91 98765 43210"
										value={values.phone}
										onChange={(e) => setField("phone", e.target.value)}
									/>
									{errors.phone && <FieldError>{errors.phone}</FieldError>}
								</Field>
							</div>

							<Field data-invalid={errors.website ? "true" : undefined}>
								<FieldLabel htmlFor="ob-website">Website (optional)</FieldLabel>
								<Input
									id="ob-website"
									placeholder="https://oakridge.edu"
									value={values.website}
									onChange={(e) => setField("website", e.target.value)}
								/>
								{errors.website && <FieldError>{errors.website}</FieldError>}
							</Field>

							<Field data-invalid={errors.description ? "true" : undefined}>
								<FieldLabel htmlFor="ob-desc">
									About the institution (optional)
								</FieldLabel>
								<Textarea
									id="ob-desc"
									rows={3}
									placeholder="Programs, boards, or notes for onboarding..."
									value={values.description}
									onChange={(e) => setField("description", e.target.value)}
								/>
								{errors.description && (
									<FieldError>{errors.description}</FieldError>
								)}
							</Field>
						</>
					)}

					{step === 2 && (
						<div className="space-y-5">
							<SchoolAddressFields
								value={values.address}
								errors={errors}
								onChange={(address) => {
									setValues((prev) => ({ ...prev, address }));
									setErrors({});
								}}
							/>

							<Field data-invalid={errors.currency ? "true" : undefined}>
								<FieldLabel>Default billing currency *</FieldLabel>
								<Select
									value={values.currency}
									onValueChange={(next) => setField("currency", next)}
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
								{errors.currency && <FieldError>{errors.currency}</FieldError>}
							</Field>
						</div>
					)}

					{step === 3 && (
						<div className="space-y-5">
							<div className="grid gap-4 sm:grid-cols-2">
								<Field
									data-invalid={errors.expectedStudents ? "true" : undefined}
								>
									<FieldLabel htmlFor="ob-students">
										Expected students *
									</FieldLabel>
									<Input
										id="ob-students"
										type="number"
										min={0}
										value={values.expectedStudents}
										onChange={(e) =>
											setField("expectedStudents", e.target.value)
										}
									/>
									{errors.expectedStudents && (
										<FieldError>{errors.expectedStudents}</FieldError>
									)}
								</Field>

								<Field
									data-invalid={errors.expectedBranches ? "true" : undefined}
								>
									<FieldLabel htmlFor="ob-branches">
										Number of campuses *
									</FieldLabel>
									<Input
										id="ob-branches"
										type="number"
										min={1}
										value={values.expectedBranches}
										onChange={(e) =>
											setField("expectedBranches", e.target.value)
										}
									/>
									{errors.expectedBranches && (
										<FieldError>{errors.expectedBranches}</FieldError>
									)}
								</Field>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								{BILLING_CYCLE_OPTIONS.map((opt) => (
									<Button
										key={opt.value}
										type="button"
										variant={
											values.billingCycle === opt.value ? "default" : "outline"
										}
										size="sm"
										onClick={() =>
											setField("billingCycle", opt.value as BillingCycle)
										}
									>
										{opt.label} ({opt.hint})
									</Button>
								))}
							</div>

							{plansQuery.isLoading && (
								<p className="text-sm text-muted-foreground">Loading plans…</p>
							)}
							{plansQuery.isError && (
								<div
									className="flex items-center gap-3 text-sm text-destructive"
									role="alert"
								>
									Unable to load plans.{" "}
									<Button
										variant="outline"
										size="sm"
										onClick={() => void plansQuery.refetch()}
									>
										Try again
									</Button>
								</div>
							)}
							{!plansQuery.isLoading &&
								!plansQuery.isError &&
								plans.length === 0 && (
									<p className="text-sm text-muted-foreground">
										No plans are available. Create a plan before onboarding a
										school.
									</p>
								)}
							<div className="grid gap-4 md:grid-cols-3">
								{plans.map((plan) => {
									const selected = values.planId === plan.id;
									const isRecommended = recommendedPlan?.id === plan.id;
									const saving = yearlySavingPercent(plan);

									return (
										<button
											key={plan.id}
											type="button"
											onClick={() => setField("planId", plan.id)}
											className={cn(
												"flex flex-col rounded-xl border p-4 text-left transition-all",
												selected
													? "border-primary bg-primary/5 ring-1 ring-primary"
													: "hover:bg-muted/40",
											)}
										>
											<div className="flex items-center justify-between gap-2">
												<span className="text-sm font-semibold">
													{plan.name}
												</span>
												{isRecommended && (
													<Badge className="text-[10px]">
														<Sparkles className="mr-1 h-2.5 w-2.5" />
														Recommended
													</Badge>
												)}
											</div>
											<p className="mt-1 text-[11px] text-muted-foreground">
												{plan.tagline}
											</p>
											<div className="mt-3">
												<span className="text-xl font-bold tabular-nums">
													{formatMoney(
														monthlyEquivalent(plan, values.billingCycle),
														plan.currency,
													)}
												</span>
												<span className="text-xs text-muted-foreground">
													/mo
												</span>
												{values.billingCycle === "yearly" && saving > 0 && (
													<p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
														Save {saving}% billed yearly
													</p>
												)}
											</div>
											<ul className="mt-3 space-y-1 text-[11px] text-muted-foreground">
												{plan.features.slice(0, 4).map((feature) => (
													<li
														key={feature}
														className="flex items-center gap-1.5"
													>
														<Check className="h-3 w-3 shrink-0 text-emerald-500" />
														<span>{feature}</span>
													</li>
												))}
											</ul>
										</button>
									);
								})}
							</div>
							{errors.planId && <FieldError>{errors.planId}</FieldError>}
						</div>
					)}

					{step === 4 && (
						<div className="space-y-5">
							<Field data-invalid={errors.slug ? "true" : undefined}>
								<FieldLabel htmlFor="ob-slug">Workspace subdomain *</FieldLabel>
								<div className="flex items-center gap-2">
									<Input
										id="ob-slug"
										placeholder="oakridge"
										value={values.slug}
										onChange={(e) => {
											setSlugTouched(true);
											setField("slug", e.target.value.toLowerCase());
										}}
									/>
									<span className="shrink-0 text-xs text-muted-foreground">
										.{PORTAL_ROOT_DOMAIN}
									</span>
								</div>
								{errors.slug && <FieldError>{errors.slug}</FieldError>}

								{slugQuery.isFetching ? (
									<p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
										<Loader2 className="h-3 w-3 animate-spin" />
										Checking availability...
									</p>
								) : slugQuery.data ? (
									slugQuery.data.available ? (
										<p className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
											<CheckCircle2 className="h-3.5 w-3.5" />
											{values.slug}.{PORTAL_ROOT_DOMAIN} is available
										</p>
									) : (
										<div className="mt-1 space-y-1 text-[11px] text-destructive">
											<p className="flex items-center gap-1.5">
												<XCircle className="h-3.5 w-3.5" />
												That workspace slug is already taken.
											</p>
											{slugQuery.data.suggestions.length > 0 && (
												<div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
													<span>Try:</span>
													{slugQuery.data.suggestions.map((suggestion) => (
														<Button
															key={suggestion}
															type="button"
															variant="outline"
															size="xs"
															onClick={() => {
																setSlugTouched(true);
																setField("slug", suggestion);
															}}
														>
															{suggestion}
														</Button>
													))}
												</div>
											)}
										</div>
									)
								) : null}
							</Field>

							<Field data-invalid={errors.customDomain ? "true" : undefined}>
								<FieldLabel htmlFor="ob-domain">
									Custom domain (optional)
								</FieldLabel>
								<Input
									id="ob-domain"
									placeholder="portal.oakridge.edu"
									value={values.customDomain}
									onChange={(e) => setField("customDomain", e.target.value)}
								/>
								{errors.customDomain && (
									<FieldError>{errors.customDomain}</FieldError>
								)}
							</Field>

							<div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
								<Field
									data-invalid={errors.adminFirstName ? "true" : undefined}
								>
									<FieldLabel htmlFor="ob-admin-first">
										Owner first name *
									</FieldLabel>
									<Input
										id="ob-admin-first"
										value={values.adminFirstName}
										onChange={(e) => setField("adminFirstName", e.target.value)}
									/>
									{errors.adminFirstName && (
										<FieldError>{errors.adminFirstName}</FieldError>
									)}
								</Field>

								<Field data-invalid={errors.adminLastName ? "true" : undefined}>
									<FieldLabel htmlFor="ob-admin-last">
										Owner last name *
									</FieldLabel>
									<Input
										id="ob-admin-last"
										value={values.adminLastName}
										onChange={(e) => setField("adminLastName", e.target.value)}
									/>
									{errors.adminLastName && (
										<FieldError>{errors.adminLastName}</FieldError>
									)}
								</Field>

								<Field data-invalid={errors.adminEmail ? "true" : undefined}>
									<FieldLabel htmlFor="ob-admin-email">
										Owner email *
									</FieldLabel>
									<Input
										id="ob-admin-email"
										type="email"
										value={values.adminEmail}
										onChange={(e) => setField("adminEmail", e.target.value)}
									/>
									{errors.adminEmail && (
										<FieldError>{errors.adminEmail}</FieldError>
									)}
								</Field>

								<Field data-invalid={errors.adminPhone ? "true" : undefined}>
									<FieldLabel htmlFor="ob-admin-phone">Owner phone</FieldLabel>
									<Input
										id="ob-admin-phone"
										value={values.adminPhone}
										onChange={(e) => setField("adminPhone", e.target.value)}
									/>
									{errors.adminPhone && (
										<FieldError>{errors.adminPhone}</FieldError>
									)}
								</Field>
							</div>
						</div>
					)}

					{step === 5 && (
						<div className="space-y-4 text-xs">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="rounded-lg border p-3.5">
									<div className="flex items-center justify-between">
										<p className="font-semibold text-foreground">Institution</p>
										<Button
											type="button"
											variant="link"
											size="xs"
											onClick={() => setStep(1)}
										>
											Edit
										</Button>
									</div>
									<p className="mt-1 font-medium">{values.name}</p>
									<p className="text-muted-foreground">
										{getSchoolTypeMeta(values.type).label} · {values.email}
									</p>
								</div>

								<div className="rounded-lg border p-3.5">
									<div className="flex items-center justify-between">
										<p className="font-semibold text-foreground">Location</p>
										<Button
											type="button"
											variant="link"
											size="xs"
											onClick={() => setStep(2)}
										>
											Edit
										</Button>
									</div>
									<p className="mt-1 font-medium">
										{values.address.city}, {values.address.country}
									</p>
									<p className="text-muted-foreground">
										{values.address.timezone} · {values.currency}
									</p>
								</div>

								<div className="rounded-lg border p-3.5">
									<div className="flex items-center justify-between">
										<p className="font-semibold text-foreground">Plan</p>
										<Button
											type="button"
											variant="link"
											size="xs"
											onClick={() => setStep(3)}
										>
											Edit
										</Button>
									</div>
									<p className="mt-1 font-medium">
										{selectedPlan?.name ?? values.planId} ({values.billingCycle}
										)
									</p>
									{selectedPlan && (
										<p className="text-muted-foreground">
											{formatMoney(
												priceForCycle(selectedPlan, values.billingCycle),
												selectedPlan.currency,
											)}{" "}
											/ {values.billingCycle === "yearly" ? "year" : "month"} ·{" "}
											{selectedPlan.trialDays}-day trial
										</p>
									)}
								</div>

								<div className="rounded-lg border p-3.5">
									<div className="flex items-center justify-between">
										<p className="font-semibold text-foreground">
											Workspace & owner
										</p>
										<Button
											type="button"
											variant="link"
											size="xs"
											onClick={() => setStep(4)}
										>
											Edit
										</Button>
									</div>
									<p className="mt-1 font-medium">
										{values.slug}.{PORTAL_ROOT_DOMAIN}
									</p>
									<p className="text-muted-foreground">
										{values.adminFirstName} {values.adminLastName} (
										{values.adminEmail})
									</p>
								</div>
							</div>

							<div className="flex items-start gap-2.5 rounded-lg border bg-muted/20 p-3.5">
								<Checkbox
									id="ob-terms"
									checked={values.acceptTerms}
									onCheckedChange={(checked) =>
										setField("acceptTerms", checked === true)
									}
								/>
								<div className="space-y-1">
									<Label htmlFor="ob-terms" className="cursor-pointer text-xs">
										I confirm that I am authorized to provision this school
										workspace and accept the platform service terms.
									</Label>
									{errors.acceptTerms && (
										<FieldError>{errors.acceptTerms}</FieldError>
									)}
								</div>
							</div>
						</div>
					)}
				</CardContent>

				<CardFooter className="flex items-center justify-between border-t pt-4">
					<Button
						type="button"
						variant="outline"
						disabled={step === 1 || createMutation.isPending}
						onClick={() => setStep((current) => Math.max(1, current - 1))}
					>
						<ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
						Previous
					</Button>

					{step < 5 ? (
						<Button type="button" onClick={handleNext}>
							Next step
							<ArrowRight className="ml-1.5 h-3.5 w-3.5" />
						</Button>
					) : (
						<Button
							type="button"
							disabled={createMutation.isPending}
							onClick={() => void handleSubmit()}
						>
							{createMutation.isPending ? (
								<>
									<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
									Creating school...
								</>
							) : (
								<>
									Launch workspace
									<Check className="ml-1.5 h-3.5 w-3.5" />
								</>
							)}
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
