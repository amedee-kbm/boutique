import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SectionCard } from '@/components/admin/ui/SectionCard'

describe('SectionCard', () => {
  it('renders the label, action and children', () => {
    render(
      <SectionCard label="Media" action={<button>Edit</button>}>
        <p>content</p>
      </SectionCard>
    )
    expect(screen.getByRole('heading', { name: 'Media' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders without a label', () => {
    render(
      <SectionCard>
        <p>bare</p>
      </SectionCard>
    )
    expect(screen.getByText('bare')).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
