"use client"

import { useMemo, useState } from "react"
import { Check, ChevronsUpDown, Palette, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { prebuiltThemes, type ThemeConfig } from "@/lib/opentui/themes"

interface ThemePickerProps {
  value: string
  onValueChange: (value: string) => void
  themes?: ThemeConfig[]
  className?: string
}

function ThemePickerPanel({
  value,
  onValueChange,
  themes,
  compact = false,
  onClose,
}: {
  value: string
  onValueChange: (value: string) => void
  themes: ThemeConfig[]
  compact?: boolean
  onClose: () => void
}) {
  const [search, setSearch] = useState("")

  const filteredThemes = useMemo(() => {
    const normalized = search.trim().toLowerCase()

    if (!normalized) {
      return themes
    }

    return themes.filter((theme) => {
      return [theme.name, theme.displayName, theme.description, theme.variant].some((part) =>
        part.toLowerCase().includes(normalized),
      )
    })
  }, [search, themes])

  return (
    <div className="bg-black/95 text-green-400">
      <div className="flex items-center gap-2 border-b border-green-400/20 px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-green-400/60" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={compact ? "Search..." : "Search themes..."}
          className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-green-400/45"
        />
      </div>

      <div className={cn("overflow-y-auto p-1", compact ? "max-h-[200px]" : "max-h-[280px]") }>
        {filteredThemes.length === 0 ? (
          <div className="py-5 text-center text-sm text-green-400/55">No theme found.</div>
        ) : (
          filteredThemes.map((theme) => {
            const isSelected = value === theme.name

            return (
              <button
                key={theme.name}
                type="button"
                onClick={() => {
                  onValueChange(theme.name)
                  onClose()
                }}
                className={cn(
                  "flex w-full items-center rounded-md text-left transition-colors",
                  compact ? "gap-2 px-2 py-1.5 text-sm" : "gap-3 px-3 py-2",
                  isSelected ? "bg-green-400/20" : "hover:bg-green-400/10",
                )}
              >
                <div className={cn("flex items-center gap-1 shrink-0", compact && "gap-0.5") }>
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                  {!compact && <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />}
                  {!compact && <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{theme.displayName}</div>
                  {!compact && <div className="truncate text-xs text-green-400/55">{theme.description}</div>}
                </div>

                <Check className={cn("shrink-0", compact ? "h-3 w-3" : "h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export function ThemePicker({ value, onValueChange, themes = prebuiltThemes, className }: ThemePickerProps) {
  const [open, setOpen] = useState(false)
  const selectedTheme = themes.find((theme) => theme.name === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[280px] justify-between border-green-400/30 bg-black/50 text-green-400 hover:bg-green-400/10 hover:text-green-300",
            className,
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {selectedTheme && (
              <div
                className="h-4 w-4 rounded-full border border-white/20"
                style={{ backgroundColor: selectedTheme.colors.primary }}
              />
            )}
            <span className="truncate">{selectedTheme?.displayName ?? "Select theme..."}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] border-green-400/30 p-0 backdrop-blur-xl">
        <ThemePickerPanel value={value} onValueChange={onValueChange} themes={themes} onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}

export function ThemePickerCompact({ value, onValueChange, themes = prebuiltThemes }: ThemePickerProps) {
  const [open, setOpen] = useState(false)
  const selectedTheme = themes.find((theme) => theme.name === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="h-8 gap-2 px-2 text-green-400 hover:bg-green-400/10"
        >
          <Palette className="h-4 w-4" />
          {selectedTheme && <div className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedTheme.colors.primary }} />}
          <ChevronsUpDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] border-green-400/30 p-0 backdrop-blur-xl">
        <ThemePickerPanel
          value={value}
          onValueChange={onValueChange}
          themes={themes}
          compact
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  )
}
