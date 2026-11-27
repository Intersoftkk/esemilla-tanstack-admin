// #/features/auth/components/sign-in-form.tsx
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	Clock,
	Eye,
	EyeOff,
	Loader,
	Lock,
	Mail,
} from "lucide-react";
import type { ComponentProps, KeyboardEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { signInSchema } from "#/features/auth/schema/sign-in.schema";
import { signInFn } from "#/features/auth/server/auth.functions";
import { cn } from "#/lib/utils";

interface SignInFormProps extends ComponentProps<"div"> {
	search?: { redirect?: string; reason?: "session_expired" };
}

function getSafeRedirectPath(redirect?: string) {
	if (
		!redirect ||
		!redirect.startsWith("/") ||
		redirect.startsWith("//") ||
		redirect.includes("\\")
	) {
		return "/dashboard";
	}

	return redirect;
}

function errorMessage(error: unknown) {
	if (typeof error === "string") return error;
	if (error && typeof error === "object" && "message" in error)
		return String(error.message);
	return null;
}

export function SignInForm({ search }: SignInFormProps) {
	const navigate = useNavigate();
	const router = useRouter();
	const login = useServerFn(signInFn);
	const queryClient = useQueryClient();
	const [showPassword, setShowPassword] = useState(false);
	const [capsLock, setCapsLock] = useState(false);

	const sessionExpired = search?.reason === "session_expired";

	const form = useForm({
		defaultValues: { email: "", password: "", remember: false },
		validators: { onSubmit: signInSchema },
		onSubmit: async ({ value }) => {
			try {
				const user = await login({ data: value });
				if (!user) {
					throw new Error("Login succeeded, but no user session was returned.");
				}

				queryClient.setQueryData(["auth", "session"], user);
				toast.success(`Welcome back${user.name ? `, ${user.name}` : ""}!`);
				await router.invalidate();
				await navigate({ to: getSafeRedirectPath(search?.redirect) });
			} catch (error: unknown) {
				const err = error as {
					message?: string;
					errors?: Record<string, Array<string>>;
				};
				for (const field of ["email", "password"] as const) {
					const message = err.errors?.[field]?.[0];
					if (!message) continue;
					form.setFieldMeta(field, (meta) => ({
						...meta,
						errorMap: { ...meta.errorMap, onSubmit: message },
					}));
				}
				form.setErrorMap({
					onSubmit: {
						form: err.message || "Login failed. Please check your credentials.",
						fields: {},
					},
				});
			}
		},
	});

	const handleCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
		if (typeof event.getModifierState === "function") {
			setCapsLock(event.getModifierState("CapsLock"));
		}
	};

	return (
		<div className="flex flex-col justify-center">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight text-card-foreground">
					Welcome back
				</h1>
				<p className="mt-1.5 text-[14px] text-muted-foreground">
					Sign in to manage your tenants, billing and support queue.
				</p>
			</div>

			{sessionExpired ? (
				<output className="mb-5 flex items-start gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-300">
					<Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
					<p>
						Your session expired. Sign in again to pick up where you left off.
					</p>
				</output>
			) : null}

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
									: "Login failed. Please check your credentials."}
							</div>
						) : null
					}
				</form.Subscribe>

				<form.Field name="email">
					{(field) => {
						const message = field.state.meta.errors
							.map(errorMessage)
							.find(Boolean);
						return (
							<Field data-invalid={message ? "true" : undefined}>
								<FieldLabel htmlFor={field.name}>
									Email <span className="ml-1 text-destructive">*</span>
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
										autoComplete="username"
										placeholder="you@intersoftkk.com"
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
								<div className="flex items-center justify-between gap-2">
									<FieldLabel htmlFor={field.name}>
										Password <span className="ml-1 text-destructive">*</span>
									</FieldLabel>
									<Link
										to="/forgot-password"
										className="text-xs font-medium text-primary underline-offset-2 hover:underline"
									>
										Forgot password?
									</Link>
								</div>
								<div className="relative">
									<Lock
										className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
										aria-hidden="true"
									/>
									<Input
										id={field.name}
										name={field.name}
										type={showPassword ? "text" : "password"}
										autoComplete="current-password"
										placeholder="Your password"
										className="pl-10 pr-10"
										value={field.state.value}
										onBlur={() => {
											setCapsLock(false);
											field.handleBlur();
										}}
										onChange={(event) => field.handleChange(event.target.value)}
										onKeyDown={handleCapsLock}
										onKeyUp={handleCapsLock}
										aria-invalid={!!message}
										aria-describedby={capsLock ? "caps-lock-hint" : undefined}
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
								{capsLock ? (
									<p
										id="caps-lock-hint"
										className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400"
									>
										<AlertTriangle className="h-3 w-3" aria-hidden="true" />
										Caps Lock is on
									</p>
								) : null}
								{message && <FieldError>{message}</FieldError>}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="remember">
					{(field) => (
						<label className="flex w-fit cursor-pointer select-none items-center gap-2 text-sm text-muted-foreground">
							<input
								type="checkbox"
								className="h-4 w-4 rounded border-input accent-primary"
								checked={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.checked)}
							/>
							Keep me signed in for 7 days
						</label>
					)}
				</form.Field>

				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader
										className="mr-2 h-4 w-4 animate-spin"
										aria-hidden="true"
									/>
									Signing in...
								</>
							) : (
								"Sign in"
							)}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<p className="mt-6 text-center text-sm text-muted-foreground">
				New to Esemilla?{" "}
				<Link
					to="/sign-up"
					className="font-medium text-primary underline-offset-2 hover:underline"
				>
					Create an account
				</Link>
			</p>

			<p className="mt-3 text-center text-[11px] text-muted-foreground">
				Trouble signing in?{" "}
				<a
					href="mailto:support@esemilla.com"
					className="underline underline-offset-2 hover:text-foreground"
				>
					Contact support
				</a>
			</p>
		</div>
	);
}
