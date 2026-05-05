const std = @import("std");

const MAX_COLS: usize = 240;
const MAX_ROWS: usize = 120;
const MAX_CELLS: usize = MAX_COLS * MAX_ROWS;
const HEAP_SIZE: usize = 1024 * 1024;

const Cell = extern struct {
    char_code: u32,
    fg: u32,
    bg: u32,
    style: u8,
    _pad0: u8,
    _pad1: u8,
    _pad2: u8,
};

var width: usize = 80;
var height: usize = 24;
var cursor_x: usize = 0;
var cursor_y: usize = 0;
var cells: [MAX_CELLS]Cell = undefined;
var initialized = false;

var heap: [HEAP_SIZE]u8 = undefined;
var heap_offset: usize = 0;

fn activeCellCount() usize {
    return width * height;
}

fn setCell(index: usize, char_code: u32, fg: u32, bg: u32, style: u8) void {
    cells[index] = .{
        .char_code = char_code,
        .fg = fg,
        .bg = bg,
        .style = style,
        ._pad0 = 0,
        ._pad1 = 0,
        ._pad2 = 0,
    };
}

fn clearBuffer() void {
    const count = activeCellCount();
    var i: usize = 0;
    while (i < count) : (i += 1) {
        setCell(i, ' ', 0xFFD4D4D4, 0xFF111111, 0);
    }
    cursor_x = 0;
    cursor_y = 0;
}

fn ensureInitialized() void {
    if (!initialized) {
        clearBuffer();
        initialized = true;
    }
}

fn writeCodepoint(codepoint: u32) void {
    if (codepoint == '\n') {
        cursor_x = 0;
        if (cursor_y + 1 < height) cursor_y += 1;
        return;
    }

    if (cursor_x >= width) {
        cursor_x = 0;
        if (cursor_y + 1 < height) cursor_y += 1;
    }

    const index = cursor_y * width + cursor_x;
    if (index < activeCellCount()) {
        setCell(index, codepoint, 0xFFE6E6E6, 0xFF111111, 0);
        cursor_x += 1;
    }
}

fn writeUtf8(bytes: []const u8) void {
    var index: usize = 0;
    while (index < bytes.len) {
        const sequence_length = std.unicode.utf8ByteSequenceLength(bytes[index]) catch {
            writeCodepoint(0xFFFD);
            index += 1;
            continue;
        };

        if (index + sequence_length > bytes.len) {
            writeCodepoint(0xFFFD);
            break;
        }

        const codepoint = std.unicode.utf8Decode(bytes[index .. index + sequence_length]) catch {
            writeCodepoint(0xFFFD);
            index += 1;
            continue;
        };

        writeCodepoint(codepoint);
        index += sequence_length;
    }
}

export fn add(a: i32, b: i32) i32 {
    return a + b;
}

export fn alloc(len: usize) [*]u8 {
    if (len == 0) return @ptrCast(&heap[heap_offset]);
    const aligned = (heap_offset + 7) & ~@as(usize, 7);
    if (aligned + len > HEAP_SIZE) @panic("OOM");
    heap_offset = aligned + len;
    return @ptrCast(&heap[aligned]);
}

export fn free(_: [*]u8, _: usize) void {
    // No-op bump allocator for wasm32-freestanding.
}

export fn writeHello(ptr: [*]u8, capacity: usize) usize {
    const msg = "OpenTUI Zig WASM core ready";
    const len = @min(msg.len, capacity);
    @memcpy(ptr[0..len], msg[0..len]);
    return len;
}

export fn setTerminalSize(cols: usize, rows: usize) usize {
    width = @min(cols, MAX_COLS);
    height = @min(rows, MAX_ROWS);
    if (width == 0) width = 1;
    if (height == 0) height = 1;
    ensureInitialized();
    clearBuffer();
    return activeCellCount();
}

export fn getTerminalWidth() usize {
    ensureInitialized();
    return width;
}

export fn getTerminalHeight() usize {
    ensureInitialized();
    return height;
}

export fn getCellBufferPtr() [*]Cell {
    ensureInitialized();
    return @ptrCast(&cells[0]);
}

export fn getCellBufferLen() usize {
    ensureInitialized();
    return activeCellCount();
}

export fn getCursorX() usize {
    ensureInitialized();
    return cursor_x;
}

export fn getCursorY() usize {
    ensureInitialized();
    return cursor_y;
}

export fn clearTerminal() void {
    ensureInitialized();
    clearBuffer();
}

export fn renderHelloDemo() void {
    ensureInitialized();
    clearBuffer();
    const msg = "OpenTUI WASM Canvas renderer";
    var i: usize = 0;
    while (i < msg.len and i < width) : (i += 1) {
        setCell(i, msg[i], 0xFF70D6FF, 0xFF111111, 1);
    }

    const subtitle = "Type to edit. UTF-8 enabled.";
    i = 0;
    while (i < subtitle.len and i < width) : (i += 1) {
        const index = width + i;
        if (index >= activeCellCount()) break;
        setCell(index, subtitle[i], 0xFFC8D0DA, 0xFF111111, 2);
    }
    cursor_x = @min(subtitle.len, width - 1);
    cursor_y = 2;
}

export fn handleKeyInput(ptr: [*]const u8, len: usize) void {
    ensureInitialized();
    if (len == 0) return;

    if (len == 1 and ptr[0] == 8) {
        if (cursor_x > 0) {
            cursor_x -= 1;
            const index = cursor_y * width + cursor_x;
            setCell(index, ' ', 0xFFE6E6E6, 0xFF111111, 0);
        }
        return;
    }

    writeUtf8(ptr[0..len]);
}

export fn setContent(ptr: [*]const u8, len: usize) void {
    ensureInitialized();
    clearBuffer();

    writeUtf8(ptr[0..len]);
}
