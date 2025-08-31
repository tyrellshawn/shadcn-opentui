"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
}

const navigationOrder: NavItem[] = [
  { title: "Introduction", href: "/docs" },
  { title: "Installation", href: "/docs/installation" },
  { title: "Quick Start", href: "/docs/quick-start" },
  { title: "Terminal Component", href: "/docs/components/terminal" },
  { title: "Command Component", href: "/docs/components/command" },
  { title: "Interactive Examples", href: "/docs/components/examples" },
  { title: "Core Concepts", href: "/docs/opentui/concepts" },
  { title: "React Components", href: "/docs/opentui/components" },
  { title: "Hooks & Events", href: "/docs/opentui/hooks" },
  { title: "Custom Components", href: "/docs/opentui/custom" },
  { title: "Login Form Example", href: "/docs/examples/login" },
  { title: "Interactive Menu Example", href: "/docs/examples/menu" },
  { title: "ASCII Art Example", href: "/docs/examples/ascii" },
]

export function PageNav() {
  const pathname = usePathname()

  const currentIndex = navigationOrder.findIndex((item) => item.href === pathname)

  if (currentIndex === -1) return null

  const previousPage = currentIndex > 0 ? navigationOrder[currentIndex - 1] : null
  const nextPage = currentIndex < navigationOrder.length - 1 ? navigationOrder[currentIndex + 1] : null

  if (!previousPage && !nextPage) return null

  return (
    <div className="flex items-center justify-between pt-8 mt-8 border-t">
      <div className="flex-1">
        {previousPage && (
          <Button asChild variant="ghost" className="h-auto p-4 justify-start">
            <Link href={previousPage.href} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Previous</div>
                <div className="font-medium">{previousPage.title}</div>
              </div>
            </Link>
          </Button>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        {nextPage && (
          <Button asChild variant="ghost" className="h-auto p-4 justify-end">
            <Link href={nextPage.href} className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Next</div>
                <div className="font-medium">{nextPage.title}</div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
