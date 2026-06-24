import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { EditorHeader } from '@/components/admin/ui/EditorHeader'

describe('EditorHeader', () => {
  it('renders the title and the cancel/save actions', () => {
    render(<EditorHeader title="New product" saveType="button" />)
    expect(screen.getByText('New product')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('calls onCancel and onSave', async () => {
    const onCancel = vi.fn()
    const onSave = vi.fn()
    const user = userEvent.setup()
    render(<EditorHeader title="t" saveType="button" onCancel={onCancel} onSave={onSave} />)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it('shows a saving state and disables save', () => {
    render(<EditorHeader title="t" saveType="button" saving />)
    const save = screen.getByRole('button', { name: /saving/i })
    expect(save).toBeDisabled()
  })

  it('prefers the center slot over the title', () => {
    render(<EditorHeader title="hidden" center={<span>Active</span>} saveType="button" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.queryByText('hidden')).not.toBeInTheDocument()
  })
})
