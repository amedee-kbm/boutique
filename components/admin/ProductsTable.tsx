'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { deleteProduct, toggleProductVisibility } from '@/lib/actions/products'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

interface Product {
  id: string
  name: string
  price: string
  visible: boolean
  categoryName: string | null
  thumbnail: string | null
}

function VisibilityToggle({ id, visible }: { id: string; visible: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Switch
      checked={visible}
      disabled={isPending}
      onCheckedChange={(checked) => {
        startTransition(async () => {
          await toggleProductVisibility(id, checked)
          toast.success(checked ? 'Product is now visible' : 'Product hidden')
        })
      }}
      aria-label="Toggle visibility"
    />
  )
}

export function ProductsTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-muted-foreground rounded-lg border border-dashed py-12 text-center text-sm">
        No products yet. Add your first product to get started.
      </p>
    )
  }

  return (
    <div className="bg-background rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Visible</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.thumbnail ?? '/placeholder.svg'}
                  alt=""
                  className="bg-muted size-10 rounded-md border object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">
                <Link href={`/admin/products/${product.id}/edit`} className="hover:underline">
                  {product.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground hidden sm:table-cell">
                {product.categoryName ?? 'Uncategorized'}
              </TableCell>
              <TableCell className="text-right font-medium">${product.price}</TableCell>
              <TableCell className="text-center">
                <VisibilityToggle id={product.id} visible={product.visible} />
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit product"
                    render={<Link href={`/admin/products/${product.id}/edit`} />}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <ConfirmDialog
                    title="Delete product?"
                    description="This will permanently remove the product and its images. This cannot be undone."
                    successMessage="Product deleted"
                    onConfirm={async () => {
                      await deleteProduct(product.id)
                    }}
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Delete product">
                        <Trash2 className="text-destructive size-4" />
                      </Button>
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
