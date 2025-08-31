"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search, File, Terminal, BookOpen, Code, Zap, Settings, FileText, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Search data structure
interface SearchItem {
  id: string
  title: string
  description?: string
  href: string
  category: string
  icon?: React.ComponentType<{ className?: string }>
  keywords?: string[]
}

// Mock search data - in a real app, this would come from your CMS or be generated at build time
const searchData: SearchItem[] = [
  // Getting Started
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
  // Components
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
  // OpenTUI Integration
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
  // Examples
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
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        onOpenChange?.(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [onOpenChange])

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      onOpenChange?.(false)
      command()
    },
    [onOpenChange],
  )

  const filteredItems = React.useMemo(() => {
    if (!search) return searchData

    const query = search.toLowerCase()
    return searchData.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(query)
      const descriptionMatch = item.description?.toLowerCase().includes(query)
      const keywordMatch = item.keywords?.some((keyword) => keyword.toLowerCase().includes(query))
      const categoryMatch = item.category.toLowerCase().includes(query)

      return titleMatch || descriptionMatch || keywordMatch || categoryMatch
    })
  }, [search])

  const groupedItems = React.useMemo(() => {
    const groups: Record<string, SearchItem[]> = {}
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })
    return groups
  }, [filteredItems])

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <CommandPrimitive className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
              value={search}
              onValueChange={setSearch}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search documentation..."
            />
          </div>
          <CommandPrimitive.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <CommandPrimitive.Empty className="py-6 text-center text-sm">No results found.</CommandPrimitive.Empty>
            {Object.entries(groupedItems).map(([category, items]) => (
              <CommandPrimitive.Group key={category} heading={category}>
                {items.map((item) => {
                  const Icon = item.icon || File
                  return (
                    <CommandPrimitive.Item
                      key={item.id}
                      value={`${item.title} ${item.description} ${item.keywords?.join(" ")}`}
                      onSelect={() => {
                        runCommand(() => router.push(item.href))
                      }}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{item.title}</span>
                        {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                      </div>
                    </CommandPrimitive.Item>
                  )
                })}
              </CommandPrimitive.Group>
            ))}
          </CommandPrimitive.List>
        </CommandPrimitive>
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
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64",
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
