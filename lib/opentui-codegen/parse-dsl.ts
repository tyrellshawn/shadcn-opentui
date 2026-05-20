import { CharStream, CommonTokenStream, AbstractParseTreeVisitor } from "antlr4ng"
import { OpenTUIProgramLexer } from "./generated/OpenTUIProgramLexer"
import {
  OpenTUIProgramParser,
  type ProgramContext,
  type ExportDefaultDeclContext,
  type BlockContext,
  type ExpressionContext,
  type CallExpressionContext,
  type ObjectLiteralContext,
  type ArrayLiteralContext,
  type StringLiteralContext,
  type NumberLiteralContext,
  type BooleanLiteralContext,
  type PropertyContext,
  type ArgumentListContext,
} from "./generated/OpenTUIProgramParser"
import type { OpenTUIIrNode, OpenTUIIrProgram, OpenTUIIrNodeKind, OpenTUIIrValue } from "./ir"

const PRIMITIVE_KINDS = new Set<string>(["box", "text", "scrollbox"])

class OpenTUIVisitor extends AbstractParseTreeVisitor<OpenTUIIrValue> {
  private nodes: OpenTUIIrNode[] = []
  private notes: string[] = []

  getProgram(name: string, source: string): OpenTUIIrProgram {
    return { name, source, nodes: this.nodes, notes: this.notes }
  }

  visitProgram(ctx: ProgramContext): OpenTUIIrValue {
    const exportDecl = ctx.exportDefaultDecl()
    if (exportDecl) {
      this.visit(exportDecl)
    }
    return undefined
  }

  visitExportDefaultDecl(ctx: ExportDefaultDeclContext): OpenTUIIrValue {
    const name = ctx.Identifier()?.getText() ?? "default"
    this.notes.push(`Exported function: ${name}`)
    const block = ctx.block()
    const result = this.visit(block)
    const nodeResult = result as OpenTUIIrNode | undefined
    if (nodeResult?.kind) {
      this.nodes.push({ kind: "unknown", name, children: [nodeResult] })
    }
    return undefined
  }

  visitBlock(ctx: BlockContext): OpenTUIIrValue {
    return this.visit(ctx.expression())
  }

  visitExpression(ctx: ExpressionContext): OpenTUIIrValue {
    if (ctx.callExpression()) return this.visit(ctx.callExpression()!)
    if (ctx.objectLiteral()) return this.visit(ctx.objectLiteral()!)
    if (ctx.arrayLiteral()) return this.visit(ctx.arrayLiteral()!)
    if (ctx.stringLiteral()) return this.visit(ctx.stringLiteral()!)
    if (ctx.numberLiteral()) return this.visit(ctx.numberLiteral()!)
    if (ctx.booleanLiteral()) return this.visit(ctx.booleanLiteral()!)
    if (ctx.Identifier()) return ctx.Identifier()!.getText()
    return undefined
  }

  visitCallExpression(ctx: CallExpressionContext): OpenTUIIrValue {
    const name = ctx.Identifier().getText()
    const argCtx = ctx.argumentList()
    let props: Record<string, OpenTUIIrValue> | undefined
    let children: OpenTUIIrNode[] | undefined

    if (argCtx) {
      const expressions = argCtx.expression()
      let seenObject = false
      for (const expr of expressions) {
        if (!seenObject && expr.objectLiteral()) {
          const objResult = this.visit(expr.objectLiteral()!)
          if (typeof objResult === "object" && !Array.isArray(objResult) && objResult !== null) {
            props = { ...(props ?? {}), ...(objResult as Record<string, OpenTUIIrValue>) }
            seenObject = true
          }
        } else if (expr.stringLiteral()) {
          const strVal = this.visit(expr.stringLiteral()!) as string
          children ??= []
          children.push({ kind: "text", value: strVal })
        } else if (expr.callExpression()) {
          const childResult = this.visit(expr.callExpression()!)
          const childNode = childResult as OpenTUIIrNode | undefined
          if (childNode?.kind) {
            children ??= []
            children.push(childNode)
          }
        } else if (expr.arrayLiteral()) {
          const arrResult = this.visit(expr.arrayLiteral()!)
          if (Array.isArray(arrResult)) {
            children ??= []
            children.push(...(arrResult as OpenTUIIrNode[]))
          }
        } else {
          const val = this.visit(expr)
          if (typeof val === "string") {
            children ??= []
            children.push({ kind: "text", value: val })
          }
        }
      }
    }

    const kind: OpenTUIIrNodeKind = PRIMITIVE_KINDS.has(name) ? (name as OpenTUIIrNodeKind) : "unknown"
    const node: OpenTUIIrNode = { kind }
    if (!PRIMITIVE_KINDS.has(name)) node.name = name
    if (props && Object.keys(props).length > 0) node.props = props
    if (children && children.length > 0) node.children = children
    return node
  }

  visitObjectLiteral(ctx: ObjectLiteralContext): OpenTUIIrValue {
    const result: Record<string, OpenTUIIrValue> = {}
    const propList = ctx.propertyList()
    if (propList) {
      for (const prop of propList.property()) {
        const key = prop.Identifier().getText()
        const value = this.visit(prop.expression())
        result[key] = value
      }
    }
    return result
  }

  visitArrayLiteral(ctx: ArrayLiteralContext): OpenTUIIrValue {
    const elList = ctx.expressionList()
    if (!elList) return []
    return elList.expression().map((e) => this.visit(e))
  }

  visitStringLiteral(ctx: StringLiteralContext): OpenTUIIrValue {
    const text = ctx.StringLiteral().getText()
    return text.slice(1, -1)
  }

  visitNumberLiteral(ctx: NumberLiteralContext): OpenTUIIrValue {
    return Number(ctx.NumberLiteral().getText())
  }

  visitBooleanLiteral(ctx: BooleanLiteralContext): OpenTUIIrValue {
    return ctx.getText() === "true"
  }
}

export function parseDSL(sourceText: string, fileName: string): OpenTUIIrProgram {
  const inputStream = CharStream.fromString(sourceText)
  const lexer = new OpenTUIProgramLexer(inputStream)
  const tokenStream = new CommonTokenStream(lexer)
  const parser = new OpenTUIProgramParser(tokenStream)

  const tree = parser.program()
  const visitor = new OpenTUIVisitor()
  visitor.visit(tree)

  const programName = fileName.split("/").pop()?.replace(/\.opentui$/, "") ?? "Unknown"
  return visitor.getProgram(programName, fileName)
}
