"use client"

import { LogIn, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Terminal as TerminalComponent } from "@/components/ui/terminal"
import { CodePreview } from "@/components/docs/code-preview"
import { useState } from "react"

export default function LoginExamplePage() {
  const [showPassword, setShowPassword] = useState(false)

  const loginCommands = [
    {
      name: "login",
      description: "Start interactive login form",
      handler: async (args: string[], context?: any) => {
        if (!context) return

        context.setState((prev: any) => ({
          ...prev,
          mode: "form",
          activeComponent: {
            id: `login-${Date.now()}`,
            type: "form",
            props: {
              fields: ["username", "password"],
              title: "Login Form",
              submitText: "Sign In",
            },
            active: true,
          },
        }))
      },
    },
    {
      name: "demo-login",
      description: "Demo login with sample credentials",
      handler: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log("Login successful! Welcome, demo user.")
            resolve(undefined)
          }, 1500)
        })
      },
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Login Form Example</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to build interactive login forms using OpenTUI components with validation, state management, and
          user feedback.
        </p>
      </div>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-green-500" />
            Interactive Login Demo
          </CardTitle>
          <CardDescription>
            Try the login form in the terminal below. Type 'login' to start the interactive form, or 'demo-login' for a
            quick demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TerminalComponent
            variant="default"
            className="h-80"
            commands={loginCommands}
            welcomeMessage={["Login Form Demo - OpenTUI React", "Commands: login, demo-login, help", ""]}
          />
        </CardContent>
      </Card>

      {/* Implementation Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Examples</CardTitle>
          <CardDescription>Different approaches to building login forms with OpenTUI</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Form</TabsTrigger>
              <TabsTrigger value="validation">With Validation</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Basic Login Form</h4>
                <p className="text-sm text-muted-foreground">A simple login form with username and password fields.</p>
              </div>
              <CodePreview
                title="Basic Login Form"
                code={`import { useState } from "react"
import { render } from "@opentui/react"

function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (username === "admin" && password === "password") {
        console.log("Login successful!")
      } else {
        console.log("Invalid credentials")
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <box flexDirection="column" padding={2} borderStyle="single">
      <text bold fg="#00FF00" marginBottom={2}>
        🔐 Login Form
      </text>
      
      <box flexDirection="column" marginBottom={1}>
        <text fg="#CCCCCC">Username:</text>
        <input
          value={username}
          onChange={setUsername}
          placeholder="Enter username"
          disabled={isLoading}
        />
      </box>
      
      <box flexDirection="column" marginBottom={2}>
        <text fg="#CCCCCC">Password:</text>
        <input
          value={password}
          onChange={setPassword}
          placeholder="Enter password"
          mask="*"
          disabled={isLoading}
        />
      </box>
      
      <box justifyContent="center">
        <text
          bg={isLoading ? "#666666" : "#0000FF"}
          fg="#FFFFFF"
          padding={1}
          onClick={!isLoading ? handleSubmit : undefined}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </text>
      </box>
      
      <text fg="#888888" marginTop={1} textAlign="center">
        Demo: admin / password
      </text>
    </box>
  )
}

render(<LoginForm />)`}
              />
            </TabsContent>

            <TabsContent value="validation" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Login Form with Validation</h4>
                <p className="text-sm text-muted-foreground">
                  Enhanced form with field validation, error messages, and better UX.
                </p>
              </div>
              <CodePreview
                title="Validated Login Form"
                code={`import { useState } from "react"

function ValidatedLoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentField, setCurrentField] = useState("username")
  
  const validateField = (field, value) => {
    switch (field) {
      case "username":
        if (!value.trim()) return "Username is required"
        if (value.length < 3) return "Username must be at least 3 characters"
        return null
      case "password":
        if (!value) return "Password is required"
        if (value.length < 6) return "Password must be at least 6 characters"
        return null
      default:
        return null
    }
  }
  
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (formData.username === "admin" && formData.password === "password123") {
        console.log("✅ Login successful!")
        console.log(\`Welcome, \${formData.username}!\`)
      } else {
        setErrors({ general: "Invalid username or password" })
      }
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }
  
  useInput((input, key) => {
    if (key.tab) {
      setCurrentField(prev => prev === "username" ? "password" : "username")
    } else if (key.return && key.ctrl) {
      handleSubmit()
    }
  })
  
  return (
    <box flexDirection="column" padding={2} borderStyle="double" borderColor="#00FF00">
      <text bold fg="#00FF00" marginBottom={2}>
        🔐 Secure Login
      </text>
      
      {errors.general && (
        <box marginBottom={2} padding={1} bg="#330000" borderStyle="single" borderColor="#FF0000">
          <text fg="#FF0000">❌ {errors.general}</text>
        </box>
      )}
      
      <box flexDirection="column" marginBottom={1}>
        <text 
          fg={currentField === "username" ? "#FFFF00" : "#CCCCCC"}
          bold={currentField === "username"}
        >
          Username:
        </text>
        <input
          value={formData.username}
          onChange={(value) => updateField("username", value)}
          placeholder="Enter username (min 3 chars)"
          disabled={isLoading}
          focus={currentField === "username"}
        />
        {errors.username && (
          <text fg="#FF0000" italic marginTop={0.5}>
            {errors.username}
          </text>
        )}
      </box>
      
      <box flexDirection="column" marginBottom={2}>
        <text 
          fg={currentField === "password" ? "#FFFF00" : "#CCCCCC"}
          bold={currentField === "password"}
        >
          Password:
        </text>
        <input
          value={formData.password}
          onChange={(value) => updateField("password", value)}
          placeholder="Enter password (min 6 chars)"
          mask="*"
          disabled={isLoading}
          focus={currentField === "password"}
        />
        {errors.password && (
          <text fg="#FF0000" italic marginTop={0.5}>
            {errors.password}
          </text>
        )}
      </box>
      
      <box justifyContent="center" marginBottom={1}>
        <text
          bg={isLoading ? "#666666" : "#0000FF"}
          fg="#FFFFFF"
          padding={1}
          bold
          onClick={!isLoading ? handleSubmit : undefined}
        >
          {isLoading ? "🔄 Signing in..." : "🚀 Sign In"}
        </text>
      </box>
      
      <box flexDirection="column" borderTop borderColor="#333333" paddingTop={1}>
        <text fg="#888888" textAlign="center">
          Demo credentials: admin / password123
        </text>
        <text fg="#666666" textAlign="center">
          TAB: Switch fields | Ctrl+Enter: Submit
        </text>
      </box>
    </box>
  )
}

render(<ValidatedLoginForm />)`}
              />
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Advanced Login Features</h4>
                <p className="text-sm text-muted-foreground">
                  Full-featured login with remember me, password visibility toggle, and loading states.
                </p>
              </div>
              <CodePreview
                title="Advanced Login Form"
                code={`import { useState, useEffect } from "react"

function AdvancedLoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState(0)
  const [currentField, setCurrentField] = useState("username")
  
  // Load saved credentials
  useEffect(() => {
    const saved = localStorage.getItem("rememberedUser")
    if (saved) {
      const { username } = JSON.parse(saved)
      setFormData(prev => ({ ...prev, username, rememberMe: true }))
    }
  }, [])
  
  // Handle lockout countdown
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setTimeout(() => {
        setLockoutTime(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [lockoutTime])
  
  const handleSubmit = async () => {
    if (lockoutTime > 0) return
    
    setIsLoading(true)
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (formData.username === "admin" && formData.password === "secure123") {
        console.log("✅ Login successful!")
        
        if (formData.rememberMe) {
          localStorage.setItem("rememberedUser", JSON.stringify({
            username: formData.username
          }))
        } else {
          localStorage.removeItem("rememberedUser")
        }
        
        setLoginAttempts(0)
      } else {
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)
        
        if (newAttempts >= 3) {
          setLockoutTime(30) // 30 second lockout
          console.log("🔒 Too many failed attempts. Locked for 30 seconds.")
        } else {
          console.log(\`❌ Invalid credentials. \${3 - newAttempts} attempts remaining.\`)
        }
      }
    } catch (error) {
      console.log("🔥 Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const isLocked = lockoutTime > 0
  const canSubmit = formData.username && formData.password && !isLoading && !isLocked
  
  useInput((input, key) => {
    if (key.tab) {
      const fields = ["username", "password", "rememberMe"]
      const currentIndex = fields.indexOf(currentField)
      const nextIndex = (currentIndex + 1) % fields.length
      setCurrentField(fields[nextIndex])
    } else if (key.return && key.ctrl && canSubmit) {
      handleSubmit()
    } else if (key.name === "p" && key.ctrl) {
      setShowPassword(prev => !prev)
    }
  })
  
  return (
    <box flexDirection="column" padding={3} borderStyle="double" borderColor="#00FFFF">
      {/* Header */}
      <box justifyContent="center" marginBottom={2}>
        <text bold fg="#00FFFF" fontSize="large">
          🔐 SECURE LOGIN PORTAL
        </text>
      </box>
      
      {/* Status Messages */}
      {isLocked && (
        <box marginBottom={2} padding={1} bg="#330000" borderStyle="single" borderColor="#FF0000">
          <text fg="#FF0000">
            🔒 Account locked. Try again in {lockoutTime} seconds.
          </text>
        </box>
      )}
      
      {loginAttempts > 0 && !isLocked && (
        <box marginBottom={2} padding={1} bg="#332200" borderStyle="single" borderColor="#FFAA00">
          <text fg="#FFAA00">
            ⚠️  {3 - loginAttempts} attempts remaining
          </text>
        </box>
      )}
      
      {/* Username Field */}
      <box flexDirection="column" marginBottom={1}>
        <text 
          fg={currentField === "username" ? "#00FFFF" : "#CCCCCC"}
          bold={currentField === "username"}
        >
          👤 Username:
        </text>
        <input
          value={formData.username}
          onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
          placeholder="Enter your username"
          disabled={isLoading || isLocked}
          focus={currentField === "username"}
        />
      </box>
      
      {/* Password Field */}
      <box flexDirection="column" marginBottom={1}>
        <box justifyContent="space-between" alignItems="center">
          <text 
            fg={currentField === "password" ? "#00FFFF" : "#CCCCCC"}
            bold={currentField === "password"}
          >
            🔑 Password:
          </text>
          <text 
            fg="#888888" 
            onClick={() => setShowPassword(prev => !prev)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? "👁️ Hide" : "👁️‍🗨️ Show"} (Ctrl+P)
          </text>
        </box>
        <input
          value={formData.password}
          onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
          placeholder="Enter your password"
          mask={showPassword ? undefined : "*"}
          disabled={isLoading || isLocked}
          focus={currentField === "password"}
        />
      </box>
      
      {/* Remember Me */}
      <box alignItems="center" marginBottom={2}>
        <checkbox
          checked={formData.rememberMe}
          onChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
          disabled={isLoading || isLocked}
          focus={currentField === "rememberMe"}
        />
        <text 
          fg={currentField === "rememberMe" ? "#00FFFF" : "#CCCCCC"}
          marginLeft={1}
        >
          💾 Remember me
        </text>
      </box>
      
      {/* Submit Button */}
      <box justifyContent="center" marginBottom={2}>
        <text
          bg={canSubmit ? "#0066FF" : "#666666"}
          fg="#FFFFFF"
          padding={1}
          bold
          onClick={canSubmit ? handleSubmit : undefined}
          style={{ cursor: canSubmit ? "pointer" : "not-allowed" }}
        >
          {isLoading ? "🔄 Authenticating..." : 
           isLocked ? "🔒 Locked" : 
           "🚀 Sign In"}
        </text>
      </box>
      
      {/* Footer */}
      <box flexDirection="column" borderTop borderColor="#333333" paddingTop={1}>
        <text fg="#888888" textAlign="center">
          Demo: admin / secure123
        </text>
        <text fg="#666666" textAlign="center">
          TAB: Navigate | Ctrl+Enter: Submit | Ctrl+P: Toggle password
        </text>
        <text fg="#444444" textAlign="center">
          Max 3 attempts before 30s lockout
        </text>
      </box>
    </box>
  )
}

render(<AdvancedLoginForm />)`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Form Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Implement real-time validation with custom error messages and visual feedback.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Required field validation</li>
              <li>• Length and format checking</li>
              <li>• Real-time error clearing</li>
              <li>• Visual error indicators</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Add security measures like password masking, attempt limiting, and secure storage.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Password masking/visibility toggle</li>
              <li>• Login attempt limiting</li>
              <li>• Account lockout protection</li>
              <li>• Remember me functionality</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <div className="flex justify-between items-center pt-8 border-t">
        <div>
          <h3 className="font-semibold">Next: Interactive Menu</h3>
          <p className="text-sm text-muted-foreground">Learn how to build navigable menus with keyboard controls</p>
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
