import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FilterChips } from '@/components/admin/ui/FilterChips'

const options = [
  { value: 'all', label: 'All' },
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
]

describe('FilterChips', () => {
  it('marks the active option as pressed', () => {
    render(<FilterChips options={options} value="visible" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Visible' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('reports the chosen option', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<FilterChips options={options} value="all" onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Hidden' }))
    expect(onChange).toHaveBeenCalledWith('hidden')
  })
})
