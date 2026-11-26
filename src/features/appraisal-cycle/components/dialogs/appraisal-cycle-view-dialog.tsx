'use client'

import { Eye } from 'lucide-react'
import { format } from 'date-fns'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import type { AppraisalCycleRecord } from '@/features/appraisal-cycle/types/appraisal-cycle'

interface Props {
    currentRow: AppraisalCycleRecord | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AppraisalCycleViewDialog({ currentRow, open, onOpenChange }: Props) {
    if (!currentRow) return null

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">Active</Badge>
            case 'completed':
                return <Badge>Completed</Badge>
            case 'archived':
                return <Badge variant="secondary">Archived</Badge>
            default:
                return <Badge variant="outline">Draft</Badge>
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <Eye className="h-5 w-5" />
                        Appraisal Cycle Details
                    </DialogTitle>
                    <DialogDescription>View complete information about this appraisal cycle.</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">CYCLE NAME</p>
                            <p className="text-lg font-semibold">{currentRow.name}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">COMPANY</p>
                            <p className="font-medium">{currentRow.company?.name || '—'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">START DATE</p>
                                <p className="font-medium">
                                    {currentRow.start_date ? format(new Date(currentRow.start_date), 'dd MMM yyyy') : '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">END DATE</p>
                                <p className="font-medium">
                                    {currentRow.end_date ? format(new Date(currentRow.end_date), 'dd MMM yyyy') : '—'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">STATUS</p>
                            {getStatusBadge(currentRow.status)}
                        </div>
                    </div>

                    {/* Description */}
                    {currentRow.description && (
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">DESCRIPTION</p>
                            <p className="text-sm leading-relaxed text-foreground">
                                {currentRow.description}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
