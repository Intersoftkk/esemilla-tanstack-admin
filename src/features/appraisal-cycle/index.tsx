import {AppraisalCyclePrimaryButtons} from '@/features/appraisal-cycle/components/appraisal-cycle-primary-buttons'
import {AppraisalCycleTable} from '@/features/appraisal-cycle/components/appraisal-cycle-table'
import AppraisalCycleProvider from '@/features/appraisal-cycle/context/appraisal-cycle-context'
import {AppraisalCycleDialogs} from '@/features/appraisal-cycle/components/appraisal-cycle-dialogs'
import {NavigateFn} from '@/hooks/use-table-url-state'
import {PERMISSIONS} from '@/config/permissions.config'
import {PermissionGuard} from '@/components/permission-guard'
import {AppraisalCycleSearch} from './schema/appraisal-cycle-search.schema'

interface AppraisalCyclePageProps {
    search: AppraisalCycleSearch
    navigate: NavigateFn
}

export default function AppraisalCycleIndex({
                                                search,
                                                navigate,
                                            }: AppraisalCyclePageProps) {
    return (
        <AppraisalCycleProvider>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Appraisal Cycle
                    </h2>
                    <p className="text-muted-foreground">
                        Manage your appraisal cycles.
                    </p>
                </div>

                <PermissionGuard permissions={[PERMISSIONS.CreatePerformanceCycle]}>
                    <AppraisalCyclePrimaryButtons/>
                </PermissionGuard>
            </div>

            <div className="flex-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <AppraisalCycleTable search={search} navigate={navigate}/>
            </div>

            <AppraisalCycleDialogs/>
        </AppraisalCycleProvider>
    )
}
