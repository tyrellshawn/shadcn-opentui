import { readFileSync } from "fs"
import { Project, SyntaxKind, type JsxElement, type JsxSelfClosingElement } from "ts-morph"
import type { OpenTUIIrNode, OpenTUIIrProgram } from "./ir"

const OPEN_TUI_PRIMITIVES = new Set(["box", "text", "scrollbox"])

function extractJsxAttributeValue(attr: any): unknown {
  const initializer = attr.getInitializer()
  if (!initializer) return true

  if (initializer.isKind(SyntaxKind.StringLiteral)) return initializer.getLiteralValue()
  if (initializer.isKind(SyntaxKind.NumericLiteral)) return Number(initializer.getLiteralValue())
  if (initializer.isKind(SyntaxKind.TrueKeyword)) return true
  if (initializer.isKind(SyntaxKind.FalseKeyword)) return false
  if (initializer.isKind(SyntaxKind.NullKeyword)) return null

  if (initializer.isKind(SyntaxKind.JsxExpression)) {
    const expr = initializer.getExpression()
    if (expr?.isKind(SyntaxKind.TrueKeyword)) return true
    if (expr?.isKind(SyntaxKind.FalseKeyword)) return false
    if (expr?.isKind(SyntaxKind.NumericLiteral)) return Number(expr.getLiteralValue())
    if (expr?.isKind(SyntaxKind.StringLiteral)) return expr.getLiteralValue()
    if (expr?.isKind(SyntaxKind.Identifier)) return `<${expr.getText()}>`
    if (expr?.isKind(SyntaxKind.PropertyAccessExpression)) return `<${expr.getText()}>`
    if (expr?.isKind(SyntaxKind.CallExpression)) return `<call>`
    return true
  }

  return `<${initializer.getKindName()}>`
}

function parseJsxChildren(element: JsxElement): OpenTUIIrNode[] {
  const children: OpenTUIIrNode[] = []

  for (const child of element.getJsxChildren()) {
    if (child.isKind(SyntaxKind.JsxElement)) {
      children.push(parseJsxNode(child as JsxElement))
    } else if (child.isKind(SyntaxKind.JsxSelfClosingElement)) {
      children.push(parseJsxSelfClosing(child as JsxSelfClosingElement))
    } else if (child.isKind(SyntaxKind.JsxExpression)) {
      const text = child.getText().trim()
      if (text.length > 0) {
        children.push({ kind: "text", value: text.length > 80 ? text.slice(0, 80) + "..." : text })
      }
    }
  }

  return children
}

function parseJsxNode(element: JsxElement): OpenTUIIrNode {
  const opening = element.getOpeningElement()
  const tagText = opening.getTagNameNode().getText()

  const props: Record<string, unknown> = {}
  for (const attr of opening.getAttributes()) {
    if (attr.isKind(SyntaxKind.JsxAttribute)) {
      props[attr.getNameNode().getText()] = extractJsxAttributeValue(attr)
    }
  }

  if (OPEN_TUI_PRIMITIVES.has(tagText)) {
    const children = parseJsxChildren(element)
    return {
      kind: tagText as OpenTUIIrNode["kind"],
      props: Object.keys(props).length > 0 ? props : undefined,
      children: children.length > 0 ? children : undefined,
    }
  }

  const children = parseJsxChildren(element)
  return {
    kind: "unknown",
    name: tagText,
    props: Object.keys(props).length > 0 ? props : undefined,
    children: children.length > 0 ? children : undefined,
  }
}

function parseJsxSelfClosing(element: JsxSelfClosingElement): OpenTUIIrNode {
  const tagText = element.getTagNameNode().getText()

  const props: Record<string, unknown> = {}
  for (const attr of element.getAttributes()) {
    if (attr.isKind(SyntaxKind.JsxAttribute)) {
      props[attr.getNameNode().getText()] = extractJsxAttributeValue(attr)
    }
  }

  if (OPEN_TUI_PRIMITIVES.has(tagText)) {
    return { kind: tagText as OpenTUIIrNode["kind"], props: Object.keys(props).length > 0 ? props : undefined }
  }

  return { kind: "unknown", name: tagText, props: Object.keys(props).length > 0 ? props : undefined }
}

