"use client"

import { useState } from "react"
import { Copy, Check, FileCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { SyntaxHighlighter } from "./syntax-highlighter"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
  showCopyButton?: boolean
  showHeader?: boolean
  maxHeight?: string
}

export function CodeBlock({
  code,
  language = "tsx",
  title,
  showLineNumbers = true,
  highlightLines = [],
  className,
  showCopyButton = true,
  showHeader = true,
  maxHeight = "500px",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success("Code copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy code")
    }
  }

  return (
    <div className={cn("rounded-xl border border-emerald-500/20 bg-black/50 overflow-hidden", className)}>
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-500/10 bg-black/30">
          <div className="flex items-center gap-3">
            <FileCode className="h-4 w-4 text-emerald-400" />
            {title && <span className="text-sm font-medium text-white">{title}</span>}
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
              {language}
            </Badge>
          </div>
          {showCopyButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-7 px-2 hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
          )}
        </div>
      )}
      <div className="p-4 overflow-auto terminal-scrollbar" style={{ maxHeight }}>
        <SyntaxHighlighter
          code={code}
          language={language}
          showLineNumbers={showLineNumbers}
          highlightLines={highlightLines}
        />
      </div>
    </div>
  )
}
