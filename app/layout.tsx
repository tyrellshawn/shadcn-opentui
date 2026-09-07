import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Providers } from "./providers"
import "./globals.css"

const siteUrl = "https://opentui.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shadcn OpenTUI — Terminal UI for React Agents",
    template: "%s | Shadcn OpenTUI",
  },
  description:
    "Inspectable shadcn/React terminal components for AI agent consoles, in-app terminals, deploy and debug workflows, streaming output, commands, and approval UX.",
  keywords: [
    "terminal component",
    "React terminal",
    "Next.js terminal",
    "AI agent UI",
    "agent console",
    "shadcn terminal",
    "OpenTUI web",
    "developer tools UI",
    "terminal React component",
  ],
  authors: [{ name: "Canadian AI", url: "https://github.com/canadian-ai" }],
  creator: "Canadian AI",
  publisher: "Canadian AI",
  generator: "Next.js",
  alternates: {
    canonical: "/",
    types: {
      "text/plain": [
        { url: "/llms.txt", title: "LLM project index" },
        { url: "/llms-full.txt", title: "Expanded LLM project context" },
      ],
      "application/json": [
        { url: "/agent-index.json", title: "Agent resource index" },
        { url: "/faq.json", title: "Machine-readable FAQ" },
        { url: "/qa.json", title: "Retrieval Q&A corpus" },
      ],
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Shadcn OpenTUI",
    title: "Shadcn OpenTUI — Terminal UI for React Agents",
    description:
      "Copy-owned shadcn terminal components for browser agent consoles, developer workflows, streaming output, commands, and approval UX.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadcn OpenTUI — Terminal UI for React Agents",
    description:
      "Inspectable React terminal components for browser agent consoles and developer workflows.",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "source-repository": "https://github.com/canadian-ai/shadcn-opentui",
    "issue-tracker": "https://github.com/canadian-ai/shadcn-opentui/issues",
    "llms-index": `${siteUrl}/llms.txt`,
    "agent-index": `${siteUrl}/agent-index.json`,
    "agent-skill": `${siteUrl}/skills/shadcn-opentui/SKILL.md`,
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
