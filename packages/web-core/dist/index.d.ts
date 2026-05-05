export interface Cell {
    charCode: number;
    fg: number;
    bg: number;
    style: number;
}
export declare class OpenTUIWebCore {
    static readonly CELL_BYTE_SIZE = 16;
    private wasmInstance;
    private memory;
    private exports;
    init(source?: string | URL | Response | ArrayBuffer): Promise<void>;
    add(a: number, b: number): number;
    getHelloMessage(): string;
    setTerminalSize(cols: number, rows: number): number;
    getTerminalSize(): {
        cols: number;
        rows: number;
    };
    clearTerminal(): void;
    renderHelloDemo(): void;
    handleKeyInput(input: string): void;
    setContent(text: string): void;
    getCellBufferMeta(): {
        ptr: number;
        len: number;
        cols: number;
        rows: number;
        cellByteSize: number;
    };
    getCursorPosition(): {
        x: number;
        y: number;
    };
    readCells(): Cell[];
    getMemoryBuffer(): ArrayBuffer;
    private instantiate;
    private readUtf8;
    private getMemoryView;
    private ensureInit;
}
