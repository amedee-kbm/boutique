import type { Metadata } from 'next'

import { getAllCategories } from '@/lib/db/queries'
import { PageHeader } from '@/components/admin/PageHeader'
import { CategoryDialog } from '@/components/admin/CategoryDialog'
import { CategoriesTable } from '@/components/admin/CategoriesTable'

export const metadata: Metadata = { title: 'Categories — Zita Boutique' }

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <>
      <PageHeader
        title="Categories"
        description="Group your products so customers can browse."
        action={<CategoryDialog />}
      />
      <CategoriesTable categories={categories} />
    </>
  )
}
