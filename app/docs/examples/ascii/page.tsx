"use client"

import { ImageIcon, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Terminal as TerminalComponent } from "@/components/ui/terminal"
import { CodePreview } from "@/components/docs/code-preview"

export default function AsciiExamplePage() {
  const asciiCommands = [
    {
      name: "ascii",
      description: "Generate ASCII art",
      handler: async (args: string[]) => {
        const text = args.join(" ") || "OpenTUI"
        console.log("Generating ASCII art...")

        // Simple ASCII art generator
        const asciiArt = [
          "  ___                   _____ _   _ ___ ",
          " / _ \\ _ __   ___ _ __  |_   _| | | |_ _|",
          "| | | | '_ \\ / _ \\ '_ \\   | | | | | || | ",
          "| |_| | |_) |  __/ | | |  | | | |_| || | ",
          " \\___/| .__/ \\___|_| |_|  |_|  \\___/|___|",
          "      |_|                               ",
        ]

        asciiArt.forEach((line) => console.log(line))
      },
    },
    {
      name: "banner",
      description: "Create text banner",
      handler: async (args: string[]) => {
        const text = args.join(" ") || "HELLO"
        console.log(`Creating banner for: ${text}`)

        // Simple banner generator
        const chars = text.toUpperCase().split("")
        const lines = ["", "", "", "", ""]

        chars.forEach((char) => {
          switch (char) {
            case "H":
              lines[0] += "██   ██ "
              lines[1] += "██   ██ "
              lines[2] += "███████ "
              lines[3] += "██   ██ "
              lines[4] += "██   ██ "
              break
            case "E":
              lines[0] += "███████ "
              lines[1] += "██      "
              lines[2] += "█████   "
              lines[3] += "██      "
              lines[4] += "███████ "
              break
            case "L":
              lines[0] += "██      "
              lines[1] += "██      "
              lines[2] += "██      "
              lines[3] += "██      "
              lines[4] += "███████ "
              break
            case "O":
              lines[0] += " ██████  "
              lines[1] += "██    ██ "
              lines[2] += "██    ██ "
              lines[3] += "██    ██ "
              lines[4] += " ██████  "
              break
            default:
              lines[0] += "        "
              lines[1] += "        "
              lines[2] += "        "
              lines[3] += "        "
              lines[4] += "        "
          }
        })

        lines.forEach((line) => console.log(line))
      },
    },
    {
      name: "art",
      description: "Show predefined ASCII art",
      handler: async (args: string[]) => {
        const artType = args[0] || "logo"

        const artCollection = {
          logo: [
            "    ╔═══════════════════════════════════╗",
            "    ║           OpenTUI React           ║",
            "    ║     Terminal UI Components        ║",
            "    ╚═══════════════════════════════════╝",
            "",
            "         ┌─────────────────────┐",
            "         │  ┌─────┐  ┌─────┐   │",
            "         │  │ TUI │  │ JSX │   │",
            "         │  └─────┘  └─────┘   │",
            "         └─────────────────────┘",
          ],
          cat: ["  /\\_/\\  ", " ( o.o ) ", "  > ^ <  "],
          rocket: [
            "       /\\       ",
            "      /  \\      ",
            "     |    |     ",
            "     | 🚀 |     ",
            "     |____|     ",
            "    /      \\    ",
            "   /__________\\  ",
          ],
        }

        const art = artCollection[artType] || artCollection.logo
        art.forEach((line) => console.log(line))
      },
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">ASCII Art Example</h1>
        <p className="text-lg text-muted-foreground">
          Create and display ASCII art, banners, and visual elements in your terminal applications using OpenTUI.
        </p>
      </div>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            ASCII Art Generator Demo
          </CardTitle>
          <CardDescription>
            Try the ASCII art commands: 'ascii [text]', 'banner [text]', 'art [type]' (logo, cat, rocket).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TerminalComponent
            variant="default"
            className="h-80"
            commands={asciiCommands}
            welcomeMessage={[
              "ASCII Art Generator - OpenTUI React",
              "Commands: ascii, banner, art, help",
              "Try: ascii Hello, banner WORLD, art rocket",
              "",
            ]}
          />
        </CardContent>
      </Card>

      {/* Implementation Examples */}
      <Card>
        <CardHeader>
          <CardTitle>ASCII Art Implementation Examples</CardTitle>
          <CardDescription>Different approaches to creating and displaying ASCII art</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generator">Text Generator</TabsTrigger>
              <TabsTrigger value="animations">Animations</TabsTrigger>
              <TabsTrigger value="interactive">Interactive Art</TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">ASCII Text Generator</h4>
                <p className="text-sm text-muted-foreground">
                  Convert text into ASCII art using predefined character patterns.
                </p>
              </div>
              <CodePreview
                title="ASCII Text Generator"
                code={`function AsciiTextGenerator({ text, font = "block" }) {
  const fonts = {
    block: {
      A: [
        " ██████  ",
        "██    ██ ",
        "████████ ",
        "██    ██ ",
        "██    ██ "
      ],
      B: [
        "██████   ",
        "██   ██  ",
        "██████   ",
        "██   ██  ",
        "██████   "
      ],
      C: [
        " ██████  ",
        "██       ",
        "██       ",
        "██       ",
        " ██████  "
      ],
      // ... more characters
    },
    small: {
      A: ["█▀█", "█▀█", "▀ █"],
      B: ["█▀▄", "█▀▄", "█▄▀"],
      C: ["▄▀█", "█▄▄", "▀▀▀"],
      // ... more characters
    }
  }
  
  const generateAscii = (text, fontData) => {
    const chars = text.toUpperCase().split("").filter(c => fontData[c])
    if (chars.length === 0) return ["No valid characters"]
    
    const height = fontData[chars[0]].length
    const lines = Array(height).fill("").map(() => "")
    
    chars.forEach((char, index) => {
      const charLines = fontData[char] || []
      charLines.forEach((line, lineIndex) => {
        lines[lineIndex] += line + (index < chars.length - 1 ? " " : "")
      })
    })
    
    return lines
  }
  
  const asciiLines = generateAscii(text, fonts[font])
  
  return (
    <box flexDirection="column" padding={2} borderStyle="single">
      <text bold fg="#00FFFF" marginBottom={1}>
        ASCII Text Generator
      </text>
      
      <box flexDirection="column" marginBottom={2}>
        {asciiLines.map((line, index) => (
          <text key={index} fg="#00FF00" fontFamily="monospace">
            {line}
          </text>
        ))}
      </box>
      
      <box borderTop borderColor="#333333" paddingTop={1}>
        <text fg="#888888">
          Text: "{text}" | Font: {font}
        </text>
      </box>
    </box>
  )
}

// Usage
function TextArtDemo() {
  const [inputText, setInputText] = useState("HELLO")
  const [selectedFont, setSelectedFont] = useState("block")
  
  return (
    <box flexDirection="column" padding={2}>
      <box flexDirection="column" marginBottom={2}>
        <text fg="#CCCCCC">Enter text:</text>
        <input
          value={inputText}
          onChange={setInputText}
          placeholder="Type text to convert"
        />
      </box>
      
      <box flexDirection="column" marginBottom={2}>
        <text fg="#CCCCCC">Font style:</text>
        <select
          value={selectedFont}
          onChange={setSelectedFont}
          options={[
            { label: "Block", value: "block" },
            { label: "Small", value: "small" }
          ]}
        />
      </box>
      
      <AsciiTextGenerator text={inputText} font={selectedFont} />
    </box>
  )
}

render(<TextArtDemo />)`}
              />
            </TabsContent>

            <TabsContent value="animations" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Animated ASCII Art</h4>
                <p className="text-sm text-muted-foreground">
                  Create animated sequences and loading indicators using ASCII characters.
                </p>
              </div>
              <CodePreview
                title="ASCII Animations"
                code={`import { useState, useEffect } from "react"

function LoadingSpinner({ size = "medium" }) {
  const [frame, setFrame] = useState(0)
  
  const spinners = {
    small: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    medium: ["◐", "◓", "◑", "◒"],
    large: [
      ["  ●  ", "     ", "     "],
      ["     ", "  ●  ", "     "],
      ["     ", "     ", "  ●  "],
      ["     ", "  ●  ", "     "]
    ]
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % spinners[size].length)
    }, 150)
    
    return () => clearInterval(interval)
  }, [size])
  
  const currentFrame = spinners[size][frame]
  
  return (
    <box justifyContent="center" alignItems="center">
      {Array.isArray(currentFrame) ? (
        <box flexDirection="column">
          {currentFrame.map((line, index) => (
            <text key={index} fg="#00FFFF">
              {line}
            </text>
          ))}
        </box>
      ) : (
        <text fg="#00FFFF" fontSize="large">
          {currentFrame}
        </text>
      )}
    </box>
  )
}

function ProgressBar({ progress, width = 30, animated = true }) {
  const [animFrame, setAnimFrame] = useState(0)
  
  useEffect(() => {
    if (!animated) return
    
    const interval = setInterval(() => {
      setAnimFrame(prev => (prev + 1) % 4)
    }, 200)
    
    return () => clearInterval(interval)
  }, [animated])
  
  const filled = Math.floor((progress / 100) * width)
  const empty = width - filled
  
  const animChars = ["▁", "▃", "▅", "▇"]
  const animChar = animChars[animFrame]
  
  return (
    <box flexDirection="column" padding={1}>
      <text fg="#CCCCCC" marginBottom={1}>
        Progress: {progress}%
      </text>
      
      <box alignItems="center">
        <text>[</text>
        <text fg="#00FF00">
          {"█".repeat(filled)}
        </text>
        {animated && progress < 100 && (
          <text fg="#FFFF00">{animChar}</text>
        )}
        <text fg="#333333">
          {"░".repeat(Math.max(0, empty - (animated && progress < 100 ? 1 : 0)))}
        </text>
        <text>]</text>
      </box>
    </box>
  )
}

function WaveAnimation({ width = 40, height = 8 }) {
  const [time, setTime] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.2)
    }, 100)
    
    return () => clearInterval(interval)
  }, [])
  
  const generateWave = () => {
    const lines = []
    
    for (let y = 0; y < height; y++) {
      let line = ""
      for (let x = 0; x < width; x++) {
        const wave = Math.sin((x * 0.3) + time) * (height / 2) + (height / 2)
        const char = Math.abs(y - wave) < 1 ? "~" : " "
        line += char
      }
      lines.push(line)
    }
    
    return lines
  }
  
  const waveLines = generateWave()
  
  return (
    <box flexDirection="column" borderStyle="single" padding={1}>
      <text bold fg="#00FFFF" marginBottom={1}>
        🌊 Wave Animation
      </text>
      
      {waveLines.map((line, index) => (
        <text key={index} fg="#0088FF" fontFamily="monospace">
          {line}
        </text>
      ))}
    </box>
  )
}

// Usage
function AnimationDemo() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev + 2) % 101)
    }, 100)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <box flexDirection="column" padding={2}>
      <text bold fg="#00FFFF" marginBottom={2}>
        ASCII Animation Examples
      </text>
      
      <box flexDirection="row" gap={4} marginBottom={2}>
        <box flexDirection="column" alignItems="center">
          <text fg="#CCCCCC" marginBottom={1}>Small Spinner</text>
          <LoadingSpinner size="small" />
        </box>
        
        <box flexDirection="column" alignItems="center">
          <text fg="#CCCCCC" marginBottom={1}>Medium Spinner</text>
          <LoadingSpinner size="medium" />
        </box>
        
        <box flexDirection="column" alignItems="center">
          <text fg="#CCCCCC" marginBottom={1}>Large Spinner</text>
          <LoadingSpinner size="large" />
        </box>
      </box>
      
      <ProgressBar progress={progress} animated />
      
      <WaveAnimation />
    </box>
  )
}

render(<AnimationDemo />)`}
              />
            </TabsContent>

            <TabsContent value="interactive" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Interactive ASCII Art</h4>
                <p className="text-sm text-muted-foreground">
                  Create interactive ASCII art that responds to user input and changes dynamically.
                </p>
              </div>
              <CodePreview
                title="Interactive ASCII Canvas"
                code={`import { useState } from "react"

function AsciiCanvas({ width = 20, height = 10 }) {
  const [canvas, setCanvas] = useState(() => 
    Array(height).fill().map(() => Array(width).fill(" "))
  )
  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)
  const [brushChar, setBrushChar] = useState("█")
  const [isDrawing, setIsDrawing] = useState(false)
  
  useInput((input, key) => {
    if (key.leftArrow && cursorX > 0) {
      setCursorX(prev => prev - 1)
    } else if (key.rightArrow && cursorX < width - 1) {
      setCursorX(prev => prev + 1)
    } else if (key.upArrow && cursorY > 0) {
      setCursorY(prev => prev - 1)
    } else if (key.downArrow && cursorY < height - 1) {
      setCursorY(prev => prev + 1)
    } else if (key.space) {
      // Draw at current position
      setCanvas(prev => {
        const newCanvas = prev.map(row => [...row])
        newCanvas[cursorY][cursorX] = brushChar
        return newCanvas
      })
    } else if (key.name === "c") {
      // Clear canvas
      setCanvas(Array(height).fill().map(() => Array(width).fill(" ")))
    } else if (key.name === "e") {
      // Erase at current position
      setCanvas(prev => {
        const newCanvas = prev.map(row => [...row])
        newCanvas[cursorY][cursorX] = " "
        return newCanvas
      })
    }
  })
  
  const brushes = ["█", "▓", "▒", "░", "●", "○", "■", "□", "▲", "▼", "♦", "♠", "♥", "♣"]
  
  return (
    <box flexDirection="column" padding={2} borderStyle="double">
      <text bold fg="#00FFFF" marginBottom={1}>
        🎨 ASCII Canvas
      </text>
      
      {/* Canvas */}
      <box flexDirection="column" marginBottom={2} borderStyle="single">
        {canvas.map((row, y) => (
          <text key={y} fontFamily="monospace">
            {row.map((char, x) => (
              <text
                key={x}
                bg={x === cursorX && y === cursorY ? "#FFFF00" : undefined}
                fg={x === cursorX && y === cursorY ? "#000000" : "#00FF00"}
              >
                {x === cursorX && y === cursorY && char === " " ? "+" : char}
              </text>
            ))}
          </text>
        ))}
      </box>
      
      {/* Brush Selector */}
      <box marginBottom={2}>
        <text fg="#CCCCCC" marginRight={2}>Brush:</text>
        {brushes.map((brush, index) => (
          <text
            key={index}
            bg={brush === brushChar ? "#0000FF" : undefined}
            fg={brush === brushChar ? "#FFFFFF" : "#CCCCCC"}
            marginRight={1}
            onClick={() => setBrushChar(brush)}
          >
            {brush}
          </text>
        ))}
      </box>
      
      {/* Controls */}
      <box flexDirection="column" borderTop borderColor="#333333" paddingTop={1}>
        <text fg="#888888">
          ↑↓←→: Move cursor | Space: Draw | E: Erase | C: Clear
        </text>
        <text fg="#666666">
          Position: ({cursorX}, {cursorY}) | Brush: {brushChar}
        </text>
      </box>
    </box>
  )
}

function AsciiDrawingApp() {
  const [mode, setMode] = useState("canvas")
  const [savedArt, setSavedArt] = useState([])
  
  const templates = {
    house: [
      "    /\\    ",
      "   /  \\   ",
      "  /____\\  ",
      "  |    |  ",
      "  | [] |  ",
      "  |____|  "
    ],
    tree: [
      "    🌲    ",
      "   /|\\   ",
      "  / | \\  ",
      "    |     ",
      "    |     "
    ],
    cat: [
      "  /\\_/\\  ",
      " ( o.o ) ",
      "  > ^ <  "
    ]
  }
  
  const loadTemplate = (templateName) => {
    const template = templates[templateName]
    console.log(\`Loading \${templateName} template:\`)
    template.forEach(line => console.log(line))
  }
  
  return (
    <box flexDirection="column" padding={2}>
      <box marginBottom={2}>
        <text bold fg="#00FFFF">ASCII Art Studio</text>
      </box>
      
      {mode === "canvas" && <AsciiCanvas />}
      
      <box marginTop={2} gap={2}>
        <text
          bg={mode === "canvas" ? "#0000FF" : undefined}
          fg={mode === "canvas" ? "#FFFFFF" : "#CCCCCC"}
          padding={0.5}
          onClick={() => setMode("canvas")}
        >
          Canvas
        </text>
        
        <text fg="#888888">|</text>
        
        <text fg="#CCCCCC">Templates:</text>
        {Object.keys(templates).map(template => (
          <text
            key={template}
            fg="#00FF00"
            onClick={() => loadTemplate(template)}
            style={{ cursor: "pointer" }}
          >
            {template}
          </text>
        ))}
      </box>
    </box>
  )
}

render(<AsciiDrawingApp />)`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ASCII Art Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Text to ASCII</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Convert text into stylized ASCII art using character patterns.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Multiple font styles</li>
              <li>• Custom character mapping</li>
              <li>• Dynamic text generation</li>
              <li>• Size and spacing control</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interactive Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Create interactive ASCII art that responds to user input.</p>
            <ul className="text-sm space-y-1">
              <li>• Drawing canvas with cursor</li>
              <li>• Animated sequences</li>
              <li>• Template loading system</li>
              <li>• Real-time modifications</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <div className="flex justify-between items-center pt-8 border-t">
        <div>
          <h3 className="font-semibold">Next: Advanced Terminal Demos</h3>
          <p className="text-sm text-muted-foreground">Explore advanced terminal features and integrations</p>
        </div>
        <Button asChild>
          <Link href="/docs/components/examples">
            View More Examples
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
