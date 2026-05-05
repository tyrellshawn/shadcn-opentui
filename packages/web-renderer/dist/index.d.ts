export interface CanvasTerminalOptions {
    cols?: number;
    rows?: number;
    fontSize?: number;
    fontFamily?: string;
    lineHeight?: number;
    blinkIntervalMs?: number;
    fitToContainer?: boolean;
    minCols?: number;
    minRows?: number;
}
export interface TerminalRenderer {
    setContent(content: string): void;
    clear(): void;
    requestRender(): void;
}
export declare class CanvasTerminal implements TerminalRenderer {
    private readonly canvas;
    private readonly ctx;
    private readonly core;
    private readonly options;
    private rafId;
    private blinkTimerId;
    private resizeObserver;
    private mounted;
    private cursorVisible;
    private needsRender;
    private cellWidth;
    private cellHeight;
    constructor(canvas: HTMLCanvasElement, options?: CanvasTerminalOptions);
    init(wasmSource?: string | URL | Response | ArrayBuffer): Promise<void>;
    destroy(): void;
    setContent(content: string): void;
    clear(): void;
    requestRender(): void;
    private startLoop;
    private renderFrame;
    private configureContext;
    private recomputeMetrics;
    private resizeCanvas;
    private readonly onKeyDown;
    private readonly onResize;
    private applyResponsiveSize;
    private readonly onBlinkTick;
    private toCssColor;
    private fontFromStyle;
    private applyTextStyle;
}
