export interface Cell {
  charCode: number;
  fg: number;
  bg: number;
  style: number;
}

type WasmExports = WebAssembly.Exports & {
  memory: WebAssembly.Memory;
  add: (a: number, b: number) => number;
  alloc: (len: number) => number;
  free: (ptr: number, len: number) => void;
  writeHello: (ptr: number, capacity: number) => number;
  setTerminalSize: (cols: number, rows: number) => number;
  getTerminalWidth: () => number;
  getTerminalHeight: () => number;
  getCellBufferPtr: () => number;
  getCellBufferLen: () => number;
  getCursorX: () => number;
  getCursorY: () => number;
  clearTerminal: () => void;
  renderHelloDemo: () => void;
  handleKeyInput: (ptr: number, len: number) => void;
  setContent: (ptr: number, len: number) => void;
};

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export class OpenTUIWebCore {
  static readonly CELL_BYTE_SIZE = 16;

  private wasmInstance: WebAssembly.Instance | null = null;
  private memory: WebAssembly.Memory | null = null;
  private exports: WasmExports | null = null;

  async init(
    source: string | URL | Response | ArrayBuffer = "/main.wasm",
  ): Promise<void> {
    if (this.wasmInstance) return;

    const imports = {
      env: {
        memory: new WebAssembly.Memory({ initial: 64 }),
      },
    };

    const result = await this.instantiate(source, imports);
    this.wasmInstance = result.instance;
    this.exports = this.wasmInstance.exports as WasmExports;
    this.memory = this.exports.memory;
  }

  add(a: number, b: number): number {
    const exports = this.ensureInit();
    return exports.add(a, b);
  }

  getHelloMessage(): string {
    const exports = this.ensureInit();
    const capacity = 128;
    const ptr = exports.alloc(capacity);

    try {
      const len = exports.writeHello(ptr, capacity);
      return this.readUtf8(ptr, len);
    } finally {
      exports.free(ptr, capacity);
    }
  }

  setTerminalSize(cols: number, rows: number): number {
    const exports = this.ensureInit();
    return exports.setTerminalSize(cols, rows);
  }

  getTerminalSize(): { cols: number; rows: number } {
    const exports = this.ensureInit();
    return {
      cols: exports.getTerminalWidth(),
      rows: exports.getTerminalHeight(),
    };
  }

  clearTerminal(): void {
    const exports = this.ensureInit();
    exports.clearTerminal();
  }

  renderHelloDemo(): void {
    const exports = this.ensureInit();
    exports.renderHelloDemo();
  }

  handleKeyInput(input: string): void {
    const exports = this.ensureInit();
    if (!input.length) return;

    const encoded = textEncoder.encode(input);
    const ptr = exports.alloc(encoded.length);

    try {
      this.getMemoryView(ptr, encoded.length).set(encoded);
      exports.handleKeyInput(ptr, encoded.length);
    } finally {
      exports.free(ptr, encoded.length);
    }
  }

  setContent(text: string): void {
    const exports = this.ensureInit();
    const encoded = textEncoder.encode(text);
    const ptr = exports.alloc(encoded.length);

    try {
      this.getMemoryView(ptr, encoded.length).set(encoded);
      exports.setContent(ptr, encoded.length);
    } finally {
      exports.free(ptr, encoded.length);
    }
  }

  getCellBufferMeta(): {
    ptr: number;
    len: number;
    cols: number;
    rows: number;
    cellByteSize: number;
  } {
    const exports = this.ensureInit();

    return {
      ptr: exports.getCellBufferPtr(),
      len: exports.getCellBufferLen(),
      cols: exports.getTerminalWidth(),
      rows: exports.getTerminalHeight(),
      cellByteSize: OpenTUIWebCore.CELL_BYTE_SIZE,
    };
  }

  getCursorPosition(): { x: number; y: number } {
    const exports = this.ensureInit();
    return { x: exports.getCursorX(), y: exports.getCursorY() };
  }

  readCells(): Cell[] {
    this.ensureInit();
    const meta = this.getCellBufferMeta();
    const view = new DataView(this.memory!.buffer);
    const output: Cell[] = new Array(meta.len);

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

  getMemoryBuffer(): ArrayBuffer {
    this.ensureInit();
    return this.memory!.buffer;
  }

  private async instantiate(
    source: string | URL | Response | ArrayBuffer,
    imports: WebAssembly.Imports,
  ): Promise<WebAssembly.WebAssemblyInstantiatedSource> {
    if (source instanceof ArrayBuffer) {
      return WebAssembly.instantiate(source, imports);
    }

    const response =
      source instanceof Response ? source : await fetch(source.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch wasm (${response.status})`);
    }

    try {
      return await WebAssembly.instantiateStreaming(response, imports);
    } catch {
      const wasmBytes = await response.arrayBuffer();
      return WebAssembly.instantiate(wasmBytes, imports);
    }
  }

  private readUtf8(ptr: number, len: number): string {
    return textDecoder.decode(this.getMemoryView(ptr, len));
  }

  private getMemoryView(ptr: number, len: number): Uint8Array {
    this.ensureInit();
    return new Uint8Array(this.memory!.buffer, ptr, len);
  }

  private ensureInit(): WasmExports {
    if (!this.wasmInstance || !this.memory || !this.exports) {
      throw new Error("Web core not initialized. Call init() first.");
    }

    return this.exports;
  }
}
