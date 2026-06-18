import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { getAllCategories, getProductById } from '@/lib/db/queries'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductForm } from '@/components/admin/ProductForm'
import { ProductImageManager } from '@/components/admin/ProductImageManager'
import { VariantManager } from '@/components/admin/VariantManager'

export const metadata: Metadata = { title: 'Edit product — Zita Boutique' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([getProductById(id), getAllCategories()])

  if (!product) notFound()

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-2" render={<Link href="/admin/products" />}>
        <ArrowLeft className="size-4" />
        Products
      </Button>
      <PageHeader title={product.name} description="Edit details and manage photos." />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <ProductForm
          categories={categories}
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId,
            visible: product.visible,
          }}
        />

        <div className="space-y-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductImageManager
                key={product.images.map((img) => img.id).join(',')}
                productId={product.id}
                initialImages={product.images.map((img) => ({
                  id: img.id,
                  url: img.url,
                  alt: img.alt,
                }))}
              />
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <VariantManager productId={product.id} initialGroups={product.variantGroups} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
