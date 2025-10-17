import type { StopPayload, StopResponse } from "cursor-hooks";
import { join } from "node:path";

const payload: StopPayload = await Bun.stdin.json() as StopPayload;
console.error(payload)

const cwd = payload.workspace_roots[0]!;
const initialPrompt = await Bun.file(join(cwd, "tmp", payload.conversation_id + ".md")).text()

console.error(initialPrompt)

const env = {
    PATH: "/Users/johnlindquist/Library/pnpm:/Users/johnlindquist/.npm-global/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
}

const process = Bun.spawn({
    cmd: ["gemini", "--model", "gemini-2.5-flash", `Please stage and commit all changes related to the initial prompt ${initialPrompt}`, "--yolo"],
    env,
    cwd
})
const result = await process.stdout.text()

console.error(result)