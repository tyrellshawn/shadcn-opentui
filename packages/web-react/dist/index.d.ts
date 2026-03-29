import type { ReactNode } from "react";
export interface OpenTUIWebRoot {
    render(node: ReactNode): void;
    unmount(): void;
}
type RendererLike = {
    setContent(content: string): void;
    clear(): void;
    requestRender(): void;
};
export declare function createRoot(renderer: RendererLike): OpenTUIWebRoot;
export {};
