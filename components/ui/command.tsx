'use client'

import * as React from 'react'
import { SearchIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type CommandContextValue = {
  query: string
  setQuery: React.Dispatch<React.SetStateAction<string>>
}

const CommandContext = React.createContext<CommandContextValue | null>(null)

function useCommandContext() {
  const context = React.useContext(CommandContext)

  if (!context) {
    throw new Error('Command components must be used within <Command>')
  }

  return context
}

function Command({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [query, setQuery] = React.useState('')

  return (
    <CommandContext.Provider value={{ query, setQuery }}>
      <div
        data-slot="command"
        className={cn(
          'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  )
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className={cn('overflow-hidden p-0', className)} showCloseButton={showCloseButton}>
        <Command className="[&_button[data-slot=command-item]]:px-2 [&_button[data-slot=command-item]]:py-3">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({ className, value, onChange, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const { query, setQuery } = useCommandContext()

  return (
    <div data-slot="command-input-wrapper" className="flex h-9 items-center gap-2 border-b px-3">
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <input
        data-slot="command-input"
        value={value ?? query}
        onChange={(event) => {
          onChange?.(event)
          if (value === undefined) {
            setQuery(event.target.value)
          }
        }}
        className={cn(
          'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="command-list"
      className={cn('max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', className)}
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="command-empty" className={cn('py-6 text-center text-sm', className)} {...props} />
}

function CommandGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="command-group"
      className={cn('text-foreground overflow-hidden p-1 [&_[data-slot=command-group-heading]]:px-2 [&_[data-slot=command-group-heading]]:py-1.5 [&_[data-slot=command-group-heading]]:text-xs [&_[data-slot=command-group-heading]]:font-medium [&_[data-slot=command-group-heading]]:text-muted-foreground', className)}
      {...props}
    />
  )
}

function CommandSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="command-separator" className={cn('bg-border -mx-1 h-px', className)} {...props} />
}

function CommandItem({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      data-slot="command-item"
      className={cn(
        "hover:bg-accent hover:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-hidden select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function CommandShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span data-slot="command-shortcut" className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)} {...props} />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
