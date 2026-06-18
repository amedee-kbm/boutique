import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/actions/variants', () => ({
  addVariantGroup: vi.fn(),
  addVariantOption: vi.fn(),
  deleteVariantGroup: vi.fn(),
  deleteVariantOption: vi.fn(),
}))

import { VariantManager } from '@/components/admin/VariantManager'

const groups = [
  {
    id: 'g1',
    name: 'Size',
    options: [
      { id: 'o1', value: 'S' },
      { id: 'o2', value: 'M' },
    ],
  },
]

describe('VariantManager', () => {
  it('prompts to add a group when there are none', () => {
    render(<VariantManager productId="p1" initialGroups={[]} />)
    expect(screen.getByText(/no variants yet/i)).toBeInTheDocument()
  })

  it('renders existing groups and their options', () => {
    render(<VariantManager productId="p1" initialGroups={groups} />)
    expect(screen.getByText('Size')).toBeInTheDocument()
    expect(screen.getByText('S')).toBeInTheDocument()
    expect(screen.getByText('M')).toBeInTheDocument()
  })

  it('exposes a delete control for each group', () => {
    render(<VariantManager productId="p1" initialGroups={groups} />)
    expect(screen.getByRole('button', { name: /delete size group/i })).toBeInTheDocument()
  })
})
