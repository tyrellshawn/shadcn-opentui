# OpenTUI Web Packages

This directory contains the monorepo packages that implement the true **WebAssembly (WASM) runtime** for OpenTUI in the browser.

## The Shift

Previously, `shadcn-opentui` used a "dom-wrapper" strategy to simulate a terminal in React. While good for simple terminal widgets, it could not run real OpenTUI applications because OpenTUI is a native Zig core.

We are now building a native web backend for OpenTUI, allowing any OpenTUI application to compile to WASM and render to a Web Canvas natively.

## Packages

*   **`@opentui/web-core`**: The OpenTUI Zig core compiled to `wasm32-freestanding` along with the JavaScript interop layer. It handles memory sharing, string allocation, and exposes the rendering buffer to JS.
*   **`@opentui/web-renderer`**: The browser rendering engine. It reads the drawing commands and buffers from `web-core` and paints them to a `<canvas>` element. It also handles browser events (keyboard, resize, pointer) and forwards them to the WASM core.
*   **`@opentui/web-react`**: The React reconciler for the browser. It implements `createRoot(renderer)` to allow React applications to drive the OpenTUI scene graph inside the web renderer.

## Documentation

See `packages/docs/milestones` for detailed architectural decisions and implementation plans:
- [ADR: WebAssembly Core & Canvas Renderer](./docs/milestones/adr.md)
- [Implementation Plan](./docs/milestones/impl.md)
- [Retrospective](./docs/milestones/retro.md)

## Development scripts

From the monorepo root:
- `bun run build:web-core`: Compiles the Zig code to WASM and builds the TS wrapper.
- `bun run dev:web-core`: Starts a local HTTP server to test the WASM initialization in the browser.
- `bun run build:web-runtime`: Builds `web-core`, `web-renderer`, and `web-react`.
- `bun run dev:web-runtime`: Serves the monorepo for the full runtime demo at `packages/web-renderer/demo/index.html`.
