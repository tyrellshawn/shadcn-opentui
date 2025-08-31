"use client"

import { Puzzle, Code, Layers, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { CodePreview } from "@/components/docs/code-preview"

export default function CustomComponentsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Custom Components</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to create reusable custom components for your OpenTUI applications.
        </p>
      </div>

      {/* Component Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="h-5 w-5 text-blue-500" />
              Composite Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Combine existing OpenTUI components into reusable units.
            </p>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs">
                Forms
              </Badge>
              <Badge variant="outline" className="text-xs">
                Dialogs
              </Badge>
              <Badge variant="outline" className="text-xs">
                Menus
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-green-500" />
              Custom Primitives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Create new primitive components with custom rendering logic.
            </p>
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs">
                Charts
              </Badge>
              <Badge variant="outline" className="text-xs">
                Progress Bars
              </Badge>
              <Badge variant="outline" className="text-xs">
                Tables
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Composite Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-blue-500" />
            Composite Components
          </CardTitle>
          <CardDescription>Build complex UI components by combining OpenTUI primitives</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="dialog">Dialog</TabsTrigger>
              <TabsTrigger value="menu">Menu</TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Custom Form Component</h4>
                <p className="text-sm text-muted-foreground">
                  Create a reusable form component with validation and submission handling.
                </p>
              </div>
              <CodePreview
                title="Form Component"
                code={`function Form({ fields, onSubmit, title }) {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [currentField, setCurrentField] = useState(0)
  
  const updateValue = (fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }))
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    fields.forEach(field => {
      if (field.required && !values[field.name]) {
        newErrors[field.name] = \`\${field.label} is required\`
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit?.(values)
    }
  }
  
  useInput((input, key) => {
    if (key.tab) {
      setCurrentField(prev => (prev + 1) % fields.length)
    } else if (key.return && key.ctrl) {
      handleSubmit()
    }
  })
  
  return (
    <box flexDirection="column" padding={1} borderStyle="single">
      {title && (
        <text bold fg="#00FF00" marginBottom={1}>
          {title}
        </text>
      )}
      
      {fields.map((field, index) => (
        <box key={field.name} flexDirection="column" marginBottom={1}>
          <text 
            fg={index === currentField ? "#FFFF00" : "#CCCCCC"}
            bold={index === currentField}
          >
            {field.label}:
          </text>
          <input
            value={values[field.name] || ""}
            onChange={(value) => updateValue(field.name, value)}
            placeholder={field.placeholder}
            mask={field.type === "password" ? "*" : undefined}
            focus={index === currentField}
          />
          {errors[field.name] && (
            <text fg="#FF0000" italic>
              {errors[field.name]}
            </text>
          )}
        </box>
      ))}
      
      <box marginTop={1}>
        <text fg="#888888">
          TAB: Next field | Ctrl+Enter: Submit
        </text>
      </box>
    </box>
  )
}

// Usage
function LoginForm() {
  const fields = [
    { name: "username", label: "Username", required: true },
    { name: "password", label: "Password", type: "password", required: true }
  ]
  
  return (
    <Form
      title="Login"
      fields={fields}
      onSubmit={(values) => console.log("Login:", values)}
    />
  )
}`}
              />
            </TabsContent>

            <TabsContent value="dialog" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Dialog Component</h4>
                <p className="text-sm text-muted-foreground">
                  Create modal dialogs with customizable content and actions.
                </p>
              </div>
              <CodePreview
                title="Dialog Component"
                code={`function Dialog({ 
  title, 
  children, 
  actions = [], 
  onClose, 
  width = 40, 
  height = 10 
}) {
  const [selectedAction, setSelectedAction] = useState(0)
  
  useInput((input, key) => {
    if (key.escape) {
      onClose?.()
    } else if (key.leftArrow) {
      setSelectedAction(prev => Math.max(0, prev - 1))
    } else if (key.rightArrow) {
      setSelectedAction(prev => Math.min(actions.length - 1, prev + 1))
    } else if (key.return) {
      actions[selectedAction]?.onPress?.()
    }
  })
  
  return (
    <box
      position="absolute"
      top="50%"
      left="50%"
      width={width}
      height={height}
      borderStyle="double"
      borderColor="#00FF00"
      backgroundColor="#000000"
    >
      {/* Title Bar */}
      <box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={1}
        backgroundColor="#00FF00"
        justifyContent="center"
      >
        <text fg="#000000" bold>
          {title}
        </text>
      </box>
      
      {/* Content */}
      <box
        position="absolute"
        top={2}
        left={1}
        right={1}
        bottom={3}
        flexDirection="column"
      >
        {children}
      </box>
      
      {/* Actions */}
      <box
        position="absolute"
        bottom={1}
        left={1}
        right={1}
        justifyContent="center"
        gap={2}
      >
        {actions.map((action, index) => (
          <text
            key={index}
            bg={index === selectedAction ? "#0000FF" : undefined}
            fg={index === selectedAction ? "#FFFFFF" : "#CCCCCC"}
            bold={index === selectedAction}
          >
            [{action.label}]
          </text>
        ))}
      </box>
    </box>
  )
}

