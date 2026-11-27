// #/features/auth/components/sign-up-form.tsx
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, Eye, EyeOff, Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { PasswordStrength } from "#/features/auth/components/password-strength.tsx";
import { signUpSchema } from "#/features/auth/schema/sign-up.schema";
import { signUpFn } from "#/features/auth/server/auth.functions";
import { cn } from "#/lib/utils";

function errorMessage(error: unknown) {
	if (typeof error === "string") return error;
	if (error && typeof error === "object" && "message" in error)
		return String(error.message);
	return null;
}

export function SignUpForm() {
	const navigate = useNavigate();
	const router = useRouter();
	const register = useServerFn(signUpFn);
	const queryClient = useQueryClient();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [acceptedTerms, setAcceptedTerms] = useState(false);

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: { onSubmit: signUpSchema },
		onSubmit: async ({ value }) => {
			try {
				await register({ data: value });
				toast.success("Account created — welcome aboard!");
				await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
				await router.invalidate();
				await navigate({ to: "/dashboard" });
			} catch (error: unknown) {
				const err = error as {
					message?: string;
					errors?: Record<string, Array<string>>;
				};
				for (const field of [
					"name",
					"email",
					"password",
					"confirmPassword",
				] as const) {
					const message = err.errors?.[field]?.[0];
					if (!message) continue;
					form.setFieldMeta(field, (meta) => ({
						...meta,
						errorMap: { ...meta.errorMap, onSubmit: message },
					}));
				}
				form.setErrorMap({
					onSubmit: {
						form: err.message || "Registration failed. Please try again.",
						fields: {},
					},
				});
			}
		},
	});

	return (
		<div className="flex flex-col justify-center">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight text-card-foreground">
					Create your account
				</h1>
				<p className="mt-1.5 text-[14px] text-muted-foreground">
					Set up access in under a minute — you can invite your team afterwards.
				</p>
			</div>

			<form
				className="space-y-4"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<form.Subscribe selector={(state) => state.errorMap.onSubmit}>
					{(error) => {
						const message =
							error &&
							typeof error === "object" &&
							"form" in error &&
							typeof error.form === "string"
								? error.form
								: null;
						return message ? (
							<div
								role="alert"
								className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
							>
								{message}
							</div>
						) : null;
					}}
				</form.Subscribe>

				<form.Field name="name">
					{(field) => {
						const message = field.state.meta.errors
							.map(errorMessage)
							.find(Boolean);
						return (
							<Field data-invalid={message ? "true" : undefined}>
								<FieldLabel htmlFor={field.name}>
									Full name <span className="ml-1 text-destructive">*</span>
								</FieldLabel>
								<div className="relative">
									<User
										className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
										aria-hidden="true"
									/>
									<Input
										id={field.name}
										name={field.name}
										autoComplete="name"
										placeholder="Ama Owusu"
										className="pl-10"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										aria-invalid={!!message}
									/>
								</div>
								{message && <FieldError>{message}</FieldError>}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="email">
					{(field) => {
						const message = field.state.meta.errors
							.map(errorMessage)
							.find(Boolean);
						return (
							<Field data-invalid={message ? "true" : undefined}>
								<FieldLabel htmlFor={field.name}>
									Work email <span className="ml-1 text-destructive">*</span>
								</FieldLabel>
								<div className="relative">
									<Mail
										className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
										aria-hidden="true"
									/>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										autoComplete="email"
										placeholder="you@school.edu"
										className="pl-10"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										aria-invalid={!!message}
									/>
								</div>
								{message && <FieldError>{message}</FieldError>}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="password">
					{(field) => {
						const message = field.state.meta.errors
							.map(errorMessage)
							.find(Boolean);
						return (
							<Field data-invalid={message ? "true" : undefined}>
								<FieldLabel htmlFor={field.name}>
									Password <span className="ml-1 text-destructive">*</span>
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
											Confirm password{" "}
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

				<label className="flex cursor-pointer select-none items-start gap-2.5 rounded-lg border border-border/70 bg-muted/30 p-3 text-xs text-muted-foreground">
					<input
						type="checkbox"
						className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
						checked={acceptedTerms}
						onChange={(event) => setAcceptedTerms(event.target.checked)}
					/>
					<span>
						I agree to the{" "}
						<a
							href="https://esemilla.com/terms"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-foreground underline underline-offset-2"
						>
							Terms of Service
						</a>{" "}
						and{" "}
						<a
							href="https://esemilla.com/privacy"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-foreground underline underline-offset-2"
						>
							Privacy Policy
						</a>
						.
					</span>
				</label>

				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting || !acceptedTerms}
						>
							{isSubmitting ? (
								<>
									<Loader
										className="mr-2 h-4 w-4 animate-spin"
										aria-hidden="true"
									/>
									Creating account...
								</>
							) : (
								"Create account"
							)}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<p className="mt-5 text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link
					to="/sign-in"
					className="font-medium text-primary underline-offset-2 hover:underline"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
