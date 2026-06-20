import { z } from 'zod'

export const variantGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(50),
})

export const variantOptionSchema = z.object({
  value: z.string().min(1, 'Option is required').max(50),
})
