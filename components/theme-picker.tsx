"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { prebuiltThemes, type ThemeConfig } from "@/lib/opentui/themes"

interface ThemePickerProps {
  value: string
  onValueChange: (value: string) => void
  themes?: ThemeConfig[]
  className?: string
}

export function ThemePicker({ value, onValueChange, themes = prebuiltThemes, className }: ThemePickerProps) {
  const [open, setOpen] = useState(false)
  const selectedTheme = themes.find((t) => t.name === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[280px] justify-between bg-black/50 border-green-400/30 text-green-400 hover:bg-green-400/10 hover:text-green-300",
            className,
          )}
        >
          <div className="flex items-center gap-2">
            {selectedTheme && (
              <div
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: selectedTheme.colors.primary }}
              />
            )}
            <span className="truncate">{selectedTheme?.displayName ?? "Select theme..."}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 bg-black/95 border-green-400/30 backdrop-blur-xl">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search themes..." className="text-green-400 placeholder:text-green-400/50" />
          <CommandList>
            <CommandEmpty className="text-green-400/50 py-6 text-center text-sm">No theme found.</CommandEmpty>
            <CommandGroup className="p-1">
              {themes.map((theme) => (
                <CommandItem
                  key={theme.name}
                  value={theme.name}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue)
                    setOpen(false)
                  }}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer text-green-400 hover:bg-green-400/10 aria-selected:bg-green-400/20"
                >
                  {/* Color preview */}
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                  </div>

                  {/* Theme info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{theme.displayName}</div>
                    <div className="text-xs text-green-400/50 truncate">{theme.description}</div>
                  </div>

                  {/* Check mark */}
                  <Check className={cn("h-4 w-4 shrink-0", value === theme.name ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Compact version for inline use
export function ThemePickerCompact({ value, onValueChange, themes = prebuiltThemes }: ThemePickerProps) {
  const [open, setOpen] = useState(false)
  const selectedTheme = themes.find((t) => t.name === value)

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
          {selectedTheme && (
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTheme.colors.primary }} />
          )}
          <ChevronsUpDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0 bg-black/95 border-green-400/30 backdrop-blur-xl">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search..." className="text-green-400 placeholder:text-green-400/50 h-9" />
          <CommandList className="max-h-[200px]">
            <CommandEmpty className="text-green-400/50 py-4 text-center text-xs">No theme found.</CommandEmpty>
            <CommandGroup className="p-1">
              {themes.map((theme) => (
                <CommandItem
                  key={theme.name}
                  value={theme.name}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 cursor-pointer text-green-400 text-sm hover:bg-green-400/10 aria-selected:bg-green-400/20"
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: theme.colors.primary }} />
                  <span className="truncate flex-1">{theme.displayName}</span>
                  <Check className={cn("h-3 w-3 shrink-0", value === theme.name ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
