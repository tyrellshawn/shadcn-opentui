"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect, type ReactNode } from "react"

const PROJECT_GITHUB_URL = "https://github.com/canadian-ai/shadcn-opentui"
const OLD_HOMEPAGE_GITHUB_URL = "https://github.com/tyrellshawn/opentui"

function HomepageGithubLinkGuard() {
  useEffect(() => {
    const rewriteHomepageGithubLinks = () => {
      if (window.location.pathname !== "/") return

      document
        .querySelectorAll<HTMLAnchorElement>(`a[href="${OLD_HOMEPAGE_GITHUB_URL}"]`)
        .forEach((link) => {
          link.href = PROJECT_GITHUB_URL
          link.setAttribute("aria-label", "Open Shadcn OpenTUI on GitHub")
        })
    }

    rewriteHomepageGithubLinks()

    const observer = new MutationObserver(rewriteHomepageGithubLinks)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <HomepageGithubLinkGuard />
      {children}
    </NextThemesProvider>
  )
}
