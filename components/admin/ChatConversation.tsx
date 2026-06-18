'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { format } from 'date-fns'
import { Send } from 'lucide-react'
import { toast } from 'sonner'

import { sendAdminMessage } from '@/lib/actions/products'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface ChatMessage {
  id: string
  content: string
  fromAdmin: boolean
  createdAt: string | Date
}

export function ChatConversation({
  sessionId,
  initialMessages,
}: {
  sessionId: string
  initialMessages: ChatMessage[]
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [isPending, startTransition] = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string
            content: string
            from_admin: boolean
            created_at: string
          }
          setMessages((prev) =>
            prev.some((m) => m.id === row.id)
              ? prev
              : [
                  ...prev,
                  {
                    id: row.id,
                    content: row.content,
                    fromAdmin: row.from_admin,
                    createdAt: row.created_at,
                  },
                ]
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  function handleSend() {
    const content = draft.trim()
    if (!content) return
    setDraft('')

    startTransition(async () => {
      const result = await sendAdminMessage(sessionId, content)
      if (result.error || !result.message) {
        toast.error(result.error ?? 'Could not send message')
        setDraft(content)
        return
      }
      const sent = result.message
      setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]))
    })
  }

  return (
    <div className="bg-background flex h-[calc(100svh-13rem)] flex-col rounded-lg border md:h-[calc(100svh-12rem)]">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn('flex', message.fromAdmin ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-3 py-2 text-sm',
                  message.fromAdmin
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <p className="break-words whitespace-pre-wrap">{message.content}</p>
                <p
                  className={cn(
                    'mt-1 text-[10px]',
                    message.fromAdmin ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}
                >
                  {format(new Date(message.createdAt), 'h:mm a')}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-center gap-2 border-t p-3"
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a reply…"
          autoComplete="off"
        />
        <Button type="submit" size="icon" disabled={isPending || !draft.trim()} aria-label="Send">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
