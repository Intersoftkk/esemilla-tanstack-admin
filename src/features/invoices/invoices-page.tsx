// #/features/invoices/invoices-page.tsx
import { CalendarRange, Sparkles } from 'lucide-react'

import { PageHeader } from '#/components/page-header.tsx'
import { Button } from '#/components/ui/button.tsx'
import { PLATFORM_PERMISSIONS } from '#/config/permissions.config.ts'
import { PermissionGuard } from '#/features/auth/components/permission-guard'
import { InvoicesDialogs } from '#/features/invoices/components/invoices-dialogs.tsx'
import { InvoicesPrimaryButtons } from '#/features/invoices/components/invoices-primary-buttons.tsx'
import { InvoicesTable } from '#/features/invoices/components/invoices-table.tsx'
import InvoicesProvider, {
    useInvoices,
} from '#/features/invoices/context/invoices-context.tsx'
import type { InvoiceSearch } from '#/features/invoices/schema/invoices-search.schema.ts'
import type { NavigateFn } from '#/hooks/use-table-url-state'

interface InvoicesPageProps {
    search: InvoiceSearch
    navigate: NavigateFn
}

/** Invoices page entry point. */
export default function InvoicesPage({ search, navigate }: InvoicesPageProps) {
    return (
        <InvoicesProvider>
            <InvoicesPageContent search={search} navigate={navigate} />
        </InvoicesProvider>
    )
}

/** Page body rendered inside the invoices' provider. */
function InvoicesPageContent({ search, navigate }: InvoicesPageProps) {
    const { setOpen } = useInvoices()

    return (
        <div className="space-y-6">
            <PageHeader
                title="Invoices"
                description="Create and manage tenant invoices and their payment status."
                icon={CalendarRange}
                iconBgClassName="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
                actions={
                    <>
                        <PermissionGuard
                            permissions={[PLATFORM_PERMISSIONS.PlatformInvoiceCreate]}
                        >
                            <InvoicesPrimaryButtons />
                        </PermissionGuard>
                        <PermissionGuard
                            permissions={[PLATFORM_PERMISSIONS.PlatformFeatureView]}
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOpen('feature-manager')}
                            >
                                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                Features
                            </Button>
                        </PermissionGuard>
                    </>
                }
            />

            <InvoicesTable search={search} navigate={navigate} />

            <InvoicesDialogs />
        </div>
    )
}
