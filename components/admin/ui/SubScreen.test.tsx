import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SubScreen } from '@/components/admin/ui/SubScreen'

describe('SubScreen', () => {
  it('shows the title, subtitle and body when open', () => {
    render(
      <SubScreen open title="Description" subtitle="Sample">
        <p>body content</p>
      </SubScreen>
    )
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Sample')).toBeInTheDocument()
    expect(screen.getByText('body content')).toBeInTheDocument()
  })

  it('calls onSave and closes when the save action is used', async () => {
    const onSave = vi.fn()
    const onOpenChange = vi.fn()
    const user = userEvent.setup()
    render(
      <SubScreen open title="Price" saveLabel="Done" onSave={onSave} onOpenChange={onOpenChange}>
        <span>x</span>
      </SubScreen>
    )

    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(onSave).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(onOpenChange).toHaveBeenCalled())
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false)
  })

  it('closes via the dismiss button', async () => {
    const onOpenChange = vi.fn()
    const user = userEvent.setup()
    render(
      <SubScreen open title="Price" onOpenChange={onOpenChange}>
        <span>x</span>
      </SubScreen>
    )

    await user.click(screen.getByRole('button', { name: /close/i }))
    await waitFor(() => expect(onOpenChange).toHaveBeenCalled())
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false)
  })
})
