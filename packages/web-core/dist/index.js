const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
export class OpenTUIWebCore {
    static CELL_BYTE_SIZE = 16;
    wasmInstance = null;
    memory = null;
    exports = null;
    async init(source = "/main.wasm") {
        if (this.wasmInstance)
            return;
        const imports = {
            env: {
                memory: new WebAssembly.Memory({ initial: 64 }),
            },
        };
        const result = await this.instantiate(source, imports);
        this.wasmInstance = result.instance;
        this.exports = this.wasmInstance.exports;
        this.memory = this.exports.memory;
    }
    add(a, b) {
        const exports = this.ensureInit();
        return exports.add(a, b);
    }
    getHelloMessage() {
        const exports = this.ensureInit();
        const capacity = 128;
        const ptr = exports.alloc(capacity);
        try {
            const len = exports.writeHello(ptr, capacity);
            return this.readUtf8(ptr, len);
        }
        finally {
            exports.free(ptr, capacity);
        }
    }
    setTerminalSize(cols, rows) {
        const exports = this.ensureInit();
        return exports.setTerminalSize(cols, rows);
    }
    getTerminalSize() {
        const exports = this.ensureInit();
        return {
            cols: exports.getTerminalWidth(),
            rows: exports.getTerminalHeight(),
        };
    }
    clearTerminal() {
        const exports = this.ensureInit();
        exports.clearTerminal();
    }
    renderHelloDemo() {
        const exports = this.ensureInit();
        exports.renderHelloDemo();
    }
    handleKeyInput(input) {
        const exports = this.ensureInit();
        if (!input.length)
            return;
        const encoded = textEncoder.encode(input);
        const ptr = exports.alloc(encoded.length);
        try {
            this.getMemoryView(ptr, encoded.length).set(encoded);
            exports.handleKeyInput(ptr, encoded.length);
        }
        finally {
            exports.free(ptr, encoded.length);
        }
    }
    setContent(text) {
        const exports = this.ensureInit();
        const encoded = textEncoder.encode(text);
        const ptr = exports.alloc(encoded.length);
        try {
            this.getMemoryView(ptr, encoded.length).set(encoded);
            exports.setContent(ptr, encoded.length);
        }
        finally {
            exports.free(ptr, encoded.length);
        }
    }
    getCellBufferMeta() {
        const exports = this.ensureInit();
        return {
            ptr: exports.getCellBufferPtr(),
            len: exports.getCellBufferLen(),
            cols: exports.getTerminalWidth(),
            rows: exports.getTerminalHeight(),
            cellByteSize: OpenTUIWebCore.CELL_BYTE_SIZE,
        };
    }
    getCursorPosition() {
        const exports = this.ensureInit();
        return { x: exports.getCursorX(), y: exports.getCursorY() };
    }
    readCells() {
        this.ensureInit();
        const meta = this.getCellBufferMeta();
        const view = new DataView(this.memory.buffer);
        const output = new Array(meta.len);
        for (let i = 0; i < meta.len; i += 1) {
            const offset = meta.ptr + i * OpenTUIWebCore.CELL_BYTE_SIZE;
            output[i] = {
                charCode: view.getUint32(offset, true),
                fg: view.getUint32(offset + 4, true),
                bg: view.getUint32(offset + 8, true),
                style: view.getUint8(offset + 12),
            };
        }
        return output;
    }
    getMemoryBuffer() {
        this.ensureInit();
        return this.memory.buffer;
    }
    async instantiate(source, imports) {
        if (source instanceof ArrayBuffer) {
            return WebAssembly.instantiate(source, imports);
        }
        const response = source instanceof Response ? source : await fetch(source.toString());
        if (!response.ok) {
            throw new Error(`Failed to fetch wasm (${response.status})`);
        }
        try {
            return await WebAssembly.instantiateStreaming(response, imports);
        }
        catch {
            const wasmBytes = await response.arrayBuffer();
            return WebAssembly.instantiate(wasmBytes, imports);
        }
    }
    readUtf8(ptr, len) {
        return textDecoder.decode(this.getMemoryView(ptr, len));
    }
    getMemoryView(ptr, len) {
        this.ensureInit();
        return new Uint8Array(this.memory.buffer, ptr, len);
    }
    ensureInit() {
        if (!this.wasmInstance || !this.memory || !this.exports) {
            throw new Error("Web core not initialized. Call init() first.");
        }
        return this.exports;
    }
}
