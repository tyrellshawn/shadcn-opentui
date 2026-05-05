# OpenTUI WASM Runtime - Milestones for CI Implementation

This document tracks the remaining work to make the OpenTUI WebAssembly runtime fully functional. Each issue can be picked up by opencode via CI comments.

---

## Milestone 1: Core Zig Implementation (Priority: HIGH)

### Issue 1.1: Implement Full Cell Buffer Management
- [ ] **1.1.1**: Create dynamic cell buffer with resize capability in `main.zig`
- [ ] **1.1.2**: Implement `setCursorPosition(row, col)` function
- [ ] **1.1.3**: Implement `getTerminalSize()` returning width/height
- [ ] **1.1.4**: Add dirty-rectangle tracking for efficient rendering

### Issue 1.2: Implement Memory Management
- [ ] **1.2.1**: Add proper heap allocator (currently using manual fixed buffer)
- [ ] **1.2.2**: Implement `realloc` for dynamic buffer growth
- [ ] **1.2.3**: Add memory leak detection in debug builds

### Issue 1.3: Implement UTF-8 Text Handling
- [ ] **1.3.1**: Add proper UTF-8 decoding for multi-byte characters
- [ ] **1.3.2**: Handle wide characters (CJK, emoji) correctly
- [ ] **1.3.3**: Implement text measurement for proper cursor positioning

### Issue 1.4: Add Input Handling
- [ ] **1.4.1**: Implement key event queue in Zig
- [ ] **1.4.2**: Add modifier key tracking (Shift, Ctrl, Alt)
- [ ] **1.4.3**: Handle escape sequences for arrow keys, function keys

---

## Milestone 2: Web-Core Package Enhancement (Priority: HIGH)

### Issue 2.1: TypeScript Type Definitions
- [ ] **2.1.1**: Generate `.d.ts` files from Zig exports
- [ ] **2.1.2**: Add type-safe wrapper functions
- [ ] **2.1.3**: Create TypeScript interface for Terminal state

### Issue 2.2: Error Handling & Recovery
- [ ] **2.2.1**: Add WASM load error handling with graceful fallback
- [ ] **2.2.2**: Implement memory access bounds checking
- [ ] **2.2.3**: Add panic handler for graceful degradation

### Issue 2.3: Build System Improvements
- [ ] **2.3.1**: Create `build.zig` for proper Zig build configuration
- [ ] **2.3.2**: Add `zig.toml` for dependency management
- [ ] **2.3.3**: Implement build caching for faster CI builds

---

## Milestone 3: Web-Renderer Enhancement (Priority: HIGH)

### Issue 3.1: Batch Rendering Optimization
- [ ] **3.1.1**: Implement typed array bulk memory reads
- [ ] **3.1.2**: Add dirty-rectangle rendering (only redraw changed cells)
- [ ] **3.1.3**: Implement cell pooling to reduce garbage collection

### Issue 3.2: Font & Text Rendering
- [ ] **3.2.1**: Add dynamic font loading (monospace fallback)
- [ ] **3.2.2**: Implement proper text baseline alignment
- [ ] **3.2.3**: Add ligature support toggle

### Issue 3.3: Performance Improvements
- [ ] **3.3.1**: Add WebGL renderer as alternative to Canvas 2D
- [ ] **3.3.2**: Implement render throttling for high-frequency updates
- [ ] **3.3.3**: Add FPS counter for performance monitoring

---

## Milestone 4: Web-React Reconciler (Priority: HIGH)

### Issue 4.1: Full Component Support
- [ ] **4.1.1**: Implement `<Box>` component with border styles
- [ ] **4.1.2**: Implement `<Text>` with full styling support
- [ ] **4.1.3**: Implement `<Flex>` layout container
- [ ] **4.1.4**: Implement `<Input>` component
- [ ] **4.1.5**: Implement `<Textarea>` component
- [ ] **4.1.6**: Implement `<Select>` component
- [ ] **4.1.7**: Implement `<Progress>` component

### Issue 4.2: React API Parity
- [ ] **4.2.1**: Add `useInput` hook
- [ ] **4.2.2**: Add `useTerminal` hook
- [ ] **4.2.3**: Add `useFocus` hook
- [ ] **4.2.4**: Implement keyboard event handling

### Issue 4.3: Advanced Features
- [ ] **4.3.1**: Implement scrollbox with virtual scrolling
- [ ] **4.3.2**: Add table/list rendering
- [ ] **4.3.3**: Implement animations support

---

## Milestone 5: Integration & Demo (Priority: MEDIUM)

### Issue 5.1: Next.js Integration
- [ ] **5.1.1**: Update app/page.tsx to fully use WASM path
- [ ] **5.1.2**: Add proper loading states and suspense
- [ ] **5.1.3**: Implement SSR-safe WASM loading

### Issue 5.2: Demo Applications
- [ ] **5.2.1**: Create interactive demo with all components
- [ ] **5.2.2**: Add keyboard navigation demo
- [ ] **5.2.3**: Create form input demo

### Issue 5.3: Documentation
- [ ] **5.3.1**: Update README with WASM setup instructions
- [ ] **5.3.2**: Add API documentation for web packages
- [ ] **5.3.3**: Create migration guide from DOM to WASM

---

## Milestone 6: Testing & Quality (Priority: MEDIUM)

### Issue 6.1: Zig Tests
- [ ] **6.1.1**: Add unit tests for cell buffer operations
- [ ] **6.1.2**: Add unit tests for UTF-8 handling
- [ ] **6.1.3**: Add memory allocation tests

### Issue 6.2: Integration Tests
- [ ] **6.2.1**: Add Playwright tests for web-renderer
- [ ] **6.2.2**: Add integration tests for React reconciler
- [ ] **6.2.3**: Add visual regression tests

### Issue 6.3: CI/CD
- [ ] **6.3.1**: Add Zig build to CI pipeline
- [ ] **6.3.2**: Add WASM size budget checks
- [ ] **6.3.3**: Add performance benchmarks

---

## Issue Templates for GitHub

When creating issues, use these templates:

```markdown
## Issue: [Brief Title]

### Description
[What needs to be done]

### Requirements
- [ ] Requirement 1
- [ ] Requirement 2

### References
- Related file: `packages/web-core/src/zig/main.zig`
- See: `.agents/skills/opentui/opentui/references/...`

### Commands
Run `/opencode implement this` to work on this issue via CI
```

---

## Quick Start for OpenCode

To implement any issue, add a comment to the issue:
```
/opencode Please implement the remaining logic for this issue.
```

The opencode.yml workflow will trigger and execute the implementation.

---

## Dependencies & Order

```
Milestone 1 (Core Zig)
    ↓
Milestone 2 (Web-Core)
    ↓
Milestone 3 (Web-Renderer) ← Can be parallel with Milestone 4
    ↓
Milestone 4 (Web-React)
    ↓
Milestone 5 (Integration)
    ↓
Milestone 6 (Testing)
```
