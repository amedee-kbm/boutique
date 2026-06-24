'use client'

import { useId, type ComponentProps } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FloatingLabelInputProps extends Omit<ComponentProps<typeof Input>, 'id'> {
  label: string
  helperText?: string
}

export function FloatingLabelInput({
  label,
  helperText,
  className,
  ...inputProps
}: FloatingLabelInputProps) {
  const id = useId()

  return (
    <div className="space-y-1">
      <div className="border-input focus-within:border-ring focus-within:ring-ring/50 rounded-lg border px-3 pt-1.5 pb-1 transition-shadow focus-within:ring-3">
        <label htmlFor={id} className="text-muted-foreground block text-xs">
          {label}
        </label>
        <Input
          id={id}
          className={cn(
            'h-7 rounded-none border-0 px-0 shadow-none focus-visible:border-0 focus-visible:ring-0',
            className
          )}
          {...inputProps}
        />
      </div>
      {helperText && <p className="text-muted-foreground px-1 text-xs">{helperText}</p>}
    </div>
  )
}
