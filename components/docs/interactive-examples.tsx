"use client"

import Link from "next/link"
import { ArrowRight, ImageIcon, LogIn, Menu, PlayCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Terminal } from "@/components/ui/terminal"

const examplePages = [
  {
    title: "Login Flow",
    description: "A terminal-driven sign-in demo with forms, validation, and success states.",
    href: "/docs/examples/login",
    icon: LogIn,
    badge: "Forms",
    preview: (
      <Terminal
        commands={{
          login: {
            name: "login",
            description: "Show a success message",
            handler: (_args, context) => {
              context?.addLine?.("Signed in as demo-user.", "success")
            },
          },
        }}
        welcomeMessage={["Login demo", "Try: login"]}
        className="h-40"
      />
    ),
  },
  {
    title: "Interactive Menu",
    description: "Keyboard-driven menus with nested actions and command routing.",
    href: "/docs/examples/menu",
    icon: Menu,
    badge: "Navigation",
    preview: (
      <Terminal
        commands={{
          menu: {
            name: "menu",
            description: "Open the menu",
            handler: (_args, context) => {
              context?.setState?.((prev: { menuSelection: number }) => ({
                ...prev,
                mode: "ui",
                menuSelection: 0,
                activeComponent: {
                  id: `menu-${Date.now()}`,
                  type: "menu",
                  props: { items: ["Dashboard", "Projects", "Settings"] },
                  active: true,
                },
              }))
            },
          },
        }}
        welcomeMessage={["Menu demo", "Try: menu"]}
        className="h-40"
      />
    ),
  },
  {
    title: "ASCII Studio",
    description: "Generate banners, badges, and text art directly inside the terminal.",
    href: "/docs/examples/ascii",
    icon: ImageIcon,
    badge: "Styling",
    preview: (
      <Terminal
        commands={{
          ascii: {
            name: "ascii",
            description: "Generate a banner",
            handler: (args, context) => {
              const label = (args.join(" ") || "OpenTUI").toUpperCase()
              context?.addLine?.(`### ${label} ###`, "success")
            },
          },
        }}
        welcomeMessage={["ASCII demo", "Try: ascii launch"]}
        className="h-40"
      />
    ),
  },
]

export function InteractiveExamples() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-300">
            <PlayCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Interactive Examples</h1>
            <p className="text-muted-foreground">Real demos you can explore before integrating the component.</p>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-muted-foreground">
          Each example page includes a live OpenTUI preview, implementation notes, and working code samples.
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {examplePages.map((page) => {
          const Icon = page.icon

          return (
            <Card key={page.href} className="border-emerald-500/20 bg-black/40">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{page.title}</CardTitle>
                      <CardDescription>{page.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/20 text-emerald-300">
                    {page.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {page.preview}
                <Button asChild className="w-full">
                  <Link href={page.href}>
                    Open Example
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
