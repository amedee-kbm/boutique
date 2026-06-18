import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="bg-muted/40 min-h-svh">
      <AdminSidebar userEmail={user.email ?? 'Admin'} />
      <main className="pb-20 md:pb-0 md:pl-60">
        <div className="mx-auto max-w-6xl p-4 md:p-8">{children}</div>
      </main>
      <AdminMobileNav />
    </div>
  )
}
