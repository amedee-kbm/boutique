import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { getAllProducts } from '@/lib/db/queries'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { ProductsTable } from '@/components/admin/ProductsTable'

export const metadata: Metadata = { title: 'Products — Zita Boutique' }

export default async function ProductsPage() {
  const products = await getAllProducts()

  return (
    <>
      <PageHeader
        title="Products"
        description="Everything you sell, in one place."
        action={
          <Button render={<Link href="/admin/products/new" />}>
            <Plus className="size-4" />
            Add product
          </Button>
        }
      />
      <ProductsTable products={products} />
    </>
  )
}
