# OpenTUI WebAssembly Optimization Skill

This skill provides deep knowledge for building a high-performance WebAssembly bridge between OpenTUI's Zig core and browser Canvas rendering.

## When to use this skill

Use this skill when:
- Implementing WASM bindings for OpenTUI
- Optimizing memory management between JS and WASM
- Building Canvas-based rendering for terminal grid/cell buffers
- Porting OpenTUI's native renderer to the browser
- Debugging WASM performance issues

## Core Architecture

### OpenTUI Renderer Model

OpenTUI uses a **CliRenderer** that manages:
1. **OptimizedBuffer**: A 2D cell grid storing character, foreground, background, and style data
2. **Render Loop**: Continuous or on-demand rendering at target FPS
3. **Input Handling**: Keyboard, mouse, resize, focus events
4. **Terminal Capabilities**: Alternate screen, mouse tracking, keyboard protocols

Key concepts from the docs:
- The renderer has a `root` renderable that fills the terminal
- Renderables draw into an `OptimizedBuffer` (frame buffer)
- The buffer is then output to the terminal as ANSI escape sequences
- Render loop can be automatic (on tree changes), continuous (target FPS), or live (for animations)

### WASM Architecture for Web

For the browser port, we need to:

1. **Replace the Zig Terminal Layer**
   - Native: writes ANSI to stdout, reads from stdin
   - Browser: writes to shared WASM memory, reads from Canvas 2D context

2. **Expose the OptimizedBuffer via WASM**
   ```zig
   // Export a function to get buffer dimensions
   export fn getBufferWidth() u32 { return buffer.width; }
   export fn getBufferHeight() u32 { return buffer.height; }
   
   // Export access to cell data
   export fn getCellPtr() [*]Cell { return buffer.cells.ptr; }
   ```

3. **Canvas Renderer (JS Side)**
   - Read the WASM buffer memory directly
   - For each cell: draw background rect, draw text glyph
   - Use monospace font and precise cell measurements
   - Optimize: batch draws, dirty rectangles, offscreen canvas

## Memory Management Best Practices

### String Passing (JS ↔ WASM)

Always use pointer + length pairs:

```zig
export fn alloc(len: usize) [*]u8 {
    const slice = allocator.alloc(u8, len) catch @panic("OOM");
    return slice.ptr;
}

export fn free(ptr: [*]u8, len: usize) void {
    allocator.free(ptr[0..len]);
}

export fn writeText(ptr: [*]u8, capacity: usize, text: []const u8) usize {
    const len = @min(text.len, capacity);
    @memcpy(ptr[0..len], text[0..len]);
    return len;
}
```

JS side:
```js
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function passStringToWasm(wasmExports, str) {
    const encoded = encoder.encode(str);
    const ptr = wasmExports.alloc(encoded.length);
    const memory = new Uint8Array(wasmExports.memory.buffer);
    memory.set(encoded, ptr);
    
    // Call WASM function with ptr and len
    wasmExports.processString(ptr, encoded.length);
    
    // Always free!
    wasmExports.free(ptr, encoded.length);
}

function readStringFromWasm(wasmExports, ptr, len) {
    const memory = new Uint8Array(wasmExports.memory.buffer);
    const slice = memory.subarray(ptr, ptr + len);
    return decoder.decode(slice);
}
```

### Shared Memory for Buffer Access

The OptimizedBuffer should be in WASM linear memory that JS can read directly:

```js
class CanvasRenderer {
    constructor(wasmInstance) {
        this.wasm = wasmInstance.exports;
        this.memory = wasmInstance.exports.memory;
    }
    
    getCellData(x, y) {
        const width = this.wasm.getBufferWidth();
        const cellPtr = this.wasm.getCellPtr();
        const cellSize = 16; // sizeof(Cell) in bytes
        
        const offset = cellPtr + (y * width + x) * cellSize;
        const view = new DataView(this.memory.buffer, offset, cellSize);
        
        return {
            char: view.getUint32(0, true),      // 4 bytes: Unicode codepoint
            fg: view.getUint32(4, true),        // 4 bytes: RGBA
            bg: view.getUint32(8, true),        // 4 bytes: RGBA
            style: view.getUint32(12, true),    // 4 bytes: bold, italic, etc.
        };
    }
}
```

## Canvas Rendering Optimization

### Cell-Based Grid Rendering

```js
class TerminalCanvas {
    constructor(canvas, cols, rows) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false });
        this.cols = cols;
        this.rows = rows;
        
        // Measure font to get precise cell dimensions
        this.ctx.font = '14px "Cascadia Code", "Fira Code", monospace';
        const metrics = this.ctx.measureText('M');
        this.cellWidth = Math.ceil(metrics.width);
        this.cellHeight = 20; // line height
        
        this.canvas.width = this.cols * this.cellWidth;
        this.canvas.height = this.rows * this.cellHeight;
        
        // Offscreen canvas for double buffering
        this.offscreen = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        this.offscreenCtx = this.offscreen.getContext('2d', { alpha: false });
    }
    
    renderCell(x, y, char, fg, bg, style) {
        const px = x * this.cellWidth;
        const py = y * this.cellHeight;
        
        // Draw background
        this.offscreenCtx.fillStyle = rgbaToHex(bg);
        this.offscreenCtx.fillRect(px, py, this.cellWidth, this.cellHeight);
        
        // Draw text
        this.offscreenCtx.fillStyle = rgbaToHex(fg);
        if (style & STYLE_BOLD) this.offscreenCtx.font = 'bold 14px monospace';
        if (style & STYLE_ITALIC) this.offscreenCtx.font = 'italic 14px monospace';
        
        this.offscreenCtx.fillText(char, px, py + this.cellHeight - 4);
        
        // Reset font
        this.offscreenCtx.font = '14px monospace';
    }
    
    renderFrame(wasmRenderer) {
        const width = wasmRenderer.wasm.getBufferWidth();
        const height = wasmRenderer.wasm.getBufferHeight();
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = wasmRenderer.getCellData(x, y);
                this.renderCell(x, y, 
                    String.fromCodePoint(cell.char),
                    cell.fg, cell.bg, cell.style
                );
            }
        }
        
        // Blit offscreen to main canvas
        this.ctx.drawImage(this.offscreen, 0, 0);
    }
}
```

