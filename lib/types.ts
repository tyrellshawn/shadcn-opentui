export type CommandHandler = {
  name: string
  description: string
  handler: (args: string[], context?: any) => Promise<void> | void
  category?: "system" | "ui" | "data" | "custom"
  requiresUI?: boolean
}
