import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ListRow } from '@/components/admin/ui/ListRow'

describe('ListRow', () => {
  it('renders title, meta and accent', () => {
    render(<ListRow title="Floral Dress" meta="RWF 5,000 · Dresses" accent="Hidden" />)
    expect(screen.getByText('Floral Dress')).toBeInTheDocument()
    expect(screen.getByText('RWF 5,000 · Dresses')).toBeInTheDocument()
    expect(screen.getByText('Hidden')).toBeInTheDocument()
  })

  it('links the title when href is given', () => {
    render(<ListRow title="Floral Dress" href="/admin/products/p1/edit" />)
    expect(screen.getByRole('link', { name: 'Floral Dress' })).toHaveAttribute(
      'href',
      '/admin/products/p1/edit'
    )
  })

  it('renders trailing actions', () => {
    render(<ListRow title="x" actions={<button>Delete</button>} />)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })
})
