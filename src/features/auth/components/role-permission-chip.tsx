// #/features/auth/components/role-permission-chip.tsx

'use client'

import { Check } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip.tsx'
import { formatModuleName } from '#/features/auth/hooks/use-permission.ts'

interface PermissionChipProps {
  name: string
  isChecked: boolean
  onToggle: () => void
}

export function RolePermissionChip({
  name,
  isChecked,
  onToggle,
}: PermissionChipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={isChecked}
          className={`group/chip relative inline-flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-lg border text-xs select-none transition-all duration-200 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
            isChecked
              ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30'
              : 'bg-background hover:bg-muted/70 text-muted-foreground border-border hover:border-muted-foreground/30 hover:text-foreground'
          }`}
        >
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
              isChecked
                ? 'bg-primary-foreground text-primary border-primary-foreground'
                : 'border-muted-foreground/40 bg-transparent group-hover/chip:border-muted-foreground/70'
            }`}
          >
            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
          </span>
          <span className="whitespace-nowrap font-medium">
            {formatModuleName(name)}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="font-mono text-xs">
        {name}
      </TooltipContent>
    </Tooltip>
  )
}
