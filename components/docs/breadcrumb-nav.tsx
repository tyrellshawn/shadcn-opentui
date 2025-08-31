"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

interface BreadcrumbItem {
  label: string
  href: string
}

export function BreadcrumbNav() {
  const pathname = usePathname()

  const getBreadcrumbs = (path: string): BreadcrumbItem[] => {
    const segments = path.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }]

    if (segments.length === 0) return breadcrumbs

    // Add docs root if we're in docs
    if (segments[0] === "docs") {
      breadcrumbs.push({ label: "Documentation", href: "/docs" })

      if (segments.length > 1) {
        // Handle nested routes
        if (segments[1] === "components") {
          breadcrumbs.push({ label: "Components", href: "/docs/components" })
          if (segments[2]) {
            const componentName = segments[2].charAt(0).toUpperCase() + segments[2].slice(1)
            breadcrumbs.push({ label: componentName, href: `/docs/components/${segments[2]}` })
          }
        } else if (segments[1] === "opentui") {
          breadcrumbs.push({ label: "OpenTUI Integration", href: "/docs/opentui" })
          if (segments[2]) {
            const pageName = segments[2].charAt(0).toUpperCase() + segments[2].slice(1)
            breadcrumbs.push({ label: pageName, href: `/docs/opentui/${segments[2]}` })
          }
        } else if (segments[1] === "examples") {
          breadcrumbs.push({ label: "Examples", href: "/docs/examples" })
          if (segments[2]) {
            const exampleName = segments[2].charAt(0).toUpperCase() + segments[2].slice(1)
            breadcrumbs.push({ label: exampleName, href: `/docs/examples/${segments[2]}` })
          }
        } else {
          // Handle direct pages like installation, quick-start
          const pageName = segments[1]
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
          breadcrumbs.push({ label: pageName, href: `/docs/${segments[1]}` })
        }
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(pathname)

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      {breadcrumbs.map((item, index) => (
        <Fragment key={item.href}>
          {index === 0 ? (
            <Link href={item.href} className="flex items-center hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <ChevronRight className="h-4 w-4" />
              {index === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              )}
            </>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
