"use client"

/* eslint-disable @next/next/no-img-element */

import type React from "react"

import { Suspense } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Terminal,
  BookOpen,
  Code,
  Zap,
  Settings,
  FileText,
  Play,
  Puzzle,
  Palette,
  Brain,
  Github,
  ExternalLink,
  CircleDot,
  Bot,
  CircleHelp,
  Scale,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { SearchButton } from "@/components/search"
import { BreadcrumbNav } from "@/components/docs/breadcrumb-nav"
import { PageNav } from "@/components/docs/page-nav"
import { AgentQuickstartCard } from "@/components/docs/agent-quickstart-card"
import { ThemeToggle } from "@/components/theme-toggle"

const SHADCN_OPENTUI_REPOSITORY = "https://github.com/canadian-ai/shadcn-opentui"
const SHADCN_OPENTUI_ISSUES = `${SHADCN_OPENTUI_REPOSITORY}/issues`

const navigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", icon: BookOpen },
      { title: "Installation", href: "/docs/installation", icon: Terminal },
      { title: "Quick Start", href: "/docs/quick-start", icon: Play },
      { title: "For AI Agents", href: "/docs/agents", icon: Bot },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Terminal", href: "/docs/components/terminal", icon: Terminal },
      { title: "Command", href: "/docs/components/command", icon: Code },
      { title: "Interactive Examples", href: "/docs/components/examples", icon: Zap },
      { title: "Thinking Indicator", href: "/docs/components/thinking-indicator", icon: Brain },
    ],
  },
  {
    title: "Adoption",
    items: [
      { title: "FAQ", href: "/docs/faq", icon: CircleHelp },
      { title: "Compare with termcn", href: "/docs/compare-termcn", icon: Scale },
    ],
  },
  {
    title: "Customization",
    items: [
      { title: "Themes", href: "/docs/themes", icon: Palette },
      { title: "Plugins", href: "/docs/plugins", icon: Puzzle },
    ],
  },
  {
    title: "Examples",
    items: [
      { title: "Login Form", href: "/docs/examples/login", icon: FileText },
      { title: "Interactive Menu", href: "/docs/examples/menu", icon: Settings },
      { title: "ASCII Art", href: "/docs/examples/ascii", icon: Terminal },
    ],
  },
  {
    title: "Experimental",
    items: [
      { title: "Codegen Overview", href: "/docs/labs", icon: FileText },
      { title: "Runtime Research", href: "/docs/labs/wasm-runtime", icon: Zap },
      { title: "Hunk Web Example", href: "/docs/examples/hunk", icon: Code },
    ],
  },
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("query") || ""
  const [localSearchQuery] = useState(searchQuery)

  return (
    <SidebarProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-green-500" />
              <span className="font-semibold text-lg">Shadcn OpenTUI Docs</span>
            </div>
            <div className="mt-4 w-full overflow-hidden">
              <SearchButton />
            </div>
            <div className="mt-3 overflow-hidden rounded-lg border bg-card">
              <Link
                href={SHADCN_OPENTUI_REPOSITORY}
                target="_blank"
                rel="noreferrer"
                aria-label="Open canadian-ai/shadcn-opentui on GitHub"
                className="block border-b bg-muted/20"
              >
                <img
                  src="https://opengraph.githubassets.com/1/canadian-ai/shadcn-opentui"
                  alt="GitHub preview for canadian-ai/shadcn-opentui"
                  className="aspect-[2/1] w-full object-cover"
                  loading="lazy"
                />
              </Link>
              <div className="space-y-2 p-3 text-xs">
                <Link
                  href={SHADCN_OPENTUI_REPOSITORY}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-medium text-foreground hover:underline"
                >
                  <Github className="h-3.5 w-3.5" />
                  canadian-ai/shadcn-opentui
                  <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
                </Link>
                <Link
                  href={SHADCN_OPENTUI_ISSUES}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <CircleDot className="h-3.5 w-3.5" />
                  Track issues and requests
                </Link>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4 py-4">
            {navigation.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {section.title}
                </SidebarGroupLabel>
                <SidebarMenu>
                  {section.items
                    .filter(
                      (item) =>
                        localSearchQuery === "" || item.title.toLowerCase().includes(localSearchQuery.toLowerCase()),
                    )
                    .map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname === item.href} className="w-full justify-start">
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Terminal className="h-4 w-4" />
              <span>Shadcn OpenTUI Documentation</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href={SHADCN_OPENTUI_REPOSITORY}
                target="_blank"
                rel="noreferrer"
                aria-label="Open Shadcn OpenTUI repository on GitHub"
                title="Shadcn OpenTUI GitHub"
                className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Github className="h-4 w-4" />
                <span className="hidden lg:inline">GitHub</span>
              </Link>
              <ThemeToggle />
              <SearchButton />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container max-w-4xl mx-auto px-6 py-8">
              <BreadcrumbNav />
              {pathname === "/docs/components/terminal" && (
                <div className="mb-8 mt-4">
                  <AgentQuickstartCard compact />
                </div>
              )}
              {children}
              <PageNav />
            </div>
          </main>
        </SidebarInset>
      </Suspense>
    </SidebarProvider>
  )
}
