// #/features/auth/components/reset-password-form.tsx
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	ArrowLeft,
	Check,
	Eye,
	EyeOff,
	KeyRound,
	Loader,
	Lock,
	ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { PasswordStrength } from "#/features/auth/components/password-strength.tsx";
import { resetPasswordSchema } from "#/features/auth/schema/reset-password.schema";
import { resetPasswordFn } from "#/features/auth/server/auth.functions";
import { cn } from "#/lib/utils";

function errorMessage(error: unknown) {
	if (typeof error === "string") return error;
	if (error && typeof error === "object" && "message" in error)
		return String(error.message);
	return null;
}

export function ResetPasswordForm() {
	const navigate = useNavigate();
	const resetPassword = useServerFn(resetPasswordFn);
	const search = useSearch({ strict: false }) as {
		token?: string;
		email?: string;
	};
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const token = search.token ?? "";
	const email = search.email ?? "";

	const form = useForm({
		defaultValues: {
			token,
			email,
			password: "",
			confirmPassword: "",
		},
		validators: { onSubmit: resetPasswordSchema },
		onSubmit: async ({ value }) => {
			try {
				await resetPassword({ data: value });
				toast.success("Password updated — sign in with your new password.");
				await navigate({ to: "/sign-in" });
			} catch (error: unknown) {
				const err = error as {
					message?: string;
					errors?: Record<string, Array<string>>;
				};
				for (const field of ["password", "confirmPassword"] as const) {
					const message = err.errors?.[field]?.[0];
					if (!message) continue;
					form.setFieldMeta(field, (meta) => ({
						...meta,
						errorMap: { ...meta.errorMap, onSubmit: message },
					}));
				}
				form.setErrorMap({
					onSubmit: {
						form:
							err.message ||
							"This reset link is invalid or has expired. Request a new one.",
						fields: {},
					},
				});
			}
		},
	});

	// A reset link without a token/email cannot work — explain instead of
	// letting the user fill a form that can only fail.
	if (!token || !email) {
		return (
			<div className="flex flex-col justify-center">
				<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
					<ShieldAlert
						className="h-6 w-6 text-destructive"
						aria-hidden="true"
					/>
				</div>
				<h1 className="text-2xl font-bold tracking-tight text-card-foreground">
					Link no longer valid
				</h1>
				<p className="mt-1.5 text-[14px] text-muted-foreground">
					This password reset link is missing its token or has expired. Request
					a fresh one to continue.
				</p>

				<Button asChild className="mt-6 w-full">
					<Link to="/forgot-password">Request a new link</Link>
				</Button>

				<Link
					to="/sign-in"
					className="mx-auto mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
				>
					<ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col justify-center">
			<div className="mb-6">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<KeyRound className="h-6 w-6 text-primary" aria-hidden="true" />
				</div>
				<h1 className="text-2xl font-bold tracking-tight text-card-foreground">
					Set a new password
				</h1>
				<p className="mt-1.5 text-[14px] text-muted-foreground">
					Resetting the password for{" "}
					<span className="font-medium text-foreground">{email}</span>.
				</p>
			</div>

			<form
				className="space-y-5"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<form.Subscribe selector={(state) => state.errorMap.onSubmit}>
					{(error) =>
						error ? (
							<div
								role="alert"
								className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
							>
								{typeof error === "string"
									? error
									: "This reset link is invalid or has expired."}
							</div>
						) : null
					}
				</form.Subscribe>

				<form.Field name="password">
					{(field) => {
						const message = field.state.meta.errors
							.map(errorMessage)
							.find(Boolean);
						return (
							<Field data-invalid={message ? "true" : undefined}>
								<FieldLabel htmlFor={field.name}>
									New password <span className="ml-1 text-destructive">*</span>
								</FieldLabel>
								<div className="relative">
									<Lock
										className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
										aria-hidden="true"
									/>
									<Input
										id={field.name}
										name={field.name}
										type={showPassword ? "text" : "password"}
										autoComplete="new-password"
										placeholder="Create a strong password"
										className="pl-10 pr-10"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										aria-invalid={!!message}
									/>
									<button
										type="button"
										tabIndex={-1}
										className={cn(
											"absolute right-0 top-0 flex h-full items-center px-3 text-muted-foreground",
											"hover:text-foreground",
										)}
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
										onClick={() => setShowPassword((value) => !value)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4" aria-hidden="true" />
										) : (
											<Eye className="h-4 w-4" aria-hidden="true" />
										)}
									</button>
								</div>
								<PasswordStrength password={field.state.value} />
								{message && <FieldError>{message}</FieldError>}
							</Field>
						);
					}}
				</form.Field>

				<form.Subscribe selector={(state) => state.values.password}>
					{(password) => (
						<form.Field name="confirmPassword">
							{(field) => {
								const message = field.state.meta.errors
									.map(errorMessage)
									.find(Boolean);
								const matches =
									field.state.value.length > 0 &&
									field.state.value === password;
								return (
									<Field data-invalid={message ? "true" : undefined}>
										<FieldLabel htmlFor={field.name}>
											Confirm new password{" "}
											<span className="ml-1 text-destructive">*</span>
										</FieldLabel>
										<div className="relative">
											<Lock
												className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
												aria-hidden="true"
											/>
											<Input
												id={field.name}
												name={field.name}
												type={showConfirm ? "text" : "password"}
												autoComplete="new-password"
												placeholder="Repeat your password"
												className="pl-10 pr-10"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(event.target.value)
												}
												aria-invalid={!!message}
											/>
											<button
												type="button"
												tabIndex={-1}
												className={cn(
													"absolute right-0 top-0 flex h-full items-center px-3 text-muted-foreground",
													"hover:text-foreground",
												)}
												aria-label={
													showConfirm ? "Hide password" : "Show password"
												}
												onClick={() => setShowConfirm((value) => !value)}
											>
												{showConfirm ? (
													<EyeOff className="h-4 w-4" aria-hidden="true" />
												) : (
													<Eye className="h-4 w-4" aria-hidden="true" />
												)}
											</button>
										</div>
										{matches && !message ? (
											<p className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
												<Check className="h-3 w-3" aria-hidden="true" />
												Passwords match
											</p>
										) : null}
										{message && <FieldError>{message}</FieldError>}
									</Field>
								);
							}}
						</form.Field>
					)}
				</form.Subscribe>

				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader
										className="mr-2 h-4 w-4 animate-spin"
										aria-hidden="true"
									/>
									Updating password...
								</>
							) : (
								"Update password"
							)}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<Link
				to="/sign-in"
				className="mx-auto mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
			>
				<ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
				Back to sign in
			</Link>
		</div>
	);
}
