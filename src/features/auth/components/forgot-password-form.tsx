// #/features/auth/components/forgot-password-form.tsx
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Loader, Mail, MailCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { forgotPasswordSchema } from "#/features/auth/schema/forgot-password.schema";
import { forgotPasswordFn } from "#/features/auth/server/auth.functions";

function errorMessage(error: unknown) {
	if (typeof error === "string") return error;
	if (error && typeof error === "object" && "message" in error)
		return String(error.message);
	return null;
}

export function ForgotPasswordForm() {
	const forgotPassword = useServerFn(forgotPasswordFn);
	const [sentTo, setSentTo] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { email: "" },
		validators: { onSubmit: forgotPasswordSchema },
		onSubmit: async ({ value }) => {
			try {
				await forgotPassword({ data: value });
				toast.success("If that address exists, a reset link is on its way.");
				setSentTo(value.email);
			} catch (error: unknown) {
				const err = error as {
					message?: string;
					errors?: Record<string, Array<string>>;
				};
				const message = err.errors?.email?.[0];
				if (message) {
					form.setFieldMeta("email", (meta) => ({
						...meta,
						errorMap: { ...meta.errorMap, onSubmit: message },
					}));
				}
				form.setErrorMap({
					onSubmit: {
						form: err.message || "Failed to send reset link.",
						fields: {},
					},
				});
			}
		},
	});

	if (sentTo) {
		return (
			<div className="flex flex-col justify-center">
				<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
					<MailCheck
						className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
						aria-hidden="true"
					/>
				</div>
				<h1 className="text-2xl font-bold tracking-tight text-card-foreground">
					Check your inbox
				</h1>
				<p className="mt-1.5 text-[14px] text-muted-foreground">
					We sent a password reset link to{" "}
					<span className="font-medium text-foreground">{sentTo}</span>. The
					link expires in 60 minutes.
				</p>

				<div className="mt-6 space-y-3">
					<Button asChild className="w-full">
						<a href="https://mail.google.com" target="_blank" rel="noreferrer">
							<Mail className="mr-2 h-4 w-4" aria-hidden="true" />
							Open my inbox
						</a>
					</Button>

					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={() => {
							setSentTo(null);
							form.reset();
						}}
					>
						Use a different email
					</Button>
				</div>

				<p className="mt-6 text-center text-sm text-muted-foreground">
					Remembered it?{" "}
					<Link
						to="/sign-in"
						className="font-medium text-primary underline-offset-2 hover:underline"
					>
						Back to sign in
					</Link>
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col justify-center">
			<div className="mb-6">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<Mail className="h-6 w-6 text-primary" aria-hidden="true" />
				</div>
				<h1 className="text-2xl font-bold tracking-tight text-card-foreground">
					Forgot your password?
				</h1>
				<p className="mt-1.5 text-[14px] text-muted-foreground">
					Enter the email tied to your account and we&apos;ll send a reset link.
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

				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader
										className="mr-2 h-4 w-4 animate-spin"
										aria-hidden="true"
									/>
									Sending link...
								</>
							) : (
								"Send reset link"
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
