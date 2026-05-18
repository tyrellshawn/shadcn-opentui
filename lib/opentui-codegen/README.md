# OpenTUI-to-shadcn Codegen

This folder is the starting point for translating OpenTUI-style TypeScript applications into inspectable shadcn web code.

The current goal is not to run the official OpenTUI renderer in the browser. The current goal is to parse a useful OpenTUI TSX subset, normalize it into an intermediate representation, and generate readable React/shadcn components that developers can inspect and adapt.

## Pipeline

```txt
OpenTUI TypeScript/TSX source
  -> custom ANTLR grammar
  -> parse tree
  -> OpenTUI IR
  -> shadcn/React TSX generator
  -> browser-viewable component and optional registry item
```

## Initial Grammar Scope

The first grammar in `grammars/OpenTUIProgram.g4` intentionally supports a constrained TypeScript-like subset:

- imports
- default function returning one expression
- component/function calls
- object literals
- array literals
- string, number, boolean, and identifier values

Unsupported TypeScript should fail loudly instead of being silently mistranslated.

## Hunk Validation Target

[Hunk](https://github.com/modem-dev/hunk) is the north-star example because it is a real OpenTUI application with reusable primitives such as `HunkDiffView`, `HunkReviewStream`, `HunkFileNav`, and `HunkDiffFileHeader`.

The first test target is a static Hunk-like diff review page at `/docs/examples/hunk`. Later milestones should parse selected Hunk `src/opentui` components and generate matching shadcn views.

## Suggested Generator Command

ANTLR generation can be wired with:

```bash
bunx antlr-ng -Dlanguage=TypeScript -o lib/opentui-codegen/generated --generate-visitor grammars/OpenTUIProgram.g4
```

The repository currently includes a hand-written IR and TSX generator scaffold so the product direction is testable before generated parser files are committed.
