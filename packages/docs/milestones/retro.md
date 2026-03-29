# Retrospective & Notes

## Milestone 1: Setup & PoC
**What went well:**
- The compilation step to `wasm32-freestanding` using Zig works out of the box with the `-rdynamic` flag.
- Turborepo setup effectively isolated the web components from the existing Next.js app.
- Loading the WASM in the browser using `WebAssembly.instantiateStreaming` is straightforward and fast.

**What to improve/Lessons learned:**
- Need to be very careful with string pointers and lengths when crossing the JS-WASM boundary. Manually tracking capacity and allocations in `index.ts` works but could be brittle.
- Make sure to document memory freeing rules to prevent memory leaks in the browser.
