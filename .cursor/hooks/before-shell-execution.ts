import type { BeforeShellExecutionPayload, BeforeShellExecutionResponse } from "cursor-hooks";
import { join } from "node:path";

const payload: BeforeShellExecutionPayload = await Bun.stdin.json() as BeforeShellExecutionPayload;

const cwd = payload.workspace_roots[0]!;
const initialPrompt = await Bun.file(join(cwd, "tmp", payload.conversation_id + ".md")).text()

if (initialPrompt.includes("-ls")) {
    const output: BeforeShellExecutionResponse = {
        permission: "deny",
        agentMessage: "Please some glob pattern to search for files.",
        userMessage: "Please some glob pattern to search for files."
    }

    console.log(JSON.stringify(output, null, 2));

} else {
    const output: BeforeShellExecutionResponse = {
        permission: "allow"
    }
    console.log(JSON.stringify(output, null, 2));
}


