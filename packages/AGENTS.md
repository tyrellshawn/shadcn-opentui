# Agent Context: OpenTUI Web Architecture

If you are an AI agent working in this repository, you must adhere to the following architectural rules:

## 1. Environment Constraints
- We are targeting **the browser**. 
- You **cannot** use Node.js built-ins (`fs`, `child_process`, `process.stdin`) inside `packages/web-core`, `packages/web-renderer`, or `packages/web-react`.
- Do **not** use `bun:ffi` or `dlopen`. The Zig core must be compiled to `wasm32-freestanding` and loaded via `WebAssembly.instantiateStreaming`.

## 2. Package Boundaries
- **`web-core`**: Contains the `.zig` source code, the build scripts (`zig build-exe -target wasm32-freestanding ...`), and the minimal JS bridge class (`OpenTUIWebCore`) that handles WASM instantiation and memory management.
- **`web-renderer`**: Contains no Zig code. It instantiates `web-core`, reads the shared WebAssembly memory, and uses the Canvas 2D API to draw the OpenTUI buffer. It maps browser DOM events (like `keydown`) into WASM function calls.
- **`web-react`**: Contains the React Reconciler logic.

## 3. Zig WASM Rules
- Always use `-target wasm32-freestanding`.
- Functions exposed to JS must use the `export` keyword.
- Memory management: JS must allocate memory using an exported Zig `alloc` function and pass the pointer back to Zig, or read pointers returned by Zig.
- Strings are passed as `ptr` (pointer) and `len` (length) pairs.

## 4. Rendering Strategy
OpenTUI natively uses a grid/cell-based buffer. The `web-renderer` should treat the `<canvas>` as a grid of monospace character cells. It should query the WASM core for the buffer state (foreground, background, character) and paint it efficiently.
