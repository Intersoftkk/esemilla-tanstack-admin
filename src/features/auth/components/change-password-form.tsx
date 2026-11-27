import { useForm } from "@tanstack/react-form";
import { useServerFn } from "@tanstack/react-start";
import { Eye, EyeOff, Loader, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { changePasswordSchema } from "#/features/auth/schema/change-password.schema";
import { changePasswordFn } from "#/features/auth/server/auth.functions";
import { cn } from "#/lib/utils";

function fieldErrorMessage(error: unknown): string | null {
	if (typeof error === "string") return error;
	if (error && typeof error === "object" && "message" in error) {
		return String(error.message);
	}
	return null;
}

const FIELDS = [
	{
		name: "currentPassword",
		label: "Current password",
		autoComplete: "current-password",
		serverKey: "current_password",
	},
	{
		name: "newPassword",
		label: "New password",
		autoComplete: "new-password",
		serverKey: "password",
	},
	{
		name: "confirmPassword",
		label: "Confirm new password",
		autoComplete: "new-password",
		serverKey: "password_confirmation",
	},
] as const;

type FieldName = (typeof FIELDS)[number]["name"];

export function ChangePasswordForm() {
	const changePassword = useServerFn(changePasswordFn);
	const [visible, setVisible] = useState<Record<FieldName, boolean>>({
		currentPassword: false,
		newPassword: false,
		confirmPassword: false,
	});

	const form = useForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
		validators: { onSubmit: changePasswordSchema },
		onSubmit: async ({ value }) => {
			try {
				await changePassword({ data: value });
				toast.success("Password changed successfully.");
				form.reset();
			} catch (error: unknown) {
				const err = error as {
					message?: string;
					errors?: Record<string, string[]>;
				};
				for (const field of FIELDS) {
					const message = err.errors?.[field.serverKey]?.[0];
					if (!message) continue;
					form.setFieldMeta(field.name, (meta) => ({
						...meta,
						errorMap: { ...meta.errorMap, onSubmit: message },
					}));
				}
				form.setErrorMap({
					onSubmit: {
						form: err.message || "Password change failed. Please try again.",
						fields: {},
					},
				});
			}
		},
	});

	return (
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
						<div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
							{typeof error === "string"
								? error
								: "Password change failed. Please try again."}
						</div>
					) : null
				}
			</form.Subscribe>

			{FIELDS.map((config) => (
				<form.Field key={config.name} name={config.name}>
					{(field) => {
						const message = field.state.meta.errors
							.map(fieldErrorMessage)
							.find(Boolean);
						const shown = visible[field.name as FieldName];
						return (
							<Field data-invalid={message ? "true" : undefined}>
								<FieldLabel htmlFor={field.name}>
									{config.label}{" "}
									<span className="ml-1 text-destructive">*</span>
								</FieldLabel>
								<div className="relative">
									<Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id={field.name}
										name={field.name}
										type={shown ? "text" : "password"}
										autoComplete={config.autoComplete}
										placeholder="********"
										className="pr-10 pl-10"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										aria-invalid={!!message}
									/>
									<button
										type="button"
										tabIndex={-1}
										className={cn(
											"absolute top-0 right-0 flex h-full items-center px-3 text-muted-foreground",
											"hover:text-foreground",
										)}
										aria-label={shown ? "Hide password" : "Show password"}
										onClick={() =>
											setVisible((prev) => ({
												...prev,
												[field.name]: !prev[field.name as FieldName],
											}))
										}
									>
										{shown ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>
								{message && <FieldError>{message}</FieldError>}
							</Field>
						);
					}}
				</form.Field>
			))}

			<form.Subscribe selector={(state) => state.isSubmitting}>
				{(isSubmitting) => (
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader className="mr-2 h-4 w-4 animate-spin" />
								Changing password...
							</>
						) : (
							"Change password"
						)}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
