// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/db', () => ({
  db: { insert: vi.fn(), delete: vi.fn(), select: vi.fn() },
}))

import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'
import { variantGroupSchema, variantOptionSchema } from '@/lib/actions/variants.schema'
import {
  addVariantGroup,
  addVariantOption,
  deleteVariantGroup,
  deleteVariantOption,
} from '@/lib/actions/variants'

function chain(result: unknown = undefined) {
  const c: Record<string, ReturnType<typeof vi.fn>> = {}
  for (const m of ['values', 'returning', 'where', 'from', 'orderBy']) c[m] = vi.fn(() => c)
  ;(c as unknown as { then: unknown }).then = (
    onF: (v: unknown) => unknown,
    onR: (e: unknown) => unknown
  ) => Promise.resolve(result).then(onF, onR)
  return c
}

const mockedDb = vi.mocked(db) as unknown as {
  insert: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
  select: ReturnType<typeof vi.fn>
}

beforeEach(() => {
  vi.clearAllMocks()
})

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

describe('addVariantGroup', () => {
  it('rejects an invalid name without touching the db', async () => {
    const result = await addVariantGroup('p1', '')

    expect(result.group).toBeNull()
    expect(result.error).toBeTruthy()
    expect(mockedDb.insert).not.toHaveBeenCalled()
  })

  it('inserts at position 0 when there are no existing groups', async () => {
    mockedDb.select.mockReturnValue(chain([]))
    const insertChain = chain([{ id: 'g1', name: 'Size', position: 0 }])
    mockedDb.insert.mockReturnValue(insertChain)

    const result = await addVariantGroup('p1', 'Size')

    expect(insertChain.values).toHaveBeenCalledWith(
      expect.objectContaining({ productId: 'p1', name: 'Size', position: 0 })
    )
    expect(result.error).toBeNull()
    expect(result.group).toMatchObject({ id: 'g1', name: 'Size', options: [] })
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products/p1/edit')
  })

  it('appends after the last existing group', async () => {
    mockedDb.select.mockReturnValue(chain([{ position: 0 }, { position: 1 }]))
    const insertChain = chain([{ id: 'g3', name: 'Color', position: 2 }])
    mockedDb.insert.mockReturnValue(insertChain)

    await addVariantGroup('p1', 'Color')

    expect(insertChain.values).toHaveBeenCalledWith(expect.objectContaining({ position: 2 }))
  })
})

describe('deleteVariantGroup', () => {
  it('deletes the group and revalidates the edit page', async () => {
    mockedDb.delete.mockReturnValue(chain())

    const result = await deleteVariantGroup('g1', 'p1')

    expect(result).toEqual({ error: null })
    expect(mockedDb.delete).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products/p1/edit')
  })
})

describe('addVariantOption', () => {
  it('rejects an invalid value without touching the db', async () => {
    const result = await addVariantOption('g1', 'p1', '')

    expect(result.option).toBeNull()
    expect(result.error).toBeTruthy()
    expect(mockedDb.insert).not.toHaveBeenCalled()
  })

  it('inserts the option at the next position and returns it', async () => {
    mockedDb.select.mockReturnValue(chain([{ position: 0 }]))
    const insertChain = chain([{ id: 'o2', value: 'L' }])
    mockedDb.insert.mockReturnValue(insertChain)

    const result = await addVariantOption('g1', 'p1', 'L')

    expect(insertChain.values).toHaveBeenCalledWith(
      expect.objectContaining({ groupId: 'g1', value: 'L', position: 1 })
    )
    expect(result).toEqual({ error: null, option: { id: 'o2', value: 'L' } })
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products/p1/edit')
  })
})

describe('deleteVariantOption', () => {
  it('deletes the option and revalidates the edit page', async () => {
    mockedDb.delete.mockReturnValue(chain())

    const result = await deleteVariantOption('o1', 'p1')

    expect(result).toEqual({ error: null })
    expect(mockedDb.delete).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products/p1/edit')
  })
})
