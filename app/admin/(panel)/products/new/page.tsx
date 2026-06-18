import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { getAllCategories } from '@/lib/db/queries'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/admin/ProductForm'

export const metadata: Metadata = { title: 'New product — Zita Boutique' }

export default async function NewProductPage() {
  const categories = await getAllCategories()

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-2" render={<Link href="/admin/products" />}>
        <ArrowLeft className="size-4" />
        Products
      </Button>
      <PageHeader
        title="New product"
        description="Add the details first — you can upload photos right after."
      />
      <ProductForm categories={categories} />
    </>
  )
}
