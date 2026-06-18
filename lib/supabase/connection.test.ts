// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { createAdminClient } from './admin'

describe('Supabase connection', () => {
  it('env vars are present', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeTruthy()
    expect(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBeTruthy()
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBeTruthy()
    expect(process.env.DATABASE_URL).toBeTruthy()
  })

  it('service role key is valid and can reach Supabase', async () => {
    const supabase = createAdminClient()
    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1 })
    expect(error).toBeNull()
    expect(data).toBeDefined()
  })
})
