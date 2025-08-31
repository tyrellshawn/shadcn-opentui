"use client"

import { Menu, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Terminal as TerminalComponent } from "@/components/ui/terminal"
import { CodePreview } from "@/components/docs/code-preview"

export default function MenuExamplePage() {
  const menuCommands = [
    {
      name: "menu",
      description: "Show interactive menu",
      handler: async (args: string[], context?: any) => {
        if (!context) return

        const menuItems =
          args.length > 0 ? args : ["New Project", "Open Project", "Recent Files", "Settings", "Help", "Exit"]

        context.setState((prev: any) => ({
          ...prev,
          mode: "ui",
          activeComponent: {
            id: `menu-${Date.now()}`,
            type: "menu",
            props: { items: menuItems },
            active: true,
          },
          menuSelection: 0,
        }))
      },
    },
    {
      name: "submenu",
      description: "Show nested menu example",
      handler: async (args: string[], context?: any) => {
        if (!context) return

        context.setState((prev: any) => ({
          ...prev,
          mode: "ui",
          activeComponent: {
            id: `submenu-${Date.now()}`,
            type: "menu",
            props: {
              items: ["File > New", "File > Open", "Edit > Copy", "Edit > Paste", "View > Zoom In", "View > Zoom Out"],
            },
            active: true,
          },
          menuSelection: 0,
        }))
      },
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Interactive Menu Example</h1>
        <p className="text-lg text-muted-foreground">
          Build navigable menus with keyboard controls, nested submenus, and dynamic content using OpenTUI components.
        </p>
      </div>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5 text-blue-500" />
            Interactive Menu Demo
          </CardTitle>
          <CardDescription>
            Try the menu system below. Use 'menu' for basic menu, 'submenu' for nested menu example.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TerminalComponent
            variant="default"
            className="h-80"
            commands={menuCommands}
            welcomeMessage={[
              "Interactive Menu Demo - OpenTUI React",
              "Commands: menu, submenu, help",
              "Use ↑↓ arrows to navigate, ENTER to select, ESC to exit",
              "",
            ]}
          />
        </CardContent>
      </Card>

      {/* Implementation Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Implementation Examples</CardTitle>
          <CardDescription>Different types of menu systems you can build with OpenTUI</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Menu</TabsTrigger>
              <TabsTrigger value="nested">Nested Menus</TabsTrigger>
              <TabsTrigger value="context">Context Menu</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Basic Navigation Menu</h4>
                <p className="text-sm text-muted-foreground">
                  A simple menu with keyboard navigation and selection handling.
                </p>
              </div>
              <CodePreview
                title="Basic Menu Component"
                code={`import { useState } from "react"
import { useInput } from "@opentui/react"

function BasicMenu({ items, onSelect, title }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1))
    } else if (key.downArrow) {
      setSelectedIndex(prev => Math.min(items.length - 1, prev + 1))
    } else if (key.return) {
      onSelect?.(items[selectedIndex], selectedIndex)
    }
  })
  
  return (
    <box flexDirection="column" borderStyle="single" padding={1}>
      {title && (
        <text bold fg="#00FF00" marginBottom={1} textAlign="center">
          {title}
        </text>
      )}
      
      {items.map((item, index) => (
        <box key={index} marginBottom={0.5}>
          <text
            bg={index === selectedIndex ? "#0000FF" : undefined}
            fg={index === selectedIndex ? "#FFFFFF" : "#CCCCCC"}
            bold={index === selectedIndex}
            padding={0.5}
            width="100%"
          >
            {index === selectedIndex ? "► " : "  "}
            {typeof item === "string" ? item : item.label}
          </text>
        </box>
      ))}
      
      <box marginTop={1} borderTop borderColor="#333333" paddingTop={1}>
        <text fg="#888888" textAlign="center">
          ↑↓: Navigate | Enter: Select
        </text>
      </box>
    </box>
  )
}

// Usage
function MainMenu() {
  const menuItems = [
    "New Project",
    "Open Project",
    "Recent Files",
    "Settings",
    "Help",
    "Exit"
  ]
  
  const handleSelect = (item, index) => {
    console.log(\`Selected: \${item} (index: \${index})\`)
    
    switch (item) {
      case "New Project":
        console.log("Creating new project...")
        break
      case "Exit":
        process.exit(0)
        break
      default:
        console.log(\`Opening \${item}...\`)
    }
  }
  
  return (
    <BasicMenu
      title="Main Menu"
      items={menuItems}
      onSelect={handleSelect}
    />
  )
}

render(<MainMenu />)`}
              />
            </TabsContent>

            <TabsContent value="nested" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Nested Menu System</h4>
                <p className="text-sm text-muted-foreground">
                  Multi-level menus with breadcrumb navigation and back functionality.
                </p>
              </div>
              <CodePreview
                title="Nested Menu Component"
                code={`import { useState } from "react"

function NestedMenu({ menuStructure, onSelect }) {
  const [currentPath, setCurrentPath] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const getCurrentMenu = () => {
    let current = menuStructure
    for (const pathItem of currentPath) {
      current = current.find(item => item.label === pathItem)?.children || []
    }
    return current
  }
  
  const currentMenu = getCurrentMenu()
  const breadcrumb = currentPath.join(" > ")
  
  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1))
    } else if (key.downArrow) {
      setSelectedIndex(prev => Math.min(currentMenu.length - 1, prev + 1))
    } else if (key.return) {
      const selectedItem = currentMenu[selectedIndex]
      
      if (selectedItem.children) {
        // Navigate into submenu
        setCurrentPath(prev => [...prev, selectedItem.label])
        setSelectedIndex(0)
      } else {
        // Execute action
        onSelect?.(selectedItem, [...currentPath, selectedItem.label])
      }
    } else if (key.escape || (key.leftArrow && currentPath.length > 0)) {
      // Go back
      setCurrentPath(prev => prev.slice(0, -1))
      setSelectedIndex(0)
    }
  })
  
  return (
    <box flexDirection="column" borderStyle="double" padding={1}>
      {/* Header with breadcrumb */}
      <box marginBottom={1} borderBottom borderColor="#333333" paddingBottom={1}>
        <text bold fg="#00FFFF">
          📁 {breadcrumb || "Main Menu"}
        </text>
      </box>
      
      {/* Back option for submenus */}
      {currentPath.length > 0 && (
        <box marginBottom={1}>
          <text
            bg={selectedIndex === -1 ? "#0000FF" : undefined}
            fg={selectedIndex === -1 ? "#FFFFFF" : "#888888"}
            italic
          >
            ← Back
          </text>
        </box>
      )}
      
      {/* Menu items */}
      {currentMenu.map((item, index) => (
        <box key={index} marginBottom={0.5}>
          <text
            bg={index === selectedIndex ? "#0000FF" : undefined}
            fg={index === selectedIndex ? "#FFFFFF" : "#CCCCCC"}
            bold={index === selectedIndex}
            padding={0.5}
            width="100%"
          >
            {index === selectedIndex ? "► " : "  "}
            {item.children ? "📁 " : "📄 "}
            {item.label}
            {item.children && " →"}
          </text>
          
          {item.description && (
            <text fg="#888888" marginLeft={4} italic>
              {item.description}
            </text>
          )}
        </box>
      ))}
      
      {/* Footer */}
      <box marginTop={1} borderTop borderColor="#333333" paddingTop={1}>
        <text fg="#888888" textAlign="center">
          ↑↓: Navigate | →/Enter: Open | ←/Esc: Back
        </text>
      </box>
    </box>
  )
}

// Usage
function FileExplorer() {
  const fileStructure = [
    {
      label: "File",
      children: [
        { label: "New", description: "Create new file" },
        { label: "Open", description: "Open existing file" },
        { label: "Save", description: "Save current file" },
        {
          label: "Recent",
          children: [
            { label: "project1.txt" },
            { label: "config.json" },
            { label: "readme.md" }
          ]
        }
      ]
    },
    {
      label: "Edit",
      children: [
        { label: "Cut", description: "Cut selection" },
        { label: "Copy", description: "Copy selection" },
        { label: "Paste", description: "Paste from clipboard" },
        {
          label: "Find",
          children: [
            { label: "Find in File" },
            { label: "Find in Project" },
            { label: "Replace" }
          ]
        }
      ]
    },
    {
      label: "View",
      children: [
        { label: "Zoom In" },
        { label: "Zoom Out" },
        { label: "Toggle Sidebar" }
      ]
    }
  ]
  
  const handleSelect = (item, path) => {
    console.log(\`Selected: \${item.label}\`)
    console.log(\`Path: \${path.join(" > ")}\`)
  }
  
  return (
    <NestedMenu
      menuStructure={fileStructure}
      onSelect={handleSelect}
    />
  )
}

render(<FileExplorer />)`}
              />
            </TabsContent>

            <TabsContent value="context" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Context Menu System</h4>
                <p className="text-sm text-muted-foreground">
                  Dynamic context menus that appear based on user actions and current state.
                </p>
              </div>
              <CodePreview
                title="Context Menu Component"
                code={`import { useState, useEffect } from "react"

function ContextMenu({ 
  items, 
  position, 
  onSelect, 
  onClose,
  visible = true 
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  useInput((input, key) => {
    if (!visible) return
    
    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1))
    } else if (key.downArrow) {
      setSelectedIndex(prev => Math.min(items.length - 1, prev + 1))
    } else if (key.return) {
      onSelect?.(items[selectedIndex], selectedIndex)
    } else if (key.escape) {
      onClose?.()
    }
  })
  
  if (!visible) return null
  
  return (
    <box
      position="absolute"
      top={position?.y || 0}
      left={position?.x || 0}
      borderStyle="single"
      borderColor="#FFFF00"
      backgroundColor="#000000"
      padding={0.5}
      zIndex={1000}
    >
      {items.map((item, index) => (
        <box key={index}>
          <text
            bg={index === selectedIndex ? "#FFFF00" : undefined}
            fg={index === selectedIndex ? "#000000" : "#FFFFFF"}
            padding={0.5}
            minWidth={15}
          >
            {item.icon && \`\${item.icon} \`}
            {item.label}
            {item.shortcut && (
              <text fg="#888888" marginLeft={2}>
                {item.shortcut}
              </text>
            )}
          </text>
          
          {item.separator && (
            <box borderBottom borderColor="#333333" marginY={0.5} />
          )}
        </box>
      ))}
    </box>
  )
}

function ContextMenuDemo() {
  const [contextMenu, setContextMenu] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  
  const files = [
    { name: "document.txt", type: "text" },
    { name: "image.png", type: "image" },
    { name: "script.js", type: "code" },
    { name: "data.json", type: "data" }
  ]
  
  const getContextMenuItems = (file) => {
    const baseItems = [
      { label: "Open", icon: "📂", shortcut: "Enter" },
      { label: "Rename", icon: "✏️", shortcut: "F2" },
      { separator: true },
      { label: "Copy", icon: "📋", shortcut: "Ctrl+C" },
      { label: "Cut", icon: "✂️", shortcut: "Ctrl+X" },
      { separator: true },
      { label: "Delete", icon: "🗑️", shortcut: "Del" }
    ]
    
    // Add file-type specific options
    if (file.type === "image") {
      baseItems.splice(1, 0, { label: "Preview", icon: "👁️" })
    } else if (file.type === "code") {
      baseItems.splice(1, 0, { label: "Run", icon: "▶️" })
    }
    
    return baseItems
  }
  
  const handleFileAction = (file, action) => {
    console.log(\`\${action} on \${file.name}\`)
    setContextMenu(null)
  }
  
  const showContextMenu = (file, position) => {
    setSelectedFile(file)
    setContextMenu({
      items: getContextMenuItems(file),
      position,
      onSelect: (item) => handleFileAction(file, item.label),
      onClose: () => setContextMenu(null)
    })
  }
  
  useInput((input, key) => {
    if (key.name === "c" && key.ctrl) {
      // Simulate right-click on selected file
      if (selectedFile) {
        showContextMenu(selectedFile, { x: 20, y: 10 })
      }
    }
  })
  
  return (
    <box flexDirection="column" padding={2}>
      <text bold fg="#00FFFF" marginBottom={2}>
        📁 File Explorer (Context Menu Demo)
      </text>
      
      <box flexDirection="column" marginBottom={2}>
        {files.map((file, index) => (
          <text
            key={index}
            bg={selectedFile === file ? "#333333" : undefined}
            fg="#CCCCCC"
            padding={0.5}
            onClick={() => setSelectedFile(file)}
            onRightClick={() => showContextMenu(file, { x: 25, y: index + 3 })}
          >
            {file.type === "text" && "📄"}
            {file.type === "image" && "🖼️"}
            {file.type === "code" && "📜"}
            {file.type === "data" && "📊"}
            {" " + file.name}
          </text>
        ))}
      </box>
      
      <text fg="#888888">
        Click files to select, Ctrl+C for context menu
      </text>
      
      {contextMenu && (
        <ContextMenu
          items={contextMenu.items}
          position={contextMenu.position}
          onSelect={contextMenu.onSelect}
          onClose={contextMenu.onClose}
        />
      )}
    </box>
  )
}

render(<ContextMenuDemo />)`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Menu Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Navigation Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Implement intuitive keyboard navigation and selection patterns.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Arrow key navigation</li>
              <li>• Enter to select items</li>
              <li>• Escape to go back/cancel</li>
              <li>• Visual selection indicators</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Add sophisticated menu behaviors and interactions.</p>
            <ul className="text-sm space-y-1">
              <li>• Nested submenu support</li>
              <li>• Context-sensitive menus</li>
              <li>• Breadcrumb navigation</li>
              <li>• Dynamic menu generation</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <div className="flex justify-between items-center pt-8 border-t">
        <div>
          <h3 className="font-semibold">Next: ASCII Art</h3>
          <p className="text-sm text-muted-foreground">Learn how to create and display ASCII art in terminal apps</p>
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
