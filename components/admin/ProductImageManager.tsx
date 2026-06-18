'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ImagePlus, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import {
  deleteProductImage,
  reorderProductImages,
  uploadProductImage,
} from '@/lib/actions/products'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ProductImage {
  id: string
  url: string
}

function SortableImage({ image, onDelete }: { image: ProductImage; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group bg-muted relative aspect-square overflow-hidden rounded-lg border',
        isDragging && 'ring-ring z-10 opacity-80 ring-2'
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.url} alt="" className="size-full object-cover" />

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="bg-background/80 text-foreground absolute top-1 left-1 flex size-7 touch-none items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100"
      >
        <GripVertical className="size-4" />
      </button>

      <Button
        type="button"
        variant="destructive"
        size="icon-sm"
        onClick={onDelete}
        aria-label="Remove image"
        className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}

export function ProductImageManager({
  productId,
  initialImages,
}: {
  productId: string
  initialImages: ProductImage[]
}) {
  const router = useRouter()
  // Seeded from server props; the parent remounts this component (via key) after
  // router.refresh() so temp ids are replaced with real ones.
  const [images, setImages] = useState(initialImages)
  const [isUploading, startUpload] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } })
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (accepted) => {
      startUpload(async () => {
        for (const file of accepted) {
          const formData = new FormData()
          formData.set('file', file)
          const result = await uploadProductImage(productId, formData)
          if (result.error || !result.url) {
            toast.error(result.error ?? 'Upload failed')
            continue
          }
          // Optimistic: id unknown until refresh, use url as temp key replaced on reload
          setImages((prev) => [...prev, { id: `temp-${result.url}`, url: result.url! }])
        }
        toast.success('Images uploaded')
        router.refresh()
      })
    },
  })

  function handleDelete(id: string) {
    const previous = images
    setImages((prev) => prev.filter((img) => img.id !== id))
    startUpload(async () => {
      if (id.startsWith('temp-')) return
      const result = await deleteProductImage(id)
      if (result.error) {
        toast.error(result.error)
        setImages(previous)
      }
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = images.findIndex((img) => img.id === active.id)
    const newIndex = images.findIndex((img) => img.id === over.id)
    const reordered = arrayMove(images, oldIndex, newIndex)
    setImages(reordered)

    const persistableIds = reordered
      .filter((img) => !img.id.startsWith('temp-'))
      .map((img) => img.id)
    if (persistableIds.length === reordered.length) {
      startUpload(async () => {
        await reorderProductImages(persistableIds)
      })
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragActive ? 'border-ring bg-muted/50' : 'border-input hover:bg-muted/30'
        )}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        ) : (
          <ImagePlus className="text-muted-foreground size-6" />
        )}
        <p className="text-sm font-medium">
          {isDragActive ? 'Drop the photos here' : 'Drag photos here, or tap to choose'}
        </p>
        <p className="text-muted-foreground text-xs">PNG or JPG, multiple allowed</p>
      </div>

      {images.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  onDelete={() => handleDelete(image.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {images.length > 0 && (
        <p className="text-muted-foreground text-xs">
          The first image is the main photo. Drag to reorder.
        </p>
      )}
    </div>
  )
}
