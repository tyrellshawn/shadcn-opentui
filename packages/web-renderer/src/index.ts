import { OpenTUIWebCore } from "@opentui/web-core";

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

export class CanvasTerminal implements TerminalRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly core: OpenTUIWebCore;
  private readonly options: Required<CanvasTerminalOptions>;
  private rafId: number | null = null;
  private blinkTimerId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mounted = false;
  private cursorVisible = true;
  private needsRender = true;
  private cellWidth = 10;
  private cellHeight = 18;

  constructor(canvas: HTMLCanvasElement, options: CanvasTerminalOptions = {}) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D context unavailable");
    }

    this.canvas = canvas;
    this.ctx = context;
    this.core = new OpenTUIWebCore();
    this.options = {
      cols: options.cols ?? 80,
      rows: options.rows ?? 24,
      fontSize: options.fontSize ?? 16,
      fontFamily: options.fontFamily ?? "ui-monospace, SFMono-Regular, Menlo, monospace",
      lineHeight: options.lineHeight ?? 1.2,
      blinkIntervalMs: options.blinkIntervalMs ?? 500,
      fitToContainer: options.fitToContainer ?? true,
      minCols: options.minCols ?? 20,
      minRows: options.minRows ?? 8,
    };

    this.configureContext();
    this.recomputeMetrics();
  }

  async init(wasmSource: string | URL | Response | ArrayBuffer = "/main.wasm"): Promise<void> {
    if (this.mounted) return;

    await this.core.init(wasmSource);
    this.core.setTerminalSize(this.options.cols, this.options.rows);
    this.applyResponsiveSize();
    this.core.renderHelloDemo();
    this.resizeCanvas();

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("resize", this.onResize);
    if (this.options.fitToContainer && typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(this.onResize);
      this.resizeObserver.observe(this.canvas);
      if (this.canvas.parentElement) {
        this.resizeObserver.observe(this.canvas.parentElement);
      }
    }
    this.blinkTimerId = window.setInterval(this.onBlinkTick, this.options.blinkIntervalMs);
    this.mounted = true;
    this.startLoop();
  }

  destroy(): void {
    if (!this.mounted) return;

    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("resize", this.onResize);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.blinkTimerId !== null) {
      clearInterval(this.blinkTimerId);
      this.blinkTimerId = null;
    }
    this.mounted = false;
  }

  setContent(content: string): void {
    this.core.setContent(content);
    this.requestRender();
  }

  clear(): void {
    this.core.clearTerminal();
    this.requestRender();
  }

  requestRender(): void {
    this.needsRender = true;
  }

  private startLoop(): void {
    const frame = () => {
      if (this.needsRender) {
        this.renderFrame();
        this.needsRender = false;
      }
      this.rafId = requestAnimationFrame(frame);
    };

    frame();
  }

  private renderFrame(): void {
    const meta = this.core.getCellBufferMeta();
    const memory = this.core.getMemoryBuffer();
    const view = new DataView(memory);
    const glyphCache = new Map<number, string>();

    for (let index = 0; index < meta.len; index += 1) {
      const x = index % meta.cols;
      const y = Math.floor(index / meta.cols);
      const offset = meta.ptr + index * meta.cellByteSize;

      const charCode = view.getUint32(offset, true);
      const fg = view.getUint32(offset + 4, true);
      const bg = view.getUint32(offset + 8, true);
      const style = view.getUint8(offset + 12);

      this.ctx.fillStyle = this.toCssColor(bg);
      this.ctx.fillRect(
        x * this.cellWidth,
        y * this.cellHeight,
        this.cellWidth,
        this.cellHeight,
      );

      if (charCode !== 32 && charCode !== 0) {
        let glyph = glyphCache.get(charCode);
        if (!glyph) {
          glyph = String.fromCodePoint(charCode);
          glyphCache.set(charCode, glyph);
        }

        this.ctx.fillStyle = this.toCssColor(this.applyTextStyle(fg, style));
        this.ctx.font = this.fontFromStyle(style);
        this.ctx.fillText(
          glyph,
          x * this.cellWidth,
          y * this.cellHeight + this.cellHeight - 3,
        );
      }
    }

    if (this.cursorVisible) {
      const { cols, rows } = this.core.getTerminalSize();
      const cursor = this.core.getCursorPosition();
      const cursorX = Math.max(0, Math.min(cols - 1, cursor.x));
      const cursorY = Math.max(0, Math.min(rows - 1, cursor.y));
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      this.ctx.fillRect(
        cursorX * this.cellWidth,
        cursorY * this.cellHeight + this.cellHeight - 2,
        this.cellWidth,
        2,
      );
    }

    this.ctx.font = `${this.options.fontSize}px ${this.options.fontFamily}`;
  }

  private configureContext(): void {
    this.ctx.textBaseline = "alphabetic";
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.font = `${this.options.fontSize}px ${this.options.fontFamily}`;
  }

  private recomputeMetrics(): void {
    const metrics = this.ctx.measureText("M");
    this.cellWidth = Math.ceil(metrics.width) || Math.ceil(this.options.fontSize * 0.65);
    this.cellHeight = Math.ceil(this.options.fontSize * this.options.lineHeight);
  }

  private resizeCanvas(): void {
    const { cols, rows } = this.core.getTerminalSize();
    this.canvas.width = cols * this.cellWidth;
    this.canvas.height = rows * this.cellHeight;
    this.requestRender();
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    if (event.key === "Backspace") {
      event.preventDefault();
      this.core.handleKeyInput("\b");
      this.requestRender();
      return;
    }

    if (event.key === "Enter") {
      this.core.handleKeyInput("\n");
      this.requestRender();
      return;
    }

    if (event.key.length === 1) {
      this.core.handleKeyInput(event.key);
      this.requestRender();
    }
  };

  private readonly onResize = (): void => {
    this.recomputeMetrics();
    this.applyResponsiveSize();
    this.resizeCanvas();
  };

  private applyResponsiveSize(): void {
    if (!this.options.fitToContainer) return;

    const bounds = this.canvas.parentElement?.getBoundingClientRect() ?? this.canvas.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;

    const cols = Math.max(this.options.minCols, Math.floor(bounds.width / this.cellWidth));
    const rows = Math.max(this.options.minRows, Math.floor(bounds.height / this.cellHeight));
    this.core.setTerminalSize(cols, rows);
  }

  private readonly onBlinkTick = (): void => {
    this.cursorVisible = !this.cursorVisible;
    this.requestRender();
  };

  private toCssColor(argb: number): string {
    const a = ((argb >>> 24) & 0xff) / 255;
    const r = (argb >>> 16) & 0xff;
    const g = (argb >>> 8) & 0xff;
    const b = argb & 0xff;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
  }

  private fontFromStyle(style: number): string {
    const bold = (style & 0b1) !== 0;
    const weight = bold ? "700" : "400";
    return `${weight} ${this.options.fontSize}px ${this.options.fontFamily}`;
  }

  private applyTextStyle(argb: number, style: number): number {
    const dim = (style & 0b10) !== 0;
    if (!dim) return argb;

    const alpha = (argb >>> 24) & 0xff;
    const red = Math.floor(((argb >>> 16) & 0xff) * 0.65);
    const green = Math.floor(((argb >>> 8) & 0xff) * 0.65);
    const blue = Math.floor((argb & 0xff) * 0.65);

    return ((alpha & 0xff) << 24) | ((red & 0xff) << 16) | ((green & 0xff) << 8) | (blue & 0xff);
  }
}
