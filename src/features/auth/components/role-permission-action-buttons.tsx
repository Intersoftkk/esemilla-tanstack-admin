// #/features/auth/components/role-permission-action-buttons.tsx

'use client'

import { Check, CheckCircle2, Loader2, X } from 'lucide-react'
import { Button } from '#/components/ui/button.tsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx'

interface ActionButtonsProps {
  onSelectAll: () => void
  onClearAll: () => void
  isSaving: boolean
  disabled: boolean
}

export function RolePermissionActionButtons({
  onSelectAll,
  onClearAll,
  isSaving,
  disabled,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            disabled={disabled}
            className="gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            Select All
          </Button>
        </TooltipTrigger>
        <TooltipContent>Grant all permissions</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearAll}
            disabled={disabled}
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/5"
          >
            <X className="h-3.5 w-3.5" />
            Clear All
          </Button>
        </TooltipTrigger>
        <TooltipContent>Revoke all permissions</TooltipContent>
      </Tooltip>

      <Button
        type="submit"
        size="sm"
        disabled={disabled}
        className="gap-1.5 shadow-md shadow-primary/20"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  )
}
