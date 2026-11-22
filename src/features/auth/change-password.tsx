import { KeyRound } from "lucide-react";

import { PageHeader } from "#/components/page-header";
import { ChangePasswordForm } from "#/features/auth/components/change-password-form";

export function ChangePasswordPage() {
	return (
		<div className="mx-auto flex w-full max-w-[560px] flex-col gap-4 sm:gap-5">
			<PageHeader
				title="Change password"
				description="Use a strong password you don't reuse anywhere else."
				icon={KeyRound}
			/>

			<section className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-6">
				<ChangePasswordForm />
			</section>
		</div>
	);
}
