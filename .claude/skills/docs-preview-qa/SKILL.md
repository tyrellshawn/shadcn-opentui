---
name: docs-preview-qa
description: Verify docs preview/code examples stay aligned. Use this whenever changing `CodePreview`, docs examples, backend toggles, or interactive previews, especially when OpenTUI and cmdk variants both exist. Check that the default backend is OpenTUI, the selected backend changes both preview and code, and interactive previews can actually be typed into in both component tests and browser tests.
---

# Docs Preview QA

When updating docs examples:

1. Treat `OpenTUI` as the default backend unless the page explicitly documents cmdk first.
2. Verify the selected backend changes both the rendered preview and the shown code.
3. Avoid fake static previews for interactive examples when a real interactive preview is practical.
4. Add or update a component test that proves the default backend content is correct.
5. Add or update a browser/integration test for any preview that users are expected to type into.
6. If a backend example is not implemented yet, show an explicit placeholder instead of silently reusing the other backend's code.

# Required checks

- Run `bun vitest run`
- Run `bun run test:integration`
- If snapshots changed intentionally, run `bun run test:integration:update`

# Review checklist

- Does the default tab show OpenTUI code and preview?
- Does switching to cmdk change the code sample?
- Does switching to cmdk change the preview?
- Can a user type into any terminal or command input preview that visually looks interactive?
- Do visual regression tests still pass after the change?
