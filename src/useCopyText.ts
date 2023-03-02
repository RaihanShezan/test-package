import { useState, useCallback } from 'react'

interface CopyTextObject {
  text: string | null
  copy(textToCopy: string): Promise<void>
  copied: boolean
}

export default function useCopyText(timeout?: number): CopyTextObject {
  const [text, setText] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async function (textToCopy: string) {
    const success = navigator.clipboard
      ? await navigatorCopy(textToCopy)
      : fallbackCopy(textToCopy)
    if (success) setText(textToCopy)
    setCopied(success)
    if (timeout && success) setTimeout(() => setCopied(false), timeout)
  }, [])

  return { text, copy, copied }
}

async function navigatorCopy(text: string): Promise<boolean> {
  try {
    navigator.clipboard.writeText(text)
    return true
  } catch (_) {
    return false
  }
}

function fallbackCopy(text: string): boolean {
  const textArea = document.createElement('textarea')
  textArea.value = text
  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  let success
  try {
    success = document.execCommand('copy')
  } catch (_) {
    success = false
  }
  document.body.removeChild(textArea)
  return success
}
