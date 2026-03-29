"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DialogProps } from "@radix-ui/react-dialog"
import { Search, File, Terminal, BookOpen, Code, Zap, Settings, FileText, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { filterSearchItems, groupSearchItems, type SearchItem } from "@/lib/opentui/search-utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SearchUIItem extends SearchItem {
  icon?: React.ComponentType<{ className?: string }>
}

const searchData: SearchUIItem[] = [
  {
    id: "intro",
    title: "Introduction",
    description: "Learn about OpenTUI React and terminal user interfaces",
    href: "/docs",
    category: "Getting Started",
    icon: BookOpen,
    keywords: ["introduction", "overview", "terminal", "tui", "react"],
  },
  {
    id: "installation",
    title: "Installation",
    description: "Install OpenTUI React in your project",
    href: "/docs/installation",
    category: "Getting Started",
    icon: Terminal,
    keywords: ["install", "setup", "npm", "bun", "package"],
  },
  {
    id: "quick-start",
    title: "Quick Start",
    description: "Get up and running with your first terminal app",
    href: "/docs/quick-start",
    category: "Getting Started",
    icon: Play,
    keywords: ["quick", "start", "tutorial", "example", "hello world"],
  },
  {
    id: "terminal-component",
    title: "Terminal Component",
    description: "Interactive terminal component with command handling",
    href: "/docs/components/terminal",
    category: "Components",
    icon: Terminal,
    keywords: ["terminal", "component", "interactive", "commands", "cursor"],
  },
  {
    id: "command-component",
    title: "Command Component",
    description: "Display styled command snippets",
    href: "/docs/components/command",
    category: "Components",
    icon: Code,
    keywords: ["command", "code", "snippet", "display"],
  },
  {
    id: "examples",
    title: "Interactive Examples",
    description: "Live examples and demos",
    href: "/docs/components/examples",
    category: "Components",
    icon: Zap,
    keywords: ["examples", "demo", "interactive", "live"],
  },
  {
    id: "opentui-concepts",
    title: "Core Concepts",
    description: "Understanding OpenTUI's architecture and concepts",
    href: "/docs/opentui/concepts",
    category: "OpenTUI Integration",
    icon: BookOpen,
    keywords: ["concepts", "architecture", "core", "opentui", "tui"],
  },
  {
    id: "opentui-components",
    title: "React Components",
    description: "Built-in OpenTUI React components",
    href: "/docs/opentui/components",
    category: "OpenTUI Integration",
    icon: Code,
    keywords: ["react", "components", "box", "text", "input", "select"],
  },
  {
    id: "opentui-hooks",
    title: "Hooks & Events",
    description: "React hooks for terminal interactions",
    href: "/docs/opentui/hooks",
    category: "OpenTUI Integration",
    icon: Settings,
    keywords: ["hooks", "events", "keyboard", "resize", "useKeyboard"],
  },
  {
    id: "opentui-custom",
    title: "Custom Components",
    description: "Create your own OpenTUI components",
    href: "/docs/opentui/custom",
    category: "OpenTUI Integration",
    icon: Zap,
    keywords: ["custom", "extend", "components", "renderable"],
  },
  {
    id: "login-example",
    title: "Login Form",
    description: "Interactive login form example",
    href: "/docs/examples/login",
    category: "Examples",
    icon: FileText,
    keywords: ["login", "form", "input", "authentication", "example"],
  },
  {
    id: "menu-example",
    title: "Interactive Menu",
    description: "Terminal menu navigation example",
    href: "/docs/examples/menu",
    category: "Examples",
    icon: Settings,
    keywords: ["menu", "navigation", "select", "interactive", "example"],
  },
  {
    id: "ascii-example",
    title: "ASCII Art",
    description: "ASCII art and fonts example",
    href: "/docs/examples/ascii",
    category: "Examples",
    icon: Terminal,
    keywords: ["ascii", "art", "fonts", "text", "styling", "example"],
  },
]

interface CommandDialogProps extends DialogProps {
  onOpenChange?: (open: boolean) => void
}

export function CommandDialog({ onOpenChange, ...props }: CommandDialogProps) {
  const router = useRouter()
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || event.key === "/") {
        if (
          (event.target instanceof HTMLElement && event.target.isContentEditable) ||
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement
        ) {
          return
        }

        event.preventDefault()
        onOpenChange?.(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [onOpenChange])

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      onOpenChange?.(false)
      setSearch("")
      command()
    },
    [onOpenChange],
  )

  const groupedItems = React.useMemo(() => {
    return groupSearchItems(filterSearchItems(searchData, search))
  }, [search])

  const hasResults = Object.values(groupedItems).some((items) => items.length > 0)

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-emerald-500/20 bg-black/95 p-0 text-emerald-100 shadow-lg">
        <div className="border-b border-emerald-500/10 px-3 py-3">
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-black/70 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-emerald-300/70" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-emerald-200/40"
              placeholder="Search documentation..."
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-[320px] overflow-y-auto px-2 py-2">
          {!hasResults ? (
            <div className="py-8 text-center text-sm text-emerald-100/60">No results found.</div>
          ) : (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="pb-3 last:pb-0">
                <div className="px-2 pb-2 pt-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300/50">
                  {category}
                </div>
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon || File

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => runCommand(() => router.push(item.href))}
                        className="flex w-full items-start gap-3 rounded-md border border-transparent px-3 py-2 text-left transition-colors hover:border-emerald-500/10 hover:bg-emerald-500/10 focus-visible:border-emerald-500/20 focus-visible:bg-emerald-500/10 focus-visible:outline-none"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/80" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-emerald-50">{item.title}</div>
                          {item.description && <div className="text-xs text-emerald-200/55">{item.description}</div>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SearchButton() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full max-w-full justify-start rounded-md bg-muted/50 text-sm font-normal text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground sm:pr-12",
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 shrink-0" />
        <span className="hidden truncate lg:inline-flex">Search documentation...</span>
        <span className="inline-flex truncate lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
