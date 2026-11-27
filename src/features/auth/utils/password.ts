// #/features/auth/utils/password.ts

export interface PasswordCheck {
	id: "length" | "uppercase" | "lowercase" | "number" | "symbol";
	label: string;
	passed: boolean;
}

export type PasswordScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrength {
	score: PasswordScore;
	label: string;
	checks: Array<PasswordCheck>;
	/** Percentage (0–100) used by the meter bars. */
	percent: number;
}

const LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;

/**
 * Scores a password against the same rule set the auth schemas enforce
 * (`reset-password`, `change-password`) so the meter and the
 * server-side validation never disagree.
 */
export function evaluatePassword(password: string): PasswordStrength {
	const checks: Array<PasswordCheck> = [
		{
			id: "length",
			label: "At least 8 characters",
			passed: password.length >= 8,
		},
		{
			id: "uppercase",
			label: "One uppercase letter",
			passed: /[A-Z]/.test(password),
		},
		{
			id: "lowercase",
			label: "One lowercase letter",
			passed: /[a-z]/.test(password),
		},
		{ id: "number", label: "One number", passed: /[0-9]/.test(password) },
		{
			id: "symbol",
			label: "One symbol",
			passed: /[^A-Za-z0-9]/.test(password),
		},
	];

	const passed = checks.filter((check) => check.passed).length;
	const score = (password.length === 0 ? 0 : passed) as PasswordScore;

	return {
		score,
		label: LABELS[score],
		checks,
		percent: (score / 4) * 100,
	};
}
