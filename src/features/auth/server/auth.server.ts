import type { SignInFormData } from "#/features/auth/schema/sign-in.schema.ts";
import type { AuthSession } from "#/features/auth/types/auth.type";
import type { User } from "#/features/auth/types/user.type.ts";
import { getAppSession } from "#/features/auth/utils/session.ts";
import { API_URL } from "#/server/api.server.ts";

/**
 * Fetch currently authenticated user using session token
 */
export async function fetchSession(): Promise<User | null> {
	const session = await getAppSession();
	const token = session.token;

	if (!token) {
		return null;
	}

	try {
		const res = await fetch(`${API_URL}/admin/me`, {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.status === 401) {
			session.destroy();
			return null;
		}

		if (!res.ok) {
			return null;
		}

		const result = await res.json();

		return result.data ?? result.user ?? null;
	} catch {
		return null;
	}
}

/**
 * Login user and update HTTP-only session cookie
 */
export async function loginRequest(
	credentials: SignInFormData,
): Promise<AuthSession> {
	const res = await fetch(`${API_URL}/admin/login`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: credentials.email,
			password: credentials.password,
			device_name: "web",
		}),
	});

	const result = await res.json();

	if (!res.ok) {
		const error: any = new Error(result.message);
		error.errors = result.errors;
		error.status = res.status;
		throw error;
	}

	const session = await getAppSession();
	session.token = result.data.token;
	session.userId = result.data.user.id;
	await session.save();

	return result.data;
}

/**
 * Send password reset link
 */
export async function forgotPasswordRequest(payload: unknown) {
	const res = await fetch(`${API_URL}/user/forgot-password`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const result = await res.json();

	if (!res.ok) {
		const error: any = new Error(result.message);
		error.errors = result.errors;
		error.status = res.status;
		throw error;
	}

	return result.data ?? result;
}

/**
 * Send OTP Code
 */
export async function sendOtpRequest(email: string) {
	const res = await fetch(`${API_URL}/user/send-otp`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email }),
	});

	const result = await res.json();

	if (!res.ok) {
		const error: any = new Error(result.message);
		error.errors = result.errors;
		error.status = res.status;
		throw error;
	}

	return result.data ?? result;
}

/**
 * Verify OTP Code
 */
export async function verifyOtpRequest(email: string, otp: string) {
	const res = await fetch(`${API_URL}/user/verify-otp`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, otp }),
	});

	const result = await res.json();

	if (!res.ok) {
		const error: any = new Error(result.message);
		error.errors = result.errors;
		error.status = res.status;
		throw error;
	}

	return result.data ?? result;
}

/**
 * Reset Password with Token / OTP
 */
export async function resetPasswordRequest(payload: unknown) {
	const res = await fetch(`${API_URL}/user/reset-password`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const result = await res.json();

	if (!res.ok) {
		const error: any = new Error(result.message);
		error.errors = result.errors;
		error.status = res.status;
		throw error;
	}

	return result.data ?? result;
}

/**
 * Logout user and clear session
 */
export async function logoutRequest() {
	const session = await getAppSession();
	try {
		if (session.token) {
			// Revoke the backend token when reachable, but always clear the local
			// session even if the API is unavailable.
			await fetch(`${API_URL}/admin/logout`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${session.token}`,
				},
			}).catch(() => undefined);
		}
	} finally {
		await session.destroy();
	}

	return { success: true };
}

/**
 * Change the signed-in user's password
 */
export async function changePasswordRequest(payload: {
	current_password: string;
	password: string;
	password_confirmation: string;
}) {
	const session = await getAppSession();

	const res = await fetch(`${API_URL}/user/change-password`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
		},
		body: JSON.stringify(payload),
	});

	const result = await res.json();

	if (!res.ok) {
		const error: any = new Error(
			result.message ?? "Password change failed. Please try again.",
		);
		error.errors = result.errors;
		error.status = res.status;
		throw error;
	}

	return result.data ?? result;
}
