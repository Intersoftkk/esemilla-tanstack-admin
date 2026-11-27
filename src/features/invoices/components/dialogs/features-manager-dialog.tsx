// #/features/invoices/components/dialogs/features-manager-dialog.tsx
import { useState } from 'react'
import { Loader, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react'

import { ConfirmDialog } from '#/components/confirm-dialog.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '#/components/ui/dialog.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Skeleton } from '#/components/ui/skeleton.tsx'
import { PLATFORM_PERMISSIONS } from '#/config/permissions.config.ts'
import { PermissionGuard } from '#/features/auth/components/permission-guard.tsx'
import {
    useCreateFeatureMutation,
    useDeleteFeatureMutation,
    useFeaturesQuery,
    useUpdateFeatureMutation,
} from '#/features/invoices/queries/invoice.queries.ts'
import type { FeatureRecord } from '#/features/invoices/types/features.ts'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Dialog for managing the shared feature catalog used by invoices. */
export function FeaturesManagerDialog({ open, onOpenChange }: Props) {
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [description, setDescription] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValues, setEditValues] = useState({
        name: '',
        code: '',
        description: '',
    })
    const [deleteTarget, setDeleteTarget] = useState<FeatureRecord | null>(null)

    const featuresQuery = useFeaturesQuery(open)

    const createMutation = useCreateFeatureMutation({
        onSuccess: () => {
            setName('')
            setCode('')
            setDescription('')
        },
    })
    const updateMutation = useUpdateFeatureMutation({
        onSuccess: () => setEditingId(null),
    })
    const deleteMutation = useDeleteFeatureMutation({
        onSuccess: () => setDeleteTarget(null),
    })

    const startEditing = (feature: FeatureRecord) => {
        setEditingId(feature.id)
        setEditValues({
            name: feature.name,
            code: feature.code ?? '',
            description: feature.description ?? '',
        })
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader className="text-left">
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            Feature catalog
                        </DialogTitle>
                        <DialogDescription>
                            Create and maintain the features that can be
                            attached to invoices.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <PermissionGuard
                            permissions={[PLATFORM_PERMISSIONS.PlatformFeatureCreate]}
                        >
                            <div className="grid gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-[1fr_1fr_auto]">
                                <Input
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Feature name"
                                    aria-label="Feature name"
                                />
                                <Input
                                    value={code}
                                    onChange={(event) =>
                                        setCode(event.target.value)
                                    }
                                    placeholder="Code (optional)"
                                    aria-label="Feature code"
                                />
                                <Button
                                    size="sm"
                                    disabled={
                                        !name.trim() || createMutation.isPending
                                    }
                                    onClick={() =>
                                        createMutation.mutate({
                                            name: name.trim(),
                                            code: code.trim() || undefined,
                                            description:
                                                description.trim() || undefined,
                                        })
                                    }
                                >
                                    {createMutation.isPending ? (
                                        <Loader className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                                    )}
                                    Add
                                </Button>
                                <Input
                                    className="sm:col-span-3"
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    placeholder="Description (optional)"
                                    aria-label="Feature description"
                                />
                            </div>
                        </PermissionGuard>

                        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                            {featuresQuery.isLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map((slot) => (
                                        <Skeleton
                                            key={`feature-row-${slot}`}
                                            className="h-14 w-full rounded-lg"
                                        />
                                    ))}
                                </div>
                            ) : featuresQuery.data?.length ? (
                                featuresQuery.data.map((feature) => (
                                    <div
                                        key={feature.id}
                                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                                    >
                                        {editingId === feature.id ? (
                                            <div className="flex w-full flex-wrap gap-2">
                                                <Input
                                                    value={editValues.name}
                                                    onChange={(event) =>
                                                        setEditValues((prev) => ({
                                                            ...prev,
                                                            name: event.target
                                                                .value,
                                                        }))
                                                    }
                                                    aria-label="Feature name"
                                                />
                                                <Input
                                                    value={editValues.code}
                                                    onChange={(event) =>
                                                        setEditValues((prev) => ({
                                                            ...prev,
                                                            code: event.target
                                                                .value,
                                                        }))
                                                    }
                                                    placeholder="Code"
                                                    aria-label="Feature code"
                                                />
                                                <Input
                                                    className="w-full"
                                                    value={
                                                        editValues.description
                                                    }
                                                    onChange={(event) =>
                                                        setEditValues((prev) => ({
                                                            ...prev,
                                                            description:
                                                                event.target
                                                                    .value,
                                                        }))
                                                    }
                                                    placeholder="Description"
                                                    aria-label="Feature description"
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        disabled={
                                                            !editValues.name.trim() ||
                                                            updateMutation.isPending
                                                        }
                                                        onClick={() =>
                                                            updateMutation.mutate({
                                                                id: feature.id,
                                                                payload: {
                                                                    name: editValues.name.trim(),
                                                                    code:
                                                                        editValues.code.trim() ||
                                                                        undefined,
                                                                    description:
                                                                        editValues.description.trim() ||
                                                                        undefined,
                                                                },
                                                            })
                                                        }
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            setEditingId(null)
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium">
                                                        {feature.name}
                                                        {feature.code && (
                                                            <code className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                                                                {feature.code}
                                                            </code>
                                                        )}
                                                    </p>
                                                    {feature.description && (
                                                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                            {feature.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    <PermissionGuard
                                                        permissions={[
                                                            PLATFORM_PERMISSIONS.PlatformFeatureEdit,
                                                        ]}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                startEditing(
                                                                    feature,
                                                                )
                                                            }
                                                            aria-label={`Edit ${feature.name}`}
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </PermissionGuard>
                                                    <PermissionGuard
                                                        permissions={[
                                                            PLATFORM_PERMISSIONS.PlatformFeatureDelete,
                                                        ]}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    feature,
                                                                )
                                                            }
                                                            aria-label={`Delete ${feature.name}`}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </PermissionGuard>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No features yet. Add one above to get
                                    started.
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) setDeleteTarget(null)
                }}
                handleConfirm={() => {
                    if (deleteTarget) deleteMutation.mutate(deleteTarget.id)
                }}
                isLoading={deleteMutation.isPending}
                title="Delete feature"
                desc={`Delete "${deleteTarget?.name}"? Invoices using this feature will no longer have it.`}
                confirmText="Delete"
                destructive
            />
        </>
    )
}
