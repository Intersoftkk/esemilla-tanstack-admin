// #/features/payments/components/payments-primary-buttons.tsx
import { Plus } from "lucide-react";
import { Button } from "#/components/ui/button";
import { usePayments } from "#/features/payments/context/payments-context.tsx";

/** Primary action button for creating a payment. */
export function PaymentsPrimaryButtons() {
	const { setOpen } = usePayments();

	return (
		<div className="flex gap-2">
			<Button className="space-x-1" onClick={() => setOpen("add")}>
				<span>Create Payment</span>
				<Plus size={18} />
			</Button>
		</div>
	);
}
