import { OpenTUIWebCore } from './index';
async function main() {
    const core = new OpenTUIWebCore();
    await core.init();
    console.log('Testing WASM interop:');
    console.log(`Add(5, 7) = ${core.add(5, 7)}`);
    console.log(`Message from Zig: ${core.getHelloMessage()}`);
}
main().catch(console.error);
