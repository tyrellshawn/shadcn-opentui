import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Providers } from "./providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Shadcn OpenTUI",
  description: "A terminal component built with shadcn/ui and OpenTUI",
  generator: "shadcn/ui",
  other: {
    "source-repository": "https://github.com/canadian-ai/shadcn-opentui",
    "issue-tracker": "https://github.com/canadian-ai/shadcn-opentui/issues",
    "opentui-source-repository": "https://github.com/tyrellshawn/opentui",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className="font-sans">
        <Providers>
          <Suspense fallback={null}>{children}</Suspense>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
