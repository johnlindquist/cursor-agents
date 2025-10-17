import type { StopPayload } from "cursor-hooks";
import { join } from "node:path";

const payload: StopPayload = await Bun.stdin.json() as StopPayload;

const cwd = payload.workspace_roots[0]!;
const initialPrompt = await Bun.file(join(cwd, "tmp", payload.conversation_id + ".md")).text()


const process = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", `Please stage and commit all changes related to the initial prompt ${initialPrompt}`, "--yolo"])
const result = await process.stdout.text()

console.log(result)