// #/features/support/components/support-primary-buttons.tsx
import { Plus } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useSupport } from "#/features/support/context/support-context.tsx";

/** Primary action button for creating a support. */
export function SupportPrimaryButtons() {
	const { setOpen } = useSupport();

	return (
		<div className="flex gap-2">
			<Button className="space-x-1" onClick={() => setOpen("add")}>
				<span>Create Support</span>
				<Plus size={18} />
			</Button>
		</div>
	);
}
