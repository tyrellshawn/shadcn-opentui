import Reconciler from "react-reconciler";
const hostConfig = {
    supportsMutation: true,
    isPrimaryRenderer: true,
    supportsPersistence: false,
    supportsHydration: false,
    noTimeout: -1,
    getRootHostContext: () => null,
    getChildHostContext: () => null,
    prepareForCommit: () => null,
    resetAfterCommit: (container) => {
        const output = container.children
            .map((child) => renderNode(child))
            .join("")
            .replace(/\n{3,}/g, "\n\n");
        container.renderer.setContent(output);
        container.renderer.requestRender();
    },
    shouldSetTextContent: () => false,
    createInstance: (type, props) => {
        return {
            kind: "element",
            type,
            props,
            children: [],
        };
    },
    createTextInstance: (text) => ({ kind: "text", value: text }),
    appendInitialChild: (parent, child) => {
        parent.children.push(child);
    },
    appendChild: (parent, child) => {
        parent.children.push(child);
    },
    appendChildToContainer: (container, child) => {
        container.children.push(child);
    },
    removeChild: (parent, child) => {
        const index = parent.children.indexOf(child);
        if (index >= 0)
            parent.children.splice(index, 1);
    },
    removeChildFromContainer: (container, child) => {
        const index = container.children.indexOf(child);
        if (index >= 0)
            container.children.splice(index, 1);
    },
    insertBefore: (parent, child, beforeChild) => {
        const index = parent.children.indexOf(beforeChild);
        if (index >= 0) {
            parent.children.splice(index, 0, child);
        }
        else {
            parent.children.push(child);
        }
    },
    insertInContainerBefore: (container, child, beforeChild) => {
        const index = container.children.indexOf(beforeChild);
        if (index >= 0) {
            container.children.splice(index, 0, child);
        }
        else {
            container.children.push(child);
        }
    },
    finalizeInitialChildren: () => false,
    prepareUpdate: () => true,
    commitUpdate: (instance, _type, _oldProps, newProps) => {
        instance.props = newProps;
    },
    commitTextUpdate: (textInstance, _oldText, newText) => {
        textInstance.value = newText;
    },
    resetTextContent: () => { },
    clearContainer: (container) => {
        container.children = [];
    },
    getPublicInstance: (instance) => instance,
    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    queueMicrotask,
    now: Date.now,
    getCurrentEventPriority: () => 1,
    detachDeletedInstance: () => { },
};
const reconciler = Reconciler(hostConfig);
export function createRoot(renderer) {
    const container = { renderer, children: [] };
    const fiberRoot = reconciler.createContainer(container, 0, null, false, null, "", console.error, null);
    return {
        render(node) {
            reconciler.updateContainer(node, fiberRoot, null, null);
        },
        unmount() {
            reconciler.updateContainer(null, fiberRoot, null, null);
            renderer.clear();
            renderer.requestRender();
        },
    };
}
function renderNode(node) {
    if (node.kind === "text")
        return node.value;
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
function renderBox(content) {
    const lines = content.split("\n");
    const innerWidth = lines.reduce((max, line) => Math.max(max, line.length), 0);
    const top = `+${"-".repeat(innerWidth + 2)}+`;
    const body = lines.map((line) => `| ${line.padEnd(innerWidth, " ")} |`).join("\n");
    const bottom = `+${"-".repeat(innerWidth + 2)}+`;
    return `${top}\n${body}\n${bottom}`;
}