### Performance Optimizations

1. **Dirty Rectangle Tracking**
   ```zig
   export fn getDirtyRegion(out_x: *u32, out_y: *u32, out_w: *u32, out_h: *u32) bool {
       if (buffer.dirty_rect) |rect| {
           out_x.* = rect.x;
           out_y.* = rect.y;
           out_w.* = rect.width;
           out_h.* = rect.height;
           return true;
       }
       return false;
   }
   ```

2. **Request Animation Frame Loop**
   ```js
   class RenderLoop {
       constructor(wasmRenderer, canvasRenderer) {
           this.wasmRenderer = wasmRenderer;
           this.canvasRenderer = canvasRenderer;
           this.running = false;
       }
       
       start() {
           this.running = true;
           const frame = () => {
               if (!this.running) return;
               
               // Let WASM update internal state
               this.wasmRenderer.wasm.tick();
               
               // Render to canvas
               this.canvasRenderer.renderFrame(this.wasmRenderer);
               
               requestAnimationFrame(frame);
           };
           requestAnimationFrame(frame);
       }
       
       stop() {
           this.running = false;
       }
   }
   ```

3. **Batch Drawing Operations**
   - Group adjacent cells with the same background color
   - Use `fillRect` once for multiple cells
   - Cache rendered glyphs in an offscreen ImageData buffer

## Event Handling (Browser → WASM)

```js
canvas.addEventListener('keydown', (e) => {
    e.preventDefault();
    
    // Map browser KeyboardEvent to OpenTUI key sequence
    const key = mapKeyToSequence(e);
    
    // Pass to WASM
    const encoder = new TextEncoder();
    const encoded = encoder.encode(key);
    const ptr = wasmRenderer.wasm.alloc(encoded.length);
    const memory = new Uint8Array(wasmRenderer.wasm.memory.buffer);
    memory.set(encoded, ptr);
    
    wasmRenderer.wasm.handleKeyInput(ptr, encoded.length);
    wasmRenderer.wasm.free(ptr, encoded.length);
});

window.addEventListener('resize', () => {
    const cols = Math.floor(window.innerWidth / cellWidth);
    const rows = Math.floor(window.innerHeight / cellHeight);
    wasmRenderer.wasm.handleResize(cols, rows);
});
```

## Platform Abstraction in Zig

To make OpenTUI work in the browser, abstract the terminal I/O:

```zig
const Platform = enum {
    native_terminal,
    web_canvas,
};

const TerminalPlatform = struct {
    platform: Platform,
    
    pub fn write(self: *TerminalPlatform, bytes: []const u8) !void {
        switch (self.platform) {
            .native_terminal => try stdout.write(bytes),
            .web_canvas => {
                // No-op, buffer is read directly by JS
            },
        }
    }
    
    pub fn read(self: *TerminalPlatform) ![]const u8 {
        switch (self.platform) {
            .native_terminal => return try stdin.readLine(),
            .web_canvas => {
                // Input comes from JS event callbacks
                return &input_buffer;
            },
        }
    }
};
```

## Debugging Tips

1. **Memory Leaks**
   - Always pair `alloc` with `free`
   - Use Chrome DevTools Memory Profiler
   - Track WASM memory growth: `wasmInstance.exports.memory.buffer.byteLength`

2. **Alignment Issues**
   - Ensure struct packing matches between Zig and JS DataView reads
   - Use `@alignOf` and `@sizeOf` in Zig
   - Test with `zig build-exe -O Debug` first

3. **Performance Profiling**
   - Use Chrome DevTools Performance tab
   - Check for layout thrashing (read/write DOM in loops)
   - Measure canvas draw time vs WASM compute time
   - Target 60fps (16.67ms per frame)

## Anti-Patterns to Avoid

❌ **Don't** call WASM functions in tight loops from JS
```js
// BAD
for (let i = 0; i < 1000; i++) {
    wasm.processItem(i);
}

// GOOD
wasm.processBatch(items.ptr, items.length);
```

❌ **Don't** allocate new strings on every render
```js
// BAD
cell.char.split('').forEach(c => { /* ... */ });

// GOOD
const codePoint = cell.char;
ctx.fillText(String.fromCodePoint(codePoint), x, y);
```

❌ **Don't** ignore WASM memory growth
```js
// BAD
const view = new DataView(memory.buffer);

// GOOD - memory.buffer can change!
function getCellData() {
    const view = new DataView(wasm.memory.buffer);
    // ... use view immediately
}
```

## References

- [OpenTUI Renderer Docs](https://opentui.com/docs/core-concepts/renderer/)
- [MDN WebAssembly Guide](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Zig WASM Target](https://ziglang.org/documentation/master/#WebAssembly)
- [Canvas 2D Performance Tips](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
