"use client"

import Link from "next/link"
import { ArrowRight, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodePreview } from "@/components/docs/code-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal as TerminalComponent } from "@/components/ui/terminal"

function MenuPreview() {
  return (
    <TerminalComponent
      className="h-72"
      commands={{
        menu: {
          name: "menu",
          description: "Open the main menu",
          handler: (_args, context) => {
            context?.setState?.((prev: { menuSelection: number }) => ({
              ...prev,
              mode: "ui",
              menuSelection: 0,
              activeComponent: {
                id: `main-menu-${Date.now()}`,
                type: "menu",
                props: { items: ["Dashboard", "Projects", "Deployments", "Settings"] },
                active: true,
              },
            }))
          },
        },
        submenu: {
          name: "submenu",
          description: "Open a nested menu sample",
          handler: (_args, context) => {
            context?.setState?.((prev: { menuSelection: number }) => ({
              ...prev,
              mode: "ui",
              menuSelection: 0,
              activeComponent: {
                id: `nested-menu-${Date.now()}`,
                type: "menu",
                props: { items: ["File > New", "File > Open", "Edit > Copy", "View > Zoom"] },
                active: true,
              },
            }))
          },
        },
      }}
      welcomeMessage={[
        "Interactive Menu Demo",
        "Run 'menu' for the main menu or 'submenu' for a nested example.",
      ]}
    />
  )
}

const basicMenuCode = `import { Terminal } from "@/components/ui/terminal"

export function MainMenuTerminal() {
  return (
    <Terminal
      commands={{
        menu: {
          name: "menu",
          description: "Open the main menu",
          handler: (_args, context) => {
            context?.setState?.((prev) => ({
              ...prev,
              mode: "ui",
              menuSelection: 0,
              activeComponent: {
                id: \`main-menu-\${Date.now()}\`,
                type: "menu",
                props: { items: ["Dashboard", "Projects", "Deployments", "Settings"] },
                active: true,
              },
            }))
          },
        },
      }}
      welcomeMessage={["Run 'menu' to open the main menu."]}
      className="h-72"
    />
  )
}`

const nestedMenuCode = `import { Terminal } from "@/components/ui/terminal"

export function NestedMenuTerminal() {
  return (
    <Terminal
      commands={{
        submenu: {
          name: "submenu",
          description: "Open a nested menu sample",
          handler: (_args, context) => {
            context?.setState?.((prev) => ({
              ...prev,
              mode: "ui",
              menuSelection: 0,
              activeComponent: {
                id: \`nested-menu-\${Date.now()}\`,
                type: "menu",
                props: { items: ["File > New", "File > Open", "Edit > Copy", "View > Zoom"] },
                active: true,
              },
            }))
          },
        },
      }}
      welcomeMessage={["Run 'submenu' to inspect a nested action list."]}
      className="h-72"
    />
  )
}`

const contextMenuCode = `import { useState } from "react"
import { Terminal } from "@/components/ui/terminal"

export function ContextMenuTerminal() {
  const [lastAction, setLastAction] = useState("Nothing selected yet")

  return (
    <Terminal
      commands={{
        actions: {
          name: "actions",
          description: "Show file actions",
          handler: (_args, context) => {
            context?.setState?.((prev) => ({
              ...prev,
              mode: "ui",
              menuSelection: 0,
              activeComponent: {
                id: \`actions-\${Date.now()}\`,
                type: "menu",
                props: { items: ["Open", "Rename", "Duplicate", "Delete"] },
                active: true,
              },
            }))
          },
        },
        remember: {
          name: "remember",
          description: "Store the selected action",
          handler: (_args, context) => {
            const selected = context?.state?.activeComponent?.props?.items?.[context?.state?.menuSelection ?? 0]
            if (!selected) {
              context?.addLine?.("Open the actions menu first.", "error")
              return
            }
            setLastAction(selected)
            context?.addLine?.(\`Stored action: \${selected}\`, "success")
          },
        },
      }}
      welcomeMessage={["Run 'actions' to open a context menu.", \`Last action: \${lastAction}\`]}
      className="h-72"
    />
  )
}`

export default function MenuExamplePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Interactive Menu Example</h1>
        <p className="text-lg text-muted-foreground">
          Build keyboard-driven menus, nested action lists, and context flows with the same terminal component.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5 text-blue-500" />
            Interactive Menu Demo
          </CardTitle>
          <CardDescription>Use arrow keys and Enter after opening a menu command.</CardDescription>
        </CardHeader>
        <CardContent>
          <MenuPreview />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu Implementation Examples</CardTitle>
          <CardDescription>Each sample uses the real terminal UI modes from this codebase.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Menu</TabsTrigger>
              <TabsTrigger value="nested">Nested Menus</TabsTrigger>
              <TabsTrigger value="context">Context Menu</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <CodePreview title="Basic Menu" description="Open a focused menu with keyboard navigation." code={basicMenuCode} preview={<MenuPreview />} />
            </TabsContent>

            <TabsContent value="nested">
              <CodePreview title="Nested Menu" description="Model nested routes as labeled items inside the terminal menu mode." code={nestedMenuCode} />
            </TabsContent>

            <TabsContent value="context">
              <CodePreview title="Context Menu" description="Combine menu mode with React state for contextual actions." code={contextMenuCode} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between border-t pt-8">
        <div>
          <h3 className="font-semibold">Next: ASCII Art</h3>
          <p className="text-sm text-muted-foreground">Learn how to create banners and text art in the terminal.</p>
        </div>
        <Button asChild>
          <Link href="/docs/examples/ascii">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
