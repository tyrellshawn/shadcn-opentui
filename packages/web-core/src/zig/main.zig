const std = @import("std");

// Expose a basic add function to WASM
export fn add(a: i32, b: i32) i32 {
    return a + b;
}

// Memory allocator for the browser to interact with
var gpa = std.heap.GeneralPurposeAllocator(.{}){};
const allocator = gpa.allocator();

// A function to allocate a string buffer
export fn alloc(len: usize) [*]u8 {
    const slice = allocator.alloc(u8, len) catch @panic("OOM");
    return slice.ptr;
}

// A function to free a string buffer
export fn free(ptr: [*]u8, len: usize) void {
    allocator.free(ptr[0..len]);
}

// Write a generic hello message to a buffer, returning length written
export fn writeHello(ptr: [*]u8, capacity: usize) usize {
    const msg = "Hello from OpenTUI Zig WASM core!";
    const len = @min(msg.len, capacity);
    @memcpy(ptr[0..len], msg[0..len]);
    return len;
}
