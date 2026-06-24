import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { MediaZone } from '@/components/admin/ui/MediaZone'

beforeAll(() => {
  let n = 0
  globalThis.URL.createObjectURL = vi.fn(() => `blob:preview-${n++}`)
  globalThis.URL.revokeObjectURL = vi.fn()
})

beforeEach(() => {
  vi.clearAllMocks()
})

function pngFile(name: string) {
  return new File(['x'], name, { type: 'image/png' })
}

describe('MediaZone', () => {
  it('renders the upload prompt', () => {
    render(<MediaZone />)
    expect(screen.getByText('Add images')).toBeInTheDocument()
  })

  it('stages dropped files and reports them through onChange', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    const { container } = render(<MediaZone onChange={onChange} />)

    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, pngFile('a.png'))

    await waitFor(() => expect(screen.getByLabelText('Remove image')).toBeInTheDocument())
    expect(onChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'a.png' })])
  })

  it('removes a staged file', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    const { container } = render(<MediaZone onChange={onChange} />)

    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, pngFile('a.png'))
    await waitFor(() => expect(screen.getByLabelText('Remove image')).toBeInTheDocument())

    await user.click(screen.getByLabelText('Remove image'))
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith([]))
  })
})
