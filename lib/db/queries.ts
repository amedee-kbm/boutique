import { asc, count, desc, eq, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import { categories, chatMessages, chatSessions, productImages, products } from '@/lib/db/schema'

export async function getDashboardStats() {
  const [productResult, categoryResult, chatResult] = await Promise.all([
    db.select({ count: count() }).from(products),
    db.select({ count: count() }).from(categories),
    db.select({ count: count() }).from(chatSessions),
  ])

  return {
    productCount: productResult[0].count,
    categoryCount: categoryResult[0].count,
    chatCount: chatResult[0].count,
  }
}

export async function getRecentProducts(limit = 5) {
  return db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      visible: products.visible,
      createdAt: products.createdAt,
      categoryName: categories.name,
      thumbnail: sql<string | null>`(
        SELECT url FROM product_images
        WHERE product_id = ${products.id}
        ORDER BY position ASC
        LIMIT 1
      )`.as('thumbnail'),
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt))
    .limit(limit)
}

export async function getAllCategories() {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      createdAt: categories.createdAt,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id, categories.name, categories.slug, categories.createdAt)
    .orderBy(asc(categories.name))
}

export async function getAllProducts() {
  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      visible: products.visible,
      createdAt: products.createdAt,
      categoryId: products.categoryId,
      categoryName: categories.name,
      thumbnail: sql<string | null>`(
        SELECT url FROM product_images
        WHERE product_id = ${products.id}
        ORDER BY position ASC
        LIMIT 1
      )`.as('thumbnail'),
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt))
}

export async function getProductById(id: string) {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      visible: products.visible,
      categoryId: products.categoryId,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(eq(products.id, id))
    .limit(1)

  if (!rows[0]) return null

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.position))

  return { ...rows[0], images }
}

export async function getAllChatSessions() {
  return db
    .select({
      id: chatSessions.id,
      guestName: chatSessions.guestName,
      createdAt: chatSessions.createdAt,
      lastMessageAt: chatSessions.lastMessageAt,
      lastMessage: sql<string | null>`(
        SELECT content FROM chat_messages
        WHERE session_id = ${chatSessions.id}
        ORDER BY created_at DESC
        LIMIT 1
      )`.as('last_message'),
    })
    .from(chatSessions)
    .orderBy(sql`${chatSessions.lastMessageAt} desc nulls last`, desc(chatSessions.createdAt))
}

export async function getChatSession(id: string) {
  const rows = await db
    .select({
      id: chatSessions.id,
      guestName: chatSessions.guestName,
      createdAt: chatSessions.createdAt,
    })
    .from(chatSessions)
    .where(eq(chatSessions.id, id))
    .limit(1)

  return rows[0] ?? null
}

export async function getChatMessages(sessionId: string) {
  return db
    .select({
      id: chatMessages.id,
      content: chatMessages.content,
      fromAdmin: chatMessages.fromAdmin,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(asc(chatMessages.createdAt))
}
