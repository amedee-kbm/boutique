'use client'

import { useState, useTransition } from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'

import {
  addVariantGroup,
  addVariantOption,
  deleteVariantGroup,
  deleteVariantOption,
} from '@/lib/actions/variants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface VariantOption {
  id: string
  value: string
}

interface VariantGroup {
  id: string
  name: string
  options: VariantOption[]
}

function OptionInput({ onAdd }: { onAdd: (value: string) => void }) {
  const [value, setValue] = useState('')

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="flex items-center gap-2"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add an option (e.g. M)"
        className="h-7"
      />
      <Button type="submit" size="icon-sm" variant="outline" aria-label="Add option">
        <Plus className="size-4" />
      </Button>
    </form>
  )
}

export function VariantManager({
  productId,
  initialGroups,
}: {
  productId: string
  initialGroups: VariantGroup[]
}) {
  const [groups, setGroups] = useState<VariantGroup[]>(initialGroups)
  const [newGroup, setNewGroup] = useState('')
  const [, startTransition] = useTransition()

  function handleAddGroup() {
    const name = newGroup.trim()
    if (!name) return
    setNewGroup('')
    startTransition(async () => {
      const result = await addVariantGroup(productId, name)
      if (result.error || !result.group) {
        toast.error(result.error ?? 'Could not add group')
        return
      }
      setGroups((prev) => [...prev, result.group])
    })
  }

  function handleDeleteGroup(id: string) {
    const previous = groups
    setGroups((prev) => prev.filter((g) => g.id !== id))
    startTransition(async () => {
      const result = await deleteVariantGroup(id, productId)
      if (result.error) {
        toast.error(result.error)
        setGroups(previous)
      }
    })
  }

  function handleAddOption(groupId: string, value: string) {
    startTransition(async () => {
      const result = await addVariantOption(groupId, productId, value)
      if (result.error || !result.option) {
        toast.error(result.error ?? 'Could not add option')
        return
      }
      const option = result.option
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, options: [...g.options, option] } : g))
      )
    })
  }

  function handleDeleteOption(groupId: string, optionId: string) {
    const previous = groups
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, options: g.options.filter((o) => o.id !== optionId) } : g
      )
    )
    startTransition(async () => {
      const result = await deleteVariantOption(optionId, productId)
      if (result.error) {
        toast.error(result.error)
        setGroups(previous)
      }
    })
  }

  return (
    <div className="space-y-4">
      {groups.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No variants yet. Add a group like “Size” or “Color”, then list its options.
        </p>
      )}

      {groups.map((group) => (
        <div key={group.id} className="space-y-2 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{group.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => handleDeleteGroup(group.id)}
              aria-label={`Delete ${group.name} group`}
            >
              <X className="text-destructive size-4" />
            </Button>
          </div>

          {group.options.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {group.options.map((option) => (
                <Badge key={option.id} variant="secondary" className="gap-1 pr-1">
                  {option.value}
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(group.id, option.id)}
                    aria-label={`Remove ${option.value}`}
                    className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <OptionInput onAdd={(value) => handleAddOption(group.id, value)} />
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleAddGroup()
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="New group (e.g. Size)"
        />
        <Button type="submit" variant="outline" size="sm" aria-label="Add group">
          <Plus className="size-4" />
          Group
        </Button>
      </form>
    </div>
  )
}
