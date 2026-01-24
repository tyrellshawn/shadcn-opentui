"use client"

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
import { Terminal, BookOpen, Code, Zap, Settings, FileText, Play, Puzzle, Palette } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { SearchButton } from "@/components/search"
import { BreadcrumbNav } from "@/components/docs/breadcrumb-nav"
import { PageNav } from "@/components/docs/page-nav"

const navigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", icon: BookOpen },
      { title: "Installation", href: "/docs/installation", icon: Terminal },
      { title: "Quick Start", href: "/docs/quick-start", icon: Play },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Terminal", href: "/docs/components/terminal", icon: Terminal },
      { title: "Command", href: "/docs/components/command", icon: Code },
      { title: "Interactive Examples", href: "/docs/components/examples", icon: Zap },
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
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("query") || ""
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  return (
    <SidebarProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-green-500" />
              <span className="font-semibold text-lg">OpenTUI Docs</span>
            </div>
            <div className="mt-4 w-full overflow-hidden">
              <SearchButton />
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
              <span>OpenTUI React Documentation</span>
            </div>
            <div className="ml-auto">
              <SearchButton />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container max-w-4xl mx-auto px-6 py-8">
              <BreadcrumbNav />
              {children}
              <PageNav />
            </div>
          </main>
        </SidebarInset>
      </Suspense>
    </SidebarProvider>
  )
}