function extractJsxFromReturn(returnStmt: any): OpenTUIIrNode | null {
  const expr = returnStmt.getExpression()

  if (expr?.isKind(SyntaxKind.JsxElement)) return parseJsxNode(expr as JsxElement)
  if (expr?.isKind(SyntaxKind.JsxSelfClosingElement)) return parseJsxSelfClosing(expr as JsxSelfClosingElement)

  if (expr?.isKind(SyntaxKind.ParenthesizedExpression)) {
    const inner = expr.getExpression()
    if (inner?.isKind(SyntaxKind.JsxElement)) return parseJsxNode(inner as JsxElement)
    if (inner?.isKind(SyntaxKind.JsxSelfClosingElement)) return parseJsxSelfClosing(inner as JsxSelfClosingElement)
  }

  for (const child of returnStmt.getChildren()) {
    if (child.isKind(SyntaxKind.JsxElement)) return parseJsxNode(child as JsxElement)
    if (child.isKind(SyntaxKind.JsxSelfClosingElement)) return parseJsxSelfClosing(child as JsxSelfClosingElement)
  }

  const jsxElements = returnStmt.getDescendantsOfKind(SyntaxKind.JsxElement) as JsxElement[]
  if (jsxElements.length > 0) return parseJsxNode(jsxElements[0])

  const selfClosing = returnStmt.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement) as JsxSelfClosingElement[]
  if (selfClosing.length > 0) return parseJsxSelfClosing(selfClosing[0])

  return null
}

function findReturnJsxInNode(node: any): OpenTUIIrNode | null {
  const returnStmts = node.getDescendantsOfKind(SyntaxKind.ReturnStatement)
  if (returnStmts.length === 0) return null

  const jsxReturns = returnStmts
    .map((rs: any) => extractJsxFromReturn(rs))
    .filter(Boolean) as OpenTUIIrNode[]

  if (jsxReturns.length === 0) return null

  return jsxReturns[jsxReturns.length - 1]
}

export function parseHunkFile(sourceText: string, fileName: string): OpenTUIIrProgram {
  const project = new Project({ useInMemoryFileSystem: true })
  const sourceFile = project.createSourceFile(fileName, sourceText)

  const notes: string[] = []
  const nodes: OpenTUIIrNode[] = []

  for (const func of sourceFile.getFunctions()) {
    if (!func.isExported()) continue
    const name = func.getName() ?? "anonymous"
    const ir = findReturnJsxInNode(func)
    if (ir) {
      notes.push(`Exported function: ${name}`)
      nodes.push({ kind: "unknown", name, children: [ir] })
    }
  }

  for (const decl of sourceFile.getVariableDeclarations()) {
    if (!decl.isExported()) continue
    const name = decl.getName()
    const init = decl.getInitializer()
    if (!init?.isKind(SyntaxKind.ArrowFunction) && !init?.isKind(SyntaxKind.FunctionExpression)) continue
    const ir = findReturnJsxInNode(init)
    if (ir) {
      notes.push(`Exported variable: ${name}`)
      nodes.push({ kind: "unknown", name, children: [ir] })
    }
  }

  const programName = fileName.split("/").pop()?.replace(/\.tsx?$/, "") ?? "Unknown"

  return { name: programName, source: fileName, nodes, notes }
}

export function parseAllHunkFiles(files: { relative: string; absolute: string }[]) {
  return files
    .filter((f) => f.relative.endsWith(".tsx"))
    .map((f) => {
      const sourceText = readFileSync(f.absolute, "utf-8")
      return parseHunkFile(sourceText, f.relative)
    })
}
