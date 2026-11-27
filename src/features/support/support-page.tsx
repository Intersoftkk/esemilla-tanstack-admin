// #/features/support/support-page.tsx
import { LifeBuoy } from 'lucide-react'

import { PageHeader } from '#/components/page-header.tsx'
import { SupportDialogs } from '#/features/support/components/support-dialogs.tsx'
import { SupportPrimaryButtons } from '#/features/support/components/support-primary-buttons.tsx'
import { SupportTable } from '#/features/support/components/support-table.tsx'
import SupportProvider from '#/features/support/context/support-context.tsx'
import type { SupportSearch } from '#/features/support/schema/support-search.schema.ts'
import type { NavigateFn } from '#/hooks/use-table-url-state'

interface SupportPageProps {
    search: SupportSearch
    navigate: NavigateFn
}

/** Support page entry point. */
export default function SupportPage({ search, navigate }: SupportPageProps) {
    return (
        <SupportProvider>
            <SupportPageContent search={search} navigate={navigate} />
        </SupportProvider>
    )
}

/** Page body rendered inside the support provider. */
function SupportPageContent({ search, navigate }: SupportPageProps) {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Support"
                description="Support tickets raised by tenant schools."
                icon={LifeBuoy}
                iconBgClassName="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
                actions={
                    <>
                        <SupportPrimaryButtons />
                    </>
                }
            />

            <SupportTable search={search} navigate={navigate} />

            <SupportDialogs />
        </div>
    )
}
