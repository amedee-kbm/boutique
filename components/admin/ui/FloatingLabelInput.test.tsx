import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { FloatingLabelInput } from '@/components/admin/ui/FloatingLabelInput'

describe('FloatingLabelInput', () => {
  it('associates the label with the input', async () => {
    const user = userEvent.setup()
    render(<FloatingLabelInput label="Price" name="price" />)

    const input = screen.getByLabelText('Price')
    await user.type(input, '21.99')
    expect(input).toHaveValue('21.99')
  })

  it('renders helper text', () => {
    render(<FloatingLabelInput label="Cost per item" helperText="Customers won't see this" />)
    expect(screen.getByText("Customers won't see this")).toBeInTheDocument()
  })
})
