// OpenTUI Table Plugin
// A comprehensive table rendering plugin with sorting, formatting, and styling

import type { OpenTUIPluginDefinition, TableOptions, TableColumn, TableData } from "./types"
import type { OpenTUIRuntimeContext } from "../types"
import { THEMES, padString, formatValue, calculateColumnWidths, truncate } from "./utils"

export interface TablePluginOptions {
  defaultStyle?: "minimal" | "rounded" | "double" | "heavy" | "ascii"
  maxWidth?: number
  defaultShowHeaders?: boolean
  defaultShowBorders?: boolean
}

export function createTablePlugin(pluginOptions: TablePluginOptions = {}): OpenTUIPluginDefinition {
  const {
    defaultStyle = "rounded",
    maxWidth = 80,
    defaultShowHeaders = true,
    defaultShowBorders = true,
  } = pluginOptions

  // Render a table to string array
  function renderTable(data: TableData, options: TableOptions = {}): string[] {
    const {
      columns: customColumns,
      showHeaders = defaultShowHeaders,
      showBorders = defaultShowBorders,
      showRowNumbers = false,
      maxRows,
      sortBy,
      sortOrder = "asc",
      emptyMessage = "No data available",
      headerStyle = "none",
      zebra = false,
      style = defaultStyle,
    } = options

    const theme = THEMES[style] || THEMES.rounded
    const rows = data.rows
    const lines: string[] = []

    if (rows.length === 0) {
      lines.push(emptyMessage)
      return lines
    }

    // Build columns from data if not provided
    const columns: TableColumn[] =
      customColumns ||
      data.columns ||
      Object.keys(rows[0]).map((key) => ({
        key,
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
        align: "left" as const,
      }))

    // Add row number column if needed
    if (showRowNumbers) {
      columns.unshift({
        key: "__rowNum__",
        header: "#",
        width: 4,
        align: "right",
      })
    }

    // Sort data if specified
    let sortedRows = [...rows]
    if (sortBy) {
      sortedRows.sort((a, b) => {
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
        return 0
      })
    }

    // Limit rows if specified
    if (maxRows && sortedRows.length > maxRows) {
      sortedRows = sortedRows.slice(0, maxRows)
    }

    // Calculate column widths
    const widths = calculateColumnWidths(sortedRows, columns, maxWidth)

    // Build border strings
    const topBorder = showBorders
      ? theme.borders.topLeft +
        widths.map((w) => theme.borders.horizontal.repeat(w + 2)).join(theme.borders.teeDown) +
        theme.borders.topRight
      : ""

    const midBorder = showBorders
      ? theme.borders.teeLeft +
        widths.map((w) => theme.borders.horizontal.repeat(w + 2)).join(theme.borders.cross) +
        theme.borders.teeRight
      : ""

    const bottomBorder = showBorders
      ? theme.borders.bottomLeft +
        widths.map((w) => theme.borders.horizontal.repeat(w + 2)).join(theme.borders.teeUp) +
        theme.borders.bottomRight
      : ""

    // Add title if present
    if (data.title) {
      const titleWidth = widths.reduce((a, b) => a + b, 0) + (widths.length - 1) * 3 + 4
      lines.push(theme.borders.topLeft + theme.borders.horizontal.repeat(titleWidth - 2) + theme.borders.topRight)
      lines.push(
        theme.borders.vertical + " " + padString(data.title, titleWidth - 4, "center") + " " + theme.borders.vertical,
      )
      lines.push(
        theme.borders.teeLeft +
          widths.map((w) => theme.borders.horizontal.repeat(w + 2)).join(theme.borders.teeDown) +
          theme.borders.teeRight,
      )
    } else if (topBorder) {
      lines.push(topBorder)
    }

    // Add headers
    if (showHeaders) {
      const headerRow = columns.map((col, i) => {
        let header = col.header
        if (headerStyle === "uppercase") header = header.toUpperCase()
        else if (headerStyle === "capitalize") header = header.charAt(0).toUpperCase() + header.slice(1)
        return padString(truncate(header, widths[i]), widths[i], col.align)
      })

      if (showBorders) {
        lines.push(
          theme.borders.vertical +
            " " +
            headerRow.join(" " + theme.borders.vertical + " ") +
            " " +
            theme.borders.vertical,
        )
        lines.push(midBorder)
      } else {
        lines.push(headerRow.join("  "))
        lines.push(widths.map((w) => "─".repeat(w)).join("  "))
      }
    }

    // Add data rows
    sortedRows.forEach((row, rowIndex) => {
      const cells = columns.map((col, colIndex) => {
        let value: string
        if (col.key === "__rowNum__") {
          value = String(rowIndex + 1)
        } else {
          const rawValue = row[col.key]
          value = col.format ? col.format(rawValue) : formatValue(rawValue)
        }
        return padString(truncate(value, widths[colIndex]), widths[colIndex], col.align)
      })

      const zebraPrefix = zebra && rowIndex % 2 === 1 ? "░" : ""

      if (showBorders) {
        lines.push(
          theme.borders.vertical +
            zebraPrefix +
            " " +
            cells.join(" " + theme.borders.vertical + " ") +
            " " +
            theme.borders.vertical,
        )
      } else {
        lines.push(zebraPrefix + cells.join("  "))
      }
    })

    // Add bottom border
    if (bottomBorder) {
      lines.push(bottomBorder)
    }

    // Add footer if present
    if (data.footer) {
      lines.push(data.footer)
    }

    return lines
  }

  return {
    name: "table",
    version: "1.0.0",
    description: "Render data in formatted tables with sorting and styling options",
    keywords: ["table", "data", "grid", "format"],

    commands: [
      {
        name: "table",
        description: "Display data in a table format",
        usage: "table [options] <json-data>",
        aliases: ["tbl"],
        category: "data",
        handler: (args: string[], context: OpenTUIRuntimeContext) => {
          // Parse options from args
          const options: TableOptions = {}
          let dataStr = ""

          for (let i = 0; i < args.length; i++) {
            const arg = args[i]
            if (arg === "--no-borders") options.showBorders = false
            else if (arg === "--no-headers") options.showHeaders = false
            else if (arg === "--numbers") options.showRowNumbers = true
            else if (arg === "--zebra") options.zebra = true
            else if (arg.startsWith("--style=")) options.style = arg.split("=")[1] as TableOptions["style"]
            else if (arg.startsWith("--sort=")) options.sortBy = arg.split("=")[1]
            else if (arg === "--desc") options.sortOrder = "desc"
            else dataStr += arg + " "
          }

          // Demo data if no input provided
          if (!dataStr.trim()) {
            const demoData: TableData = {
              title: "System Processes",
              rows: [
                { pid: 1234, name: "node", cpu: "12.5%", memory: "256MB", status: "running" },
                { pid: 5678, name: "nginx", cpu: "2.1%", memory: "64MB", status: "running" },
                { pid: 9012, name: "postgres", cpu: "8.3%", memory: "512MB", status: "running" },
                { pid: 3456, name: "redis", cpu: "1.2%", memory: "128MB", status: "idle" },
              ],
              columns: [
                { key: "pid", header: "PID", align: "right", width: 6 },
                { key: "name", header: "Process", align: "left" },
                { key: "cpu", header: "CPU", align: "right" },
                { key: "memory", header: "Memory", align: "right" },
                { key: "status", header: "Status", align: "center" },
              ],
              footer: "Total: 4 processes",
            }
            renderTable(demoData, options).forEach((line) => context.addLine(line))
            return
          }

          // Try to parse JSON data
          try {
            const parsed = JSON.parse(dataStr.trim())
            const tableData: TableData = Array.isArray(parsed) ? { rows: parsed } : parsed
            renderTable(tableData, options).forEach((line) => context.addLine(line))
          } catch {
            context.addLine("Error: Invalid JSON data", "error")
            context.addLine("Usage: table [options] <json-data>")
            context.addLine('Example: table [{"name":"John","age":30}]')
          }
        },
      },
    ],

    renderers: [
      {
        type: "table",
        render: ({ data, options }) => {
          const tableData = data as TableData
          return renderTable(tableData, options as TableOptions)
        },
        supports: (data) => {
          return typeof data === "object" && data !== null && ("rows" in data || Array.isArray(data))
        },
      },
    ],

    themes: Object.values(THEMES),
  }
}

// Default export for convenience
export const tablePlugin = createTablePlugin()
