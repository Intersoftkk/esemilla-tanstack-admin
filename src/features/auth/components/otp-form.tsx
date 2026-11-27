// #/features/auth/components/otp-form.tsx
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Loader, MailCheck, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { otpSchema } from "#/features/auth/schema/otp.schema";
import { sendOtpFn, verifyOtpFn } from "#/features/auth/server/auth.functions";

const RESEND_COOLDOWN = 30;

function errorMessage(error: unknown) {
	if (typeof error === "string") return error;
	if (error && typeof error === "object" && "message" in error)
		return String(error.message);
	return null;
}

/** Masks an address for display: `ama.owusu@school.edu` → `a•••••••@school.edu`. */
function maskEmail(email: string) {
	const [local, domain] = email.split("@");
	if (!domain) return email;
	const visible = local.slice(0, 1);
	return `${visible}${"•".repeat(Math.max(local.length - 1, 3))}@${domain}`;
}

export function OtpForm() {
	const navigate = useNavigate();
	const { email = "" } = useSearch({ strict: false }) as { email?: string };
	const verifyOtp = useServerFn(verifyOtpFn);
	const sendOtp = useServerFn(sendOtpFn);
	const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN);
	const [resending, setResending] = useState(false);

	useEffect(() => {
		if (secondsLeft <= 0) return;
		const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
		return () => clearTimeout(timer);
	}, [secondsLeft]);

	const form = useForm({
		defaultValues: { email, otp: "" },
		validators: { onSubmit: otpSchema },
		onSubmit: async ({ value }) => {
			try {
				await verifyOtp({ data: value });
				toast.success("Email verified — please sign in.");
				await navigate({ to: "/sign-in" });
			} catch (error: unknown) {
				const err = error as {
					message?: string;
					errors?: Record<string, Array<string>>;
				};
				const message =
					err.errors?.otp?.[0] ??
					(err.message?.toLowerCase().includes("otp")
						? err.message
						: undefined);
				if (message) {
					form.setFieldMeta("otp", (meta) => ({
						...meta,
						errorMap: { ...meta.errorMap, onSubmit: message },
					}));
				}
				form.setErrorMap({
					onSubmit: { form: err.message || "Verification failed.", fields: {} },
				});
			}
		},
	});

	const handleResend = async () => {
		if (secondsLeft > 0 || resending) return;
		setResending(true);
		try {
			await sendOtp({ data: { email } });
			toast.success("A new code is on its way.");
			setSecondsLeft(RESEND_COOLDOWN);
		} catch {
			toast.error("Failed to resend the code. Try again in a moment.");
		} finally {
			setResending(false);
		}
	};

	return (
		<div className="flex flex-col justify-center">
			<div className="mb-6">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
				</div>
				<h1 className="text-2xl font-bold tracking-tight text-card-foreground">
					Verify your email
				</h1>
				<p className="mt-1.5 text-[14px] text-muted-foreground">
					{email ? (
						<>
							Enter the 6-digit code we sent to{" "}
							<span className="font-medium text-foreground">
								{maskEmail(email)}
							</span>
							.
						</>
					) : (
						"Enter the 6-digit code from your verification email."
					)}
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

				<form.Field name="otp">
					{(field) => {
						const message = field.state.meta.errors
							.map(errorMessage)
							.find(Boolean);
						return (
							<Field data-invalid={message ? "true" : undefined}>
								<FieldLabel htmlFor={field.name}>
									Verification code{" "}
									<span className="ml-1 text-destructive">*</span>
								</FieldLabel>
								<div className="relative">
									<ShieldCheck
										className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
										aria-hidden="true"
									/>
									<Input
										id={field.name}
										name={field.name}
										inputMode="numeric"
										autoComplete="one-time-code"
										placeholder="123456"
										maxLength={6}
										autoFocus
										className="pl-10 text-center tracking-[0.35em] tabular-nums"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) =>
											field.handleChange(
												event.target.value.replace(/\D/g, "").slice(0, 6),
											)
										}
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
									Verifying...
								</>
							) : (
								"Verify email"
							)}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="mt-5 space-y-3 text-center">
				<p className="text-sm text-muted-foreground">
					Didn&apos;t receive the code?{" "}
					<button
						type="button"
						onClick={() => void handleResend()}
						disabled={secondsLeft > 0 || resending}
						className="font-medium text-primary underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
					>
						{secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend code"}
					</button>
				</p>

				<Link
					to="/sign-in"
					className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
				>
					<ArrowLeft className="h-3 w-3" aria-hidden="true" />
					Back to sign in
				</Link>
			</div>

			<p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
				<MailCheck className="h-3 w-3" aria-hidden="true" />
				Check your spam folder if the email is not there in a minute.
			</p>
		</div>
	);
}