// Usage
function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <Dialog
      title="Confirm Action"
      actions={[
        { label: "Cancel", onPress: onCancel },
        { label: "Confirm", onPress: onConfirm }
      ]}
      onClose={onCancel}
    >
      <text>Are you sure you want to continue?</text>
      <text fg="#888888" marginTop={1}>
        Use arrow keys to navigate, Enter to select
      </text>
    </Dialog>
  )
}`}
              />
            </TabsContent>

            <TabsContent value="menu" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Menu Component</h4>
                <p className="text-sm text-muted-foreground">
                  Create navigable menus with keyboard support and custom styling.
                </p>
              </div>
              <CodePreview
                title="Menu Component"
                code={`function Menu({ items, onSelect, title, selectedIndex = 0 }) {
  const [selected, setSelected] = useState(selectedIndex)
  
  useInput((input, key) => {
    if (key.upArrow) {
      setSelected(prev => Math.max(0, prev - 1))
    } else if (key.downArrow) {
      setSelected(prev => Math.min(items.length - 1, prev + 1))
    } else if (key.return) {
      onSelect?.(items[selected], selected)
    }
  })
  
  return (
    <box flexDirection="column" borderStyle="single" padding={1}>
      {title && (
        <text bold fg="#00FF00" marginBottom={1}>
          {title}
        </text>
      )}
      
      {items.map((item, index) => (
        <box key={index} marginBottom={index < items.length - 1 ? 1 : 0}>
          <text
            bg={index === selected ? "#0000FF" : undefined}
            fg={index === selected ? "#FFFFFF" : "#CCCCCC"}
            bold={index === selected}
          >
            {index === selected ? "► " : "  "}
            {typeof item === "string" ? item : item.label}
          </text>
          {typeof item === "object" && item.description && (
            <text fg="#888888" marginLeft={4}>
              {item.description}
            </text>
          )}
        </box>
      ))}
      
      <box marginTop={1} borderTop borderColor="#333333">
        <text fg="#888888">
          ↑↓: Navigate | Enter: Select
        </text>
      </box>
    </box>
  )
}

