// #/features/subscriptions/components/dialogs/subscriptions-features-dialog.tsx
import { useEffect, useMemo, useState } from 'react'
import { Loader, Settings2 } from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import { Checkbox } from '#/components/ui/checkbox.tsx'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '#/components/ui/dialog.tsx'
import { Skeleton } from '#/components/ui/skeleton.tsx'
import { PLATFORM_PERMISSIONS } from '#/config/permissions.config.ts'
import { PermissionGuard } from '#/features/auth/components/permission-guard.tsx'
import {
    useAttachSubscriptionFeaturesMutation,
    useFeaturesQuery,
    useSubscriptionFeaturesQuery,
    useSyncSubscriptionFeaturesMutation,
} from '#/features/subscriptions/queries/subscription.queries.ts'
import type { SubscriptionRecord } from '#/features/subscriptions/types/subscriptions.type.ts'

interface Props {
    currentRow: SubscriptionRecord | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Dialog for attaching or synchronizing a subscription's features. */
export function SubscriptionsFeaturesDialog({ currentRow, open, onOpenChange }: Props) {
    const [selected, setSelected] = useState<string[]>([])
    const subscriptionId = currentRow?.id

    const featuresQuery = useFeaturesQuery()
    const assignedQuery = useSubscriptionFeaturesQuery(subscriptionId, open && Boolean(subscriptionId))

    const assignedIds = useMemo(
        () => (assignedQuery.data ?? []).map((feature) => feature.id),
        [assignedQuery.data],
    )

    useEffect(() => {
        if (open) setSelected(assignedIds)
    }, [open, assignedIds])

    const closeDialog = () => {
        setSelected([])
        onOpenChange(false)
    }

    const attachMutation = useAttachSubscriptionFeaturesMutation({
        onSuccess: closeDialog,
    })
    const syncMutation = useSyncSubscriptionFeaturesMutation({
        onSuccess: closeDialog,
    })
    const isPending = attachMutation.isPending || syncMutation.isPending

    if (!currentRow) return null

    const toggleFeature = (id: string, checked: boolean) => {
        setSelected((current) =>
            checked ? [...current, id] : current.filter((item) => item !== id),
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5" />
                        Subscription Features
                    </DialogTitle>
                    <DialogDescription>
                        Attach additional features or synchronize the subscription with
                        exactly the selected features.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-80 space-y-1 overflow-y-auto rounded-md border p-3">
                    {featuresQuery.isLoading || assignedQuery.isLoading ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map((slot) => (
                                <Skeleton
                                    key={`feature-skeleton-${slot}`}
                                    className="h-9 w-full"
                                />
                            ))}
                        </div>
                    ) : featuresQuery.data?.length ? (
                        featuresQuery.data.map((feature) => (
                            <label
                                key={feature.id}
                                className="flex cursor-pointer items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted"
                            >
                                <Checkbox
                                    checked={selected.includes(feature.id)}
                                    onCheckedChange={(checked) =>
                                        toggleFeature(feature.id, Boolean(checked))
                                    }
                                    className="mt-0.5"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">
                                        {feature.name}
                                    </p>
                                    {feature.description && (
                                        <p className="text-xs text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    )}
                                </div>
                            </label>
                        ))
                    ) : (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            No features available.
                        </p>
                    )}
                </div>

                <DialogFooter className="gap-y-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <PermissionGuard
                        permissions={[PLATFORM_PERMISSIONS.PlatformSubscriptionEdit]}
                    >
                        <Button
                            variant="outline"
                            disabled={isPending || selected.length === 0}
                            onClick={() =>
                                attachMutation.mutate({
                                    id: subscriptionId as string,
                                    featureIds: selected,
                                })
                            }
                        >
                            Attach
                        </Button>
                        <Button
                            disabled={isPending}
                            onClick={() =>
                                syncMutation.mutate({
                                    id: subscriptionId as string,
                                    featureIds: selected,
                                })
                            }
                        >
                            {isPending && (
                                <Loader className="mr-1.5 h-4 w-4 animate-spin" />
                            )}
                            Sync
                        </Button>
                    </PermissionGuard>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
