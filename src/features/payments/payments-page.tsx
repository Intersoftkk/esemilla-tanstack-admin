// #/features/payments/payments-page.tsx
import { Wallet } from 'lucide-react'

import { PageHeader } from '#/components/page-header.tsx'
import { PLATFORM_PERMISSIONS } from '#/config/permissions.config.ts'
import { PermissionGuard } from '#/features/auth/components/permission-guard'
import { PaymentsDialogs } from '#/features/payments/components/payments-dialogs.tsx'
import { PaymentsPrimaryButtons } from '#/features/payments/components/payments-primary-buttons.tsx'
import { PaymentsTable } from '#/features/payments/components/payments-table.tsx'
import PaymentsProvider from '#/features/payments/context/payments-context.tsx'
import type { PaymentSearch } from '#/features/payments/schema/payments-search.schema.ts'
import type { NavigateFn } from '#/hooks/use-table-url-state'

interface PaymentsPageProps {
    search: PaymentSearch
    navigate: NavigateFn
}

/** Payments page entry point. */
export default function PaymentsPage({ search, navigate }: PaymentsPageProps) {
    return (
        <PaymentsProvider>
            <PaymentsPageContent search={search} navigate={navigate} />
        </PaymentsProvider>
    )
}

/** Page body rendered inside the payments' provider. */
function PaymentsPageContent({ search, navigate }: PaymentsPageProps) {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Payments"
                description="Track tenant payments, settlements and failed charges."
                icon={Wallet}
                iconBgClassName="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
                actions={
                    <>
                        <PermissionGuard
                            permissions={[PLATFORM_PERMISSIONS.PlatformPaymentCreate]}
                        >
                            <PaymentsPrimaryButtons />
                        </PermissionGuard>
                    </>
                }
            />

            <PaymentsTable search={search} navigate={navigate} />

            <PaymentsDialogs />
        </div>
    )
}