// Usage
function MainMenu() {
  const menuItems = [
    { label: "New Project", description: "Create a new project" },
    { label: "Open Project", description: "Open existing project" },
    { label: "Settings", description: "Configure application" },
    { label: "Exit", description: "Quit application" }
  ]
  
  return (
    <Menu
      title="Main Menu"
      items={menuItems}
      onSelect={(item, index) => {
        console.log(\`Selected: \${item.label}\`)
      }}
    />
  )
}`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Custom Primitives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-green-500" />
            Custom Primitives
          </CardTitle>
          <CardDescription>Create new primitive components with custom rendering and behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">ASCII Chart Component</h4>
                <p className="text-sm text-muted-foreground">Render data visualizations using ASCII characters.</p>
              </div>
              <CodePreview
                title="Bar Chart"
                code={`function BarChart({ data, width = 40, height = 10, title }) {
  const maxValue = Math.max(...data.map(d => d.value))
  const scale = height / maxValue
  
  const renderBar = (value, label, index) => {
    const barHeight = Math.round(value * scale)
    const emptyHeight = height - barHeight
    
    return (
      <box key={index} flexDirection="column" marginRight={1}>
        {/* Empty space */}
        {Array.from({ length: emptyHeight }, (_, i) => (
          <text key={i}> </text>
        ))}
        
        {/* Bar */}
        {Array.from({ length: barHeight }, (_, i) => (
          <text key={i} bg="#00FF00"> </text>
        ))}
        
        {/* Label */}
        <text fg="#CCCCCC" marginTop={1}>
          {label.slice(0, 3)}
        </text>
        
        {/* Value */}
        <text fg="#888888">
          {value}
        </text>
      </box>
    )
  }
  
  return (
    <box flexDirection="column" borderStyle="single" padding={1}>
      {title && (
        <text bold fg="#00FF00" marginBottom={1}>
          {title}
        </text>
      )}
      
      <box flexDirection="row" alignItems="flex-end">
        {data.map((item, index) => 
          renderBar(item.value, item.label, index)
        )}
      </box>
      
      <box marginTop={1} borderTop borderColor="#333333">
        <text fg="#888888">
          Max: {maxValue} | Scale: 1:{Math.round(maxValue / height)}
        </text>
      </box>
    </box>
  )
}

// Usage
function SalesChart() {
  const salesData = [
    { label: "Jan", value: 120 },
    { label: "Feb", value: 150 },
    { label: "Mar", value: 180 },
    { label: "Apr", value: 90 },
    { label: "May", value: 200 }
  ]
  
  return (
    <BarChart
      title="Monthly Sales"
      data={salesData}
      width={30}
      height={8}
    />
  )
}`}
              />
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Progress Bar Component</h4>
                <p className="text-sm text-muted-foreground">
                  Create animated progress indicators with customizable styles.
                </p>
              </div>
              <CodePreview
                title="Progress Bar"
                code={`function ProgressBar({ 
  value, 
  max = 100, 
  width = 30, 
  showPercentage = true,
  showValue = true,
  animated = false,
  color = "#00FF00"
}) {
  const percentage = Math.round((value / max) * 100)
  const filledWidth = Math.round((value / max) * width)
  const emptyWidth = width - filledWidth
  
  const [animationFrame, setAnimationFrame] = useState(0)
  
  useEffect(() => {
    if (!animated) return
    
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 4)
    }, 200)
    
    return () => clearInterval(interval)
  }, [animated])
  
  const getAnimatedChar = () => {
    const chars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    return chars[animationFrame % chars.length]
  }
  
  return (
    <box flexDirection="column">
      <box alignItems="center">
        <text>[</text>
        <text fg={color}>
          {"█".repeat(filledWidth)}
        </text>
        <text fg="#333333">
          {"░".repeat(emptyWidth)}
        </text>
        <text>]</text>
        
        {showPercentage && (
          <text marginLeft={1} fg="#CCCCCC">
            {percentage}%
          </text>
        )}
        
        {showValue && (
          <text marginLeft={1} fg="#888888">
            ({value}/{max})
          </text>
        )}
        
        {animated && value < max && (
          <text marginLeft={1} fg={color}>
            {getAnimatedChar()}
          </text>
        )}
      </box>
    </box>
  )
}

// Usage
function DownloadProgress() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 500)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <box flexDirection="column">
      <text marginBottom={1}>Downloading file...</text>
      <ProgressBar
        value={progress}
        max={100}
        width={40}
        animated={progress < 100}
        color="#00FFFF"
      />
    </box>
  )
}`}
              />
            </TabsContent>

            <TabsContent value="table" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Data Table Component</h4>
                <p className="text-sm text-muted-foreground">
                  Display tabular data with sorting, filtering, and navigation.
                </p>
              </div>
              <CodePreview
                title="Data Table"
                code={`function DataTable({ 
  columns, 
  data, 
  sortable = true, 
  selectable = true 
}) {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedRow, setSelectedRow] = useState(0)
  
  const sortedData = useMemo(() => {
    if (!sortColumn) return data
    
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]
      
      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }, [data, sortColumn, sortDirection])
  
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }
  
  useInput((input, key) => {
    if (key.upArrow && selectable) {
      setSelectedRow(prev => Math.max(0, prev - 1))
    } else if (key.downArrow && selectable) {
      setSelectedRow(prev => Math.min(data.length - 1, prev + 1))
    }
  })
  
  const getColumnWidth = (column) => {
    const headerWidth = column.title.length
    const dataWidth = Math.max(
      ...data.map(row => String(row[column.key]).length)
    )
    return Math.max(headerWidth, dataWidth) + 2
  }
  
  return (
    <box flexDirection="column" borderStyle="single">
      {/* Header */}
      <box borderBottom borderColor="#333333">
        {columns.map((column, index) => (
          <text
            key={column.key}
            width={getColumnWidth(column)}
            bold
            fg="#00FF00"
            onClick={sortable ? () => handleSort(column.key) : undefined}
          >
            {column.title}
            {sortColumn === column.key && (
              <text fg="#FFFF00">
                {sortDirection === "asc" ? " ↑" : " ↓"}
              </text>
            )}
          </text>
        ))}
      </box>
      
      {/* Data Rows */}
      {sortedData.map((row, rowIndex) => (
        <box
          key={rowIndex}
          bg={selectable && rowIndex === selectedRow ? "#0000FF" : undefined}
        >
          {columns.map((column) => (
            <text
              key={column.key}
              width={getColumnWidth(column)}
              fg={selectable && rowIndex === selectedRow ? "#FFFFFF" : "#CCCCCC"}
            >
              {String(row[column.key])}
            </text>
          ))}
        </box>
      ))}
      
      {/* Footer */}
      <box borderTop borderColor="#333333" marginTop={1}>
        <text fg="#888888">
          {data.length} rows | ↑↓: Navigate
          {sortable && " | Click headers to sort"}
        </text>
      </box>
    </box>
  )
}

// Usage
function UserTable() {
  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "status", title: "Status" }
  ]
  
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com", status: "Active" },
    { id: 2, name: "Bob", email: "bob@example.com", status: "Inactive" },
    { id: 3, name: "Charlie", email: "charlie@example.com", status: "Active" }
  ]
  
  return (
    <DataTable
      columns={columns}
      data={users}
      sortable
      selectable
    />
  )
}`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Component Composition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-500" />
            Component Composition
          </CardTitle>
          <CardDescription>Best practices for composing and organizing custom components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Higher-Order Components</h4>
            <p className="text-sm text-muted-foreground">
              Create reusable behavior patterns using HOCs and render props.
            </p>
          </div>
          <CodePreview
            title="HOC Pattern"
            code={`// Higher-Order Component for focus management
function withFocus(WrappedComponent) {
  return function FocusableComponent(props) {
    const { isFocused } = useFocus()
    
    return (
      <WrappedComponent
        {...props}
        isFocused={isFocused}
        focusProps={{
          bg: isFocused ? "#0000FF" : undefined,
          fg: isFocused ? "#FFFFFF" : "#CCCCCC"
        }}
      />
    )
  }
}

// Render Props Pattern
function FocusProvider({ children }) {
  const { isFocused, focus, blur } = useFocus()
  
  return children({
    isFocused,
    focus,
    blur,
    focusProps: {
      bg: isFocused ? "#0000FF" : undefined,
      fg: isFocused ? "#FFFFFF" : "#CCCCCC"
    }
  })
}

// Usage
const FocusableButton = withFocus(({ children, focusProps, onClick }) => (
  <text {...focusProps} onClick={onClick}>
    {children}
  </text>
))

function MenuWithRenderProps() {
  return (
    <FocusProvider>
      {({ isFocused, focusProps }) => (
        <text {...focusProps}>
          {isFocused ? "► " : "  "}Menu Item
        </text>
      )}
    </FocusProvider>
  )
}`}
          />
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="flex justify-between items-center pt-8 border-t">
        <div>
          <h3 className="font-semibold">Next: Examples</h3>
          <p className="text-sm text-muted-foreground">Explore practical examples and use cases</p>
        </div>
        <Button asChild>
          <Link href="/docs/examples/login">
            View Examples
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
