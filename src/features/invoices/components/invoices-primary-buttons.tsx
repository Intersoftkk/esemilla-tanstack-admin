// #/features/invoices/components/invoices-primary-buttons.tsx
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useInvoices } from '#/features/invoices/context/invoices-context.tsx'

/** Primary action button for creating an invoice. */
export function InvoicesPrimaryButtons() {
    const { setOpen } = useInvoices()

    return (
        <div className="flex gap-2">
            <Button className="space-x-1" onClick={() => setOpen('add')}>
                <span>Create Invoice</span>
                <Plus size={18} />
            </Button>
        </div>
    )
}
