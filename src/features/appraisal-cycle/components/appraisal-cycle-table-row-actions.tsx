import {Edit, EllipsisVertical, Eye} from 'lucide-react';
import type {Row} from '@tanstack/react-table';

import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {PERMISSIONS} from '@/config/permissions.config';
import {PermissionGuard} from '@/components/permission-guard';
import {AppraisalCycleRecord} from "@/features/appraisal-cycle/types/appraisal-cycle";
import {useAppraisalCycle} from "@/features/appraisal-cycle/context/appraisal-cycle-context.tsx";


interface DataTableRowActionsProps {
    row: Row<AppraisalCycleRecord>;
}

export function AppraisalCycleTableRowActions({row}: DataTableRowActionsProps) {

    const {setOpen, setCurrentRow} = useAppraisalCycle()

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex w-8 p-0 data-[state=open]:bg-muted"
                >
                    <EllipsisVertical className="h-4 w-4"/>
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
                {/* View */}
                <PermissionGuard permissions={[PERMISSIONS.ViewPerformanceCycle]}>
                    <DropdownMenuItem
                        className="w-full cursor-pointer"
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen('view')
                        }}
                    >
                        View
                        <DropdownMenuShortcut>
                            <Eye size={16}/>
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </PermissionGuard>

                {/* Edit */}
                <PermissionGuard permissions={[PERMISSIONS.EditPerformanceCycle]}>
                    <DropdownMenuItem
                        className="w-full cursor-pointer"
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen('edit')
                        }}
                    >
                        Edit
                        <DropdownMenuShortcut>
                            <Edit size={16}/>
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </PermissionGuard>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
