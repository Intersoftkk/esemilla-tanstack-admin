import { createServerFn } from "@tanstack/react-start";
import { changePasswordSchema } from "#/features/auth/schema/change-password.schema";
import { forgotPasswordSchema } from "#/features/auth/schema/forgot-password.schema";
import { otpSchema } from "#/features/auth/schema/otp.schema";
import { resetPasswordSchema } from "#/features/auth/schema/reset-password.schema";
import { signInSchema } from "#/features/auth/schema/sign-in.schema";
import {
	changePasswordRequest,
	fetchSession,
	forgotPasswordRequest,
	loginRequest,
	logoutRequest,
	resetPasswordRequest,
	sendOtpRequest,
	verifyOtpRequest,
} from "#/features/auth/server/auth.server";
import type { User } from "#/features/auth/types/user.type.ts";

export const getSessionFn = createServerFn({ method: "GET" }).handler(
	async (): Promise<User | null> => {
		return await fetchSession();
	},
);

export const signInFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => signInSchema.parse(data))
	.handler(async ({ data }): Promise<User | null> => {
		const result = await loginRequest(data);
		return result.user;
	});

export const signOutFn = createServerFn({ method: "POST" }).handler(
	async () => {
		return await logoutRequest();
	},
);

export const forgotPasswordFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => forgotPasswordSchema.parse(data))
	.handler(async ({ data }) => {
		return await forgotPasswordRequest(data);
	});

export const resetPasswordFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => resetPasswordSchema.parse(data))
	.handler(async ({ data }) => {
		return await resetPasswordRequest(data);
	});

export const changePasswordFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => changePasswordSchema.parse(data))
	.handler(async ({ data }) => {
		return await changePasswordRequest({
			current_password: data.currentPassword,
			password: data.newPassword,
			password_confirmation: data.confirmPassword,
		});
	});

export const sendOtpFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => otpSchema.pick({ email: true }).parse(data))
	.handler(async ({ data }) => {
		return await sendOtpRequest(data.email);
	});

export const verifyOtpFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => otpSchema.parse(data))
	.handler(async ({ data }) => {
		return await verifyOtpRequest(data.email, data.otp);
	});
