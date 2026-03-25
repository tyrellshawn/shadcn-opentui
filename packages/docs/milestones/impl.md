# Implementation Plan: True OpenTUI WebAssembly Runtime

## Current Status
- [x] **Milestone 1: Turborepo Foundation & Zig WASM PoC**
    - Set up Monorepo structure (apps/ and packages/).
    - Initialize `@opentui/web-core`, `@opentui/web-renderer`, `@opentui/web-react`.
    - Create a minimal `main.zig` compiling to `wasm32-freestanding`.
    - Build a minimal JS wrapper inside `web-core` to load the WASM bytes and execute functions in the browser (`http-server`).

## Upcoming Milestones

### Milestone 2: Core WASM Interop Bridge (`packages/web-core`)
- Port the OpenTUI memory allocation strategies to WASM exports.
- Abstract terminal OS bindings (ANSI stdout, stdin polling) behind a generic platform interface in Zig.
- Implement the buffer read/write bridge:
  - JS must be able to read an array of cell objects (Char, Foreground, Background, Style) directly from WASM memory.
  - Implement basic pointer/length serialization for strings between JS and Zig.

### Milestone 3: Canvas Rendering Engine (`packages/web-renderer`)
- Consume the `@opentui/web-core` WASM instance.
- Create a `CanvasTerminal` class that initializes an HTML5 `<canvas>`.
- Implement a 60fps or event-driven render loop (using `requestAnimationFrame`).
- Paint the WASM buffer to the canvas:
  - Fill cell backgrounds.
  - Draw text glyphs (`fillText`) at precise coordinates.
  - Handle terminal cursors, blinking, and text styles (bold, dim).
- Implement an Event Listener that traps browser `keydown` events and forwards them to the WASM core via the interop bridge.

### Milestone 4: Web-React Reconciler (`packages/web-react`)
- Clone the semantics of `@opentui/react`.
- Implement a `createRoot(renderer)` function that accepts the Canvas rendering engine from `web-renderer`.
- Render a standard OpenTUI React component (e.g., `<box><text>Hello World</text></box>`) through the React reconciler, into the WASM core, out through the Canvas renderer, displaying on the screen.

### Milestone 5: Shadcn-OpenTUI Integration
- Replace the current DOM-wrapper in `shadcn-opentui` with the new WebAssembly runtime.
- Update documentation and demo site (`apps/docs`) to use the true native OpenTUI WASM instance.
