import type { Metadata } from 'next'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ChevronRight, MessageCircle } from 'lucide-react'

import { getAllChatSessions } from '@/lib/db/queries'
import { PageHeader } from '@/components/admin/PageHeader'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const metadata: Metadata = { title: 'Chat — Zita Boutique' }

export default async function ChatInboxPage() {
  const sessions = await getAllChatSessions()

  return (
    <>
      <PageHeader title="Chat" description="Conversations with your customers." />

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <MessageCircle className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-sm">
            No conversations yet. They&apos;ll appear here when a customer starts a chat.
          </p>
        </div>
      ) : (
        <ul className="bg-background divide-y rounded-lg border">
          {sessions.map((session) => (
            <li key={session.id}>
              <Link
                href={`/admin/chat/${session.id}`}
                className="hover:bg-muted/50 flex items-center gap-3 p-4 transition-colors"
              >
                <Avatar>
                  <AvatarFallback>{session.guestName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{session.guestName}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {session.lastMessage ?? 'No messages yet'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground hidden text-xs sm:inline">
                    {formatDistanceToNow(session.lastMessageAt ?? session.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
                  <ChevronRight className="text-muted-foreground size-4" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
