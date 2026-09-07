"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Search, Check, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ThemeConfig } from "@/lib/opentui/themes"

export interface TerminalThemeSelectorProps {
  open: boolean
  themes: ThemeConfig[]
  currentThemeName: string
  onSelect?: (themeName: string) => void
  onPreview?: (themeName: string) => void
  onCancel?: () => void
}

type FilterTab = "all" | "dark" | "light"

export function TerminalThemeSelector({
  open,
  themes,
  currentThemeName,
  onSelect,
  onPreview,
  onCancel,
}: TerminalThemeSelectorProps) {
  const [query, setQuery] = useState("")
  const [filterTab, setFilterTab] = useState<FilterTab>("all")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const onPreviewRef = useRef(onPreview)
  const lastPreviewedThemeRef = useRef<string | null>(null)

  useEffect(() => {
    onPreviewRef.current = onPreview
  }, [onPreview])

  const filtered = useMemo(() => {
    let result = themes
    if (filterTab === "dark") {
      result = result.filter((t) => t.variant === "dark")
    } else if (filterTab === "light") {
      result = result.filter((t) => t.variant === "light")
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim()
      result = result.filter((t) => {
        const name = t.name ?? ""
        const displayName = t.displayName ?? ""
        const description = t.description ?? ""
        const variant = t.variant ?? ""
        const fontFamily = t.fontFamily ?? ""
        return (
          name.toLowerCase().includes(q) ||
          displayName.toLowerCase().includes(q) ||
          description.toLowerCase().includes(q) ||
          variant.toLowerCase().includes(q) ||
          fontFamily.toLowerCase().includes(q)
        )
      })
    }
    return result
  }, [themes, filterTab, query])

  useEffect(() => {
    if (!open) return

    setQuery("")
    setFilterTab("all")
    const idx = themes.findIndex((theme) => theme.name === currentThemeName)
    const nextIndex = idx >= 0 ? idx : 0
    setSelectedIndex((previousIndex) => (previousIndex === nextIndex ? previousIndex : nextIndex))
  }, [open])

  useEffect(() => {
    if (!open) return
    const idx = filtered.findIndex((theme) => theme.name === currentThemeName)
    const nextIndex = idx >= 0 ? idx : 0
    setSelectedIndex((previousIndex) => (previousIndex === nextIndex ? previousIndex : nextIndex))
  }, [filterTab, query, filtered, currentThemeName, open])

  useEffect(() => {
    const el = itemRefs.current.get(selectedIndex)
    if (el) {
      el.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex])

  const previewThemeName = open ? filtered[selectedIndex]?.name : undefined

  useEffect(() => {
    if (!open) {
      lastPreviewedThemeRef.current = null
      return
    }

    if (!previewThemeName || lastPreviewedThemeRef.current === previewThemeName) return

    lastPreviewedThemeRef.current = previewThemeName
    onPreviewRef.current?.(previewThemeName)
  }, [open, previewThemeName])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          if (filtered.length > 0) {
            setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1))
          }
          break
        case "ArrowUp":
          e.preventDefault()
          if (filtered.length > 0) {
            setSelectedIndex((prev) => Math.max(prev - 1, 0))
          }
          break
        case "Enter":
          e.preventDefault()
          if (filtered.length > 0 && filtered[selectedIndex]) {
            onSelect?.(filtered[selectedIndex].name)
          }
          break
        case "Escape":
          e.preventDefault()
          onCancel?.()
          break
      }
    },
    [filtered, selectedIndex, onSelect, onCancel],
  )

  if (!open) return null

  return (
    <div
      className="absolute inset-2 flex items-center justify-center sm:inset-4"
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute inset-0 -m-2 sm:-m-4 bg-terminal-bg/95 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation()
          onCancel?.()
        }}
      />

      <div
        className="relative flex w-full max-h-full min-h-0 flex-col overflow-hidden rounded-lg border border-terminal-border bg-terminal-bg mx-auto max-w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-shrink-0 border-b border-terminal-border">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-muted">
            <Search className="h-4 w-4" />
          </div>
          <input
            ref={searchRef}
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search themes..."
            className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm text-terminal-text placeholder:text-terminal-muted outline-none sm:py-3"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault()
              }
            }}
          />
        </div>

        <div className="flex flex-shrink-0 gap-1 border-b border-terminal-border px-2 py-1.5 sm:py-2">
          {(["all", "dark", "light"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={cn(
                "flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-colors",
                filterTab === tab
                  ? "bg-terminal-primary/20 text-terminal-primary"
                  : "text-terminal-muted hover:text-terminal-text hover:bg-terminal-highlight-bg",
              )}
            >
              {tab === "all" ? null : tab === "dark" ? (
                <Moon className="h-3 w-3" />
              ) : (
                <Sun className="h-3 w-3" />
              )}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto py-1 terminal-scrollbar overscroll-contain min-h-0">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-terminal-muted">
              No themes found
            </div>
          )}
          {filtered.map((theme, idx) => {
            const isSelected = theme.name === currentThemeName
            const isHighlighted = idx === selectedIndex
            return (
              <div
                key={theme.name}
                ref={(el) => {
                  if (el) itemRefs.current.set(idx, el)
                  else itemRefs.current.delete(idx)
                }}
                onClick={() => onSelect?.(theme.name)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  "flex cursor-pointer items-start gap-3 px-4 py-2.5 transition-colors",
                  isHighlighted && "bg-terminal-highlight-bg",
                )}
              >
                <div className="flex flex-shrink-0 items-center gap-1 pt-0.5">
                  <span
                    className="block h-4 w-4 rounded-full border border-terminal-border"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <span
                    className="block h-4 w-4 rounded-full border border-terminal-border"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <span
                    className="block h-4 w-4 rounded-full border border-terminal-border"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-terminal-text">
                      {theme.displayName}
                    </span>
                    <span
                      className={cn(
                        "flex-shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium uppercase leading-tight",
                        theme.variant === "dark"
                          ? "bg-terminal-text text-terminal-bg"
                          : "bg-terminal-muted text-terminal-bg",
                      )}
                    >
                      {theme.variant}
                    </span>
                    {isSelected && (
                      <Check className="ml-auto h-4 w-4 flex-shrink-0 text-terminal-primary" />
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-terminal-muted">
                    {theme.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex-shrink-0 border-t border-terminal-border px-4 py-2 text-center text-xs text-terminal-muted">
          ↑↓ Navigate · Enter Save · Esc Cancel
        </div>
      </div>
    </div>
  )
}
