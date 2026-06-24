import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FieldRow } from '@/components/admin/ui/FieldRow'

describe('FieldRow', () => {
  it('renders the empty affordance when there is no value', () => {
    render(<FieldRow label="description" emptyLabel="Add description" />)
    expect(screen.getByRole('button', { name: /add description/i })).toBeInTheDocument()
  })

  it('renders the label and value when filled', () => {
    render(<FieldRow label="Category" value="Dresses" />)
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Dresses')).toBeInTheDocument()
  })

  it('calls onClick when tapped', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<FieldRow label="Price" onClick={onClick} />)

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
