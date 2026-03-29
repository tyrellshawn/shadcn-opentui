import Reconciler from "react-reconciler";
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

type TextNode = {
  kind: "text";
  value: string;
};

type ElementNode = {
  kind: "element";
  type: string;
  props: Record<string, unknown>;
  children: HostNode[];
};

type HostNode = TextNode | ElementNode;

type Container = {
  renderer: RendererLike;
  children: HostNode[];
};

const hostConfig = {
  supportsMutation: true,
  isPrimaryRenderer: true,
  supportsPersistence: false,
  supportsHydration: false,
  noTimeout: -1,

  getRootHostContext: () => null,
  getChildHostContext: () => null,
  prepareForCommit: () => null,
  resetAfterCommit: (container: Container) => {
    const output = container.children
      .map((child) => renderNode(child))
      .join("")
      .replace(/\n{3,}/g, "\n\n");
    container.renderer.setContent(output);
    container.renderer.requestRender();
  },
  shouldSetTextContent: () => false,

  createInstance: (type: string, props: Record<string, unknown>) => {
    return {
      kind: "element",
      type,
      props,
      children: [],
    } satisfies ElementNode;
  },
  createTextInstance: (text: string) => ({ kind: "text", value: text } satisfies TextNode),

  appendInitialChild: (parent: ElementNode, child: HostNode) => {
    parent.children.push(child);
  },
  appendChild: (parent: ElementNode, child: HostNode) => {
    parent.children.push(child);
  },
  appendChildToContainer: (container: Container, child: HostNode) => {
    container.children.push(child);
  },
  removeChild: (parent: ElementNode, child: HostNode) => {
    const index = parent.children.indexOf(child);
    if (index >= 0) parent.children.splice(index, 1);
  },
  removeChildFromContainer: (container: Container, child: HostNode) => {
    const index = container.children.indexOf(child);
    if (index >= 0) container.children.splice(index, 1);
  },
  insertBefore: (parent: ElementNode, child: HostNode, beforeChild: HostNode) => {
    const index = parent.children.indexOf(beforeChild);
    if (index >= 0) {
      parent.children.splice(index, 0, child);
    } else {
      parent.children.push(child);
    }
  },
  insertInContainerBefore: (container: Container, child: HostNode, beforeChild: HostNode) => {
    const index = container.children.indexOf(beforeChild);
    if (index >= 0) {
      container.children.splice(index, 0, child);
    } else {
      container.children.push(child);
    }
  },

  finalizeInitialChildren: () => false,
  prepareUpdate: () => true,
  commitUpdate: (instance: ElementNode, _type: string, _oldProps: unknown, newProps: Record<string, unknown>) => {
    instance.props = newProps;
  },
  commitTextUpdate: (textInstance: TextNode, _oldText: string, newText: string) => {
    textInstance.value = newText;
  },
  resetTextContent: () => {},
  clearContainer: (container: Container) => {
    container.children = [];
  },

  getPublicInstance: (instance: HostNode) => instance,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  queueMicrotask,
  now: Date.now,
  getCurrentEventPriority: () => 1,
  detachDeletedInstance: () => {},
} as const;

const reconciler = Reconciler(hostConfig as never);

export function createRoot(renderer: RendererLike): OpenTUIWebRoot {
  const container: Container = { renderer, children: [] };
  const fiberRoot = (reconciler as unknown as {
    createContainer: (...args: unknown[]) => unknown;
    updateContainer: (...args: unknown[]) => void;
  }).createContainer(container, 0, null, false, null, "", console.error, null);

  return {
    render(node: ReactNode) {
      (reconciler as unknown as { updateContainer: (...args: unknown[]) => void }).updateContainer(
        node,
        fiberRoot,
        null,
        null,
      );
    },
    unmount() {
      (reconciler as unknown as { updateContainer: (...args: unknown[]) => void }).updateContainer(
        null,
        fiberRoot,
        null,
        null,
      );
      renderer.clear();
      renderer.requestRender();
    },
  };
}

function renderNode(node: HostNode): string {
  if (node.kind === "text") return node.value;

  const content = node.children.map((child) => renderNode(child)).join("");
  switch (node.type) {
    case "text":
      return content;
    case "br":
      return "\n";
    case "row":
      return `${content}\n`;
    case "box":
      return renderBox(content);
    default:
      return content;
  }
}

function renderBox(content: string): string {
  const lines = content.split("\n");
  const innerWidth = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const top = `+${"-".repeat(innerWidth + 2)}+`;
  const body = lines.map((line) => `| ${line.padEnd(innerWidth, " ")} |`).join("\n");
  const bottom = `+${"-".repeat(innerWidth + 2)}+`;
  return `${top}\n${body}\n${bottom}`;
}
