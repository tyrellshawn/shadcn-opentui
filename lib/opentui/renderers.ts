const LETTERS: Record<string, string[]> = {
  A: ["  #  ", " # # ", "#####", "#   #", "#   #"],
  B: ["#### ", "#   #", "#### ", "#   #", "#### "],
  C: [" ####", "#    ", "#    ", "#    ", " ####"],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "#### ", "#    ", "#####"],
  F: ["#####", "#    ", "#### ", "#    ", "#    "],
  G: [" ####", "#    ", "#  ##", "#   #", " ####"],
  H: ["#   #", "#   #", "#####", "#   #", "#   #"],
  I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  J: ["#####", "   # ", "   # ", "#  # ", " ##  "],
  K: ["#   #", "#  # ", "###  ", "#  # ", "#   #"],
  L: ["#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#### ", "#    ", "#    "],
  Q: [" ### ", "#   #", "#   #", "#  ##", " ####"],
  R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  S: [" ####", "#    ", " ### ", "    #", "#### "],
  T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
  U: ["#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
  W: ["#   #", "#   #", "# # #", "## ##", "#   #"],
  X: ["#   #", " # # ", "  #  ", " # # ", "#   #"],
  Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "],
  Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
  "0": [" ### ", "#  ##", "# # #", "##  #", " ### "],
  "1": ["  #  ", " ##  ", "  #  ", "  #  ", " ### "],
  "2": [" ### ", "#   #", "   # ", "  #  ", "#####"],
  "3": ["#### ", "    #", " ### ", "    #", "#### "],
  "4": ["#   #", "#   #", "#####", "    #", "    #"],
  "5": ["#####", "#    ", "#### ", "    #", "#### "],
  "6": [" ### ", "#    ", "#### ", "#   #", " ### "],
  "7": ["#####", "   # ", "  #  ", " #   ", "#    "],
  "8": [" ### ", "#   #", " ### ", "#   #", " ### "],
  "9": [" ### ", "#   #", " ####", "    #", " ### "],
  " ": ["   ", "   ", "   ", "   ", "   "],
}

const FALLBACK = ["#####", "#   #", "  ## ", "     ", "  #  "]

export const sampleTerminalTableData = [
  ["Name", "Age", "City"],
  ["Alice", "25", "New York"],
  ["Bob", "30", "San Francisco"],
  ["Charlie", "35", "Chicago"],
]

export function renderAsciiBanner(text = "OpenTUI"): string[] {
  const normalized = text.trim() || "OpenTUI"
  const glyphs = [...normalized.toUpperCase()].map((char) => LETTERS[char] ?? FALLBACK)

  return Array.from({ length: 5 }, (_, row) => glyphs.map((glyph) => glyph[row]).join(" ").trimEnd())
}

export function renderTable(rows: string[][]): string[] {
  if (rows.length === 0) return []

  const columnCount = Math.max(...rows.map((row) => row.length))
  const widths = Array.from({ length: columnCount }, (_, column) =>
    Math.max(...rows.map((row) => String(row[column] ?? "").length)),
  )

  const border = (left: string, join: string, right: string) =>
    `${left}${widths.map((width) => "─".repeat(width + 2)).join(join)}${right}`

  const rowLine = (row: string[]) =>
    `│ ${widths.map((width, column) => String(row[column] ?? "").padEnd(width)).join(" │ ")} │`

  const lines = [border("┌", "┬", "┐"), rowLine(rows[0]), border("├", "┼", "┤")]
  rows.slice(1).forEach((row) => lines.push(rowLine(row)))
  lines.push(border("└", "┴", "┘"))

  return lines
}
