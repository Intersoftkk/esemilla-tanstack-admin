// #/features/auth/components/password-strength.tsx
import { Check, X } from "lucide-react";
import { evaluatePassword } from "#/features/auth/utils/password";
import { cn } from "#/lib/utils";

const barClasses = [
	"bg-rose-500",
	"bg-rose-500",
	"bg-amber-500",
	"bg-sky-500",
	"bg-emerald-500",
] as const;

const textClasses = [
	"text-muted-foreground",
	"text-rose-600 dark:text-rose-400",
	"text-amber-600 dark:text-amber-400",
	"text-sky-600 dark:text-sky-400",
	"text-emerald-600 dark:text-emerald-400",
] as const;

interface PasswordStrengthProps {
	password: string;
	/** Hide the per-rule checklist once the password is strong enough. */
	showChecks?: boolean;
	className?: string;
}

/**
 * Four-segment strength meter plus the rule checklist, shared by the
 * reset-password and change-password forms.
 */
export function PasswordStrength({
	password,
	showChecks = true,
	className,
}: PasswordStrengthProps) {
	const strength = evaluatePassword(password);
	const colorIndex = Math.min(strength.score + (password ? 1 : 0), 4);

	return (
		<div className={cn("space-y-2", className)}>
			<div className="flex items-center gap-1.5" aria-hidden="true">
				{([1, 2, 3, 4] as const).map((segment) => (
					<span
						key={segment}
						className={cn(
							"h-1 flex-1 rounded-full transition-colors",
							segment <= strength.score ? barClasses[colorIndex] : "bg-muted",
						)}
					/>
				))}
			</div>

			<p className="text-[11px] text-muted-foreground" aria-live="polite">
				{password ? (
					<>
						Password strength:{" "}
						<span className={cn("font-medium", textClasses[colorIndex])}>
							{strength.label}
						</span>
					</>
				) : (
					"Use 8+ characters with upper and lower case, a number and a symbol."
				)}
			</p>

			{showChecks && password ? (
				<ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
					{strength.checks.map((check) => (
						<li
							key={check.id}
							className={cn(
								"flex items-center gap-1.5 text-[11px]",
								check.passed
									? "text-emerald-600 dark:text-emerald-400"
									: "text-muted-foreground",
							)}
						>
							{check.passed ? (
								<Check className="h-3 w-3 shrink-0" aria-hidden="true" />
							) : (
								<X className="h-3 w-3 shrink-0" aria-hidden="true" />
							)}
							{check.label}
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}
