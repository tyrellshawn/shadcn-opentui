const fs = require('fs');
const path = require('path');

// This file serves as the JS wrapper for the Zig WASM core
// It will load the WASM and expose a high-level JS API

export class OpenTUIWebCore {
  private wasmModule: WebAssembly.Instance | null = null;
  private memory: WebAssembly.Memory | null = null;

  async init(wasmPath?: string) {
    if (this.wasmModule) return;

    // Resolve path properly whether in src/ or dist/
    const defaultPath = path.join(__dirname, __dirname.endsWith('src') ? '../dist/main.wasm' : 'main.wasm');
    const wasmBinary = fs.readFileSync(wasmPath || defaultPath);
    
    const wasmSource = await WebAssembly.instantiate(wasmBinary, {
      env: {
        memory: new WebAssembly.Memory({ initial: 256 })
      }
    });

    this.wasmModule = wasmSource.instance;
    this.memory = this.wasmModule.exports.memory as WebAssembly.Memory;
  }

  add(a: number, b: number): number {
    this.ensureInit();
    const addFunc = this.wasmModule!.exports.add as (a: number, b: number) => number;
    return addFunc(a, b);
  }

  getHelloMessage(): string {
    this.ensureInit();
    const exports = this.wasmModule!.exports;
    const alloc = exports.alloc as (len: number) => number;
    const free = exports.free as (ptr: number, len: number) => void;
    const writeHello = exports.writeHello as (ptr: number, capacity: number) => number;

    const capacity = 100;
    const ptr = alloc(capacity);
    
    try {
      const len = writeHello(ptr, capacity);
      const buffer = new Uint8Array(this.memory!.buffer, ptr, len);
      return new TextDecoder().decode(buffer);
    } finally {
      free(ptr, capacity);
    }
  }

  private ensureInit() {
    if (!this.wasmModule) {
      throw new Error("WebCore not initialized. Call init() first.");
    }
  }
}
