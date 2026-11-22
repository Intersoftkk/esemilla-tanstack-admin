'use client'

import * as React from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils'

export interface TargetTypeOption<TValue extends string = string> {
  value: TValue
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface TargetTypeFieldProps<TValue extends string = string> {
  value: TValue
  onChange: (value: TValue) => void
  options: Array<TargetTypeOption<TValue>>
  label?: string
  disabled?: boolean
}

/**
 * Segmented selector used to switch the permission matrix between target
 * kinds (e.g. roles vs. users). Controlled — the parent owns the value.
 */
export function TargetTypeField<TValue extends string = string>({
  value,
  onChange,
  options,
  label,
  disabled = false,
}: TargetTypeFieldProps<TValue>) {
  return (
    <Field className="w-full">
      {label && <FieldLabel>{label}</FieldLabel>}

      <div
        role="radiogroup"
        aria-label={label}
        className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl border border-border/60 bg-muted/40 p-1"
      >
        {options.map((option) => {
          const selected = option.value === value
          const Icon = option.icon
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition',
                'disabled:cursor-not-allowed disabled:opacity-50',
                selected
                  ? 'bg-card text-foreground shadow-xs ring-1 ring-border'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-3.5" />
              {option.label}
            </button>
          )
        })}
      </div>
    </Field>
  )
}
