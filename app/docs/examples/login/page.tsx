"use client"

import Link from "next/link"
import { ArrowRight, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodePreview } from "@/components/docs/code-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal as TerminalComponent } from "@/components/ui/terminal"

function LoginPreview() {
  return (
    <TerminalComponent
      className="h-72"
      commands={{
        login: {
          name: "login",
          description: "Open the login form",
          handler: (_args, context) => {
            context?.setState?.((prev: { formData: Record<string, string> }) => ({
              ...prev,
              formData: {},
              mode: "form",
              activeComponent: {
                id: `login-${Date.now()}`,
                type: "form",
                props: { fields: ["username", "password"] },
                active: true,
              },
            }))
            context?.addLine?.("Enter a username and password, then press Enter.", "success")
          },
        },
        demo: {
          name: "demo",
          description: "Show a sample success state",
          handler: (_args, context) => {
            context?.addLine?.("Signed in as demo-user.", "success")
            context?.addLine?.("Role: maintainer", "output")
          },
        },
      }}
      welcomeMessage={[
        "Login Form Demo",
        "Run 'login' to open a form or 'demo' to show a successful sign-in.",
      ]}
    />
  )
}

const basicLoginCode = `import { Terminal } from "@/components/ui/terminal"

export function LoginTerminal() {
  return (
    <Terminal
      commands={{
        login: {
          name: "login",
          description: "Open the login form",
          handler: (_args, context) => {
            context?.setState?.((prev) => ({
              ...prev,
              formData: {},
              mode: "form",
              activeComponent: {
                id: \`login-\${Date.now()}\`,
                type: "form",
                props: { fields: ["username", "password"] },
                active: true,
              },
            }))
            context?.addLine?.("Enter a username and password, then press Enter.", "success")
          },
        },
      }}
      welcomeMessage={["Run 'login' to open the form."]}
      className="h-72"
    />
  )
}`

const validationCode = `import { useState } from "react"
import { Terminal } from "@/components/ui/terminal"

export function ValidatedLoginTerminal() {
  const [lastAttempt, setLastAttempt] = useState<string | null>(null)

  return (
    <Terminal
      commands={{
        validate: {
          name: "validate",
          description: "Validate the latest login attempt",
          handler: (_args, context) => {
            const formData = context?.state?.formData
            const username = formData?.username?.trim()
            const password = formData?.password?.trim()

            if (!username || !password) {
              context?.addLine?.("Missing username or password.", "error")
              return
            }

            setLastAttempt(username)
            context?.addLine?.(\`Validated credentials for \${username}.\`, "success")
          },
        },
      }}
      welcomeMessage={[
        "Use the form first, then run 'validate'.",
        lastAttempt ? \`Last validated user: \${lastAttempt}\` : "No validated login yet.",
      ]}
      className="h-72"
    />
  )
}`

const advancedCode = `import { useState } from "react"
import { Terminal } from "@/components/ui/terminal"

export function AuthFlowTerminal() {
  const [rememberedUser, setRememberedUser] = useState<string | null>(null)

  return (
    <Terminal
      commands={{
        remember: {
          name: "remember",
          description: "Persist the last successful username",
          handler: (_args, context) => {
            const username = context?.state?.formData?.username

            if (!username) {
              context?.addLine?.("Submit the login form before remembering a user.", "error")
              return
            }

            setRememberedUser(username)
            context?.addLine?.(\`Remembered \${username} for the next session.\`, "success")
          },
        },
      }}
      welcomeMessage={[
        "Run 'login' to open the form.",
        rememberedUser ? \`Remembered user: \${rememberedUser}\` : "No remembered user yet.",
      ]}
      className="h-72"
    />
  )
}`

export default function LoginExamplePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Login Form Example</h1>
        <p className="text-lg text-muted-foreground">
          Build a browser-based terminal login flow with real forms, validation, and persistent state.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-green-500" />
            Interactive Login Demo
          </CardTitle>
          <CardDescription>Try the live login flow before copying the implementation.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginPreview />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Examples</CardTitle>
          <CardDescription>Real code samples based on the same terminal patterns used in the live demo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Form</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="advanced">Remember Me</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <CodePreview title="Basic Login Form" description="Open a real form inside the terminal." code={basicLoginCode} preview={<LoginPreview />} />
            </TabsContent>

            <TabsContent value="validation">
              <CodePreview title="Validated Login Flow" description="Validate submitted credentials from terminal state." code={validationCode} />
            </TabsContent>

            <TabsContent value="advanced">
              <CodePreview title="Remembered Session" description="Persist the last successful sign-in in React state." code={advancedCode} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Why this pattern works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Use `context.setState` to open built-in terminal UI modes, then read `context.state.formData` from follow-up
            commands to validate or persist submissions.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next step</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Connect the same command handlers to your auth API, then add optimistic loading lines and error handling.
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between border-t pt-8">
        <div>
          <h3 className="font-semibold">Next: Interactive Menu</h3>
          <p className="text-sm text-muted-foreground">Learn how to build navigable menus with keyboard controls.</p>
        </div>
        <Button asChild>
          <Link href="/docs/examples/menu">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
