'use client'

import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

const isDark = () => document.documentElement.classList.contains('dark')

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false)

  function toggle() {
    const next = !isDark()
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      // localStorage unavailable — theme just won't persist across reloads
    }
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3"
      onClick={toggle}
      aria-label="Toggle dark mode"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {dark ? 'Light mode' : 'Dark mode'}
    </Button>
  )
}
