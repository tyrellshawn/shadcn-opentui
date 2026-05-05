# Architecture Decision Record 001: WebAssembly Core & Canvas Renderer

## Context
The `shadcn-opentui` project originally started as a React DOM wrapper simulating a terminal environment. However, the true OpenTUI project (by anomalyco) is a native Zig application designed to run in standard terminals with native performance, using Bun FFI to communicate with a TypeScript backend.

To allow real OpenTUI applications to run in the browser (e.g., for terminal.shop or opencode web interfaces), a DOM-based React wrapper is insufficient. It lacks the layout engine, capabilities, and performance characteristics of the true Zig core.

## Decision
We will port the OpenTUI Zig core to WebAssembly (`wasm32-freestanding`) and build a dedicated web rendering pipeline.

This involves:
1. Building `@opentui/web-core` to compile the Zig logic to WASM, dropping all `bun:ffi` and native OS dependencies (like standard input/output streams).
2. Building `@opentui/web-renderer` to read the shared WASM memory and paint the cell buffer to a standard HTML5 `<canvas>`.
3. Creating `@opentui/web-react` to provide the exact same API as `@opentui/react` (`createRoot`), ensuring OpenTUI React apps run unmodified in the browser.

## Consequences
### Positive
- **100% Compatibility:** Real OpenTUI apps can run in the browser without rewriting their core logic.
- **Performance:** A Canvas-based rendering loop driven by WASM is significantly faster than DOM node manipulation for terminal grids.
- **True Portability:** Allows OpenTUI to become a write-once, run-anywhere framework (Terminal + Browser).

### Negative
- **Complexity:** Requires manual memory management and string serialization between JS and WASM.
- **Terminal Semantics:** Browser APIs for text measurement and font rendering do not perfectly map to terminal monospace grid rules. We will need to carefully implement a grid layout system in the Canvas renderer that matches the native terminal cell calculations.
