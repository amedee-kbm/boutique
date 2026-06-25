import type { Metadata } from 'next'
import { Bricolage_Grotesque, Figtree } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

// Applied before paint so a dark-mode choice doesn't flash light on load.
// Rendered from the server layout, where an inline script is valid (next-themes
// renders the equivalent inside a client component, which React 19 rejects).
const noFlashTheme = `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`

// Deliberate pairing: a characterful display face for headings, a highly legible
// body face for product/admin copy — chosen over the Geist starter default.
const display = Bricolage_Grotesque({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
})

const body = Figtree({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zita Boutique',
  description: 'Affordable fashion — browse, pick, and chat to order.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
