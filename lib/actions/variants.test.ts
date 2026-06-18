// @vitest-environment node

import { describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { variantGroupSchema, variantOptionSchema } from '@/lib/actions/variants'

describe('variantGroupSchema', () => {
  it('accepts a valid group name', () => {
    expect(variantGroupSchema.safeParse({ name: 'Size' }).success).toBe(true)
  })

  it('rejects an empty name', () => {
    expect(variantGroupSchema.safeParse({ name: '' }).success).toBe(false)
  })

  it('rejects a name longer than 50 chars', () => {
    expect(variantGroupSchema.safeParse({ name: 'a'.repeat(51) }).success).toBe(false)
  })
})

describe('variantOptionSchema', () => {
  it('accepts a valid option', () => {
    expect(variantOptionSchema.safeParse({ value: 'M' }).success).toBe(true)
  })

  it('rejects an empty option', () => {
    expect(variantOptionSchema.safeParse({ value: '' }).success).toBe(false)
  })

  it('rejects an option longer than 50 chars', () => {
    expect(variantOptionSchema.safeParse({ value: 'a'.repeat(51) }).success).toBe(false)
  })
})
