"use client"

import type React from "react"

import { Highlight, type Language } from "prism-react-renderer"
import { cn } from "@/lib/utils"

// Custom terminal-inspired theme matching the site's emerald aesthetic
const terminalTheme = {
  plain: {
    color: "#e2e8f0",
    backgroundColor: "transparent",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#6b7280",
        fontStyle: "italic" as const,
      },
    },
    {
      types: ["namespace"],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ["string", "attr-value", "template-string"],
      style: {
        color: "#86efac", // emerald-300
      },
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "#94a3b8",
      },
    },
    {
      types: ["entity", "url", "symbol", "number", "boolean", "variable", "constant", "property", "regex", "inserted"],
      style: {
        color: "#fbbf24", // amber-400
      },
    },
    {
      types: ["atrule", "keyword", "attr-name"],
      style: {
        color: "#c084fc", // purple-400
      },
    },
    {
      types: ["function", "deleted", "tag"],
      style: {
        color: "#22d3ee", // cyan-400
      },
    },
    {
      types: ["function-variable"],
      style: {
        color: "#4ade80", // emerald-400
      },
    },
    {
      types: ["selector", "class-name"],
      style: {
        color: "#4ade80", // emerald-400
      },
    },
    {
      types: ["tag", "builtin"],
      style: {
        color: "#f472b6", // pink-400
      },
    },
    {
      types: ["char"],
      style: {
        color: "#22d3ee",
      },
    },
    {
      types: ["important"],
      style: {
        color: "#fb7185",
        fontWeight: "bold",
      },
    },
  ],
}

interface SyntaxHighlighterProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  className?: string
  highlightLines?: number[]
  startingLineNumber?: number
}

export function SyntaxHighlighter({
  code,
  language = "tsx",
  showLineNumbers = true,
  className,
  highlightLines = [],
  startingLineNumber = 1,
}: SyntaxHighlighterProps) {
  // Map common language aliases
  const languageMap: Record<string, Language> = {
    tsx: "tsx",
    typescript: "typescript",
    ts: "typescript",
    javascript: "javascript",
    js: "javascript",
    jsx: "jsx",
    json: "json",
    css: "css",
    html: "markup",
    bash: "bash",
    shell: "bash",
    sh: "bash",
    sql: "sql",
    markdown: "markdown",
    md: "markdown",
    python: "python",
    py: "python",
  }

  const mappedLanguage = languageMap[language.toLowerCase()] || "tsx"

  return (
    <Highlight theme={terminalTheme} code={code.trim()} language={mappedLanguage}>
      {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn("overflow-x-auto text-sm leading-relaxed font-mono", highlightClassName, className)}
          style={{ ...style, background: "transparent" }}
        >
          {tokens.map((line, lineIndex) => {
            const lineNumber = lineIndex + startingLineNumber
            const isHighlighted = highlightLines.includes(lineNumber)
            const { key: _lineKey, ...lineProps } = getLineProps({ line })

            return (
              <div
                key={lineIndex}
                {...lineProps}
                className={cn("flex", isHighlighted && "bg-emerald-500/10 -mx-4 px-4 border-l-2 border-emerald-500")}
              >
                {showLineNumbers && (
                  <span
                    className={cn(
                      "select-none w-10 pr-4 text-right shrink-0",
                      isHighlighted ? "text-emerald-400" : "text-muted-foreground/50",
                    )}
                  >
                    {lineNumber}
                  </span>
                )}
                <span className="flex-1">
                  {line.map((token, tokenIndex) => {
                    const { key: _tokenKey, ...tokenProps } = getTokenProps({ token })
                    return <span key={tokenIndex} {...tokenProps} />
                  })}
                </span>
              </div>
            )
          })}
        </pre>
      )}
    </Highlight>
  )
}

// Inline code component for single-line code snippets
interface InlineCodeProps {
  children: React.ReactNode
  className?: string
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-medium text-emerald-400",
        className,
      )}
    >
      {children}
    </code>
  )
}
