import type { BeforeSubmitPromptPayload, BeforeSubmitPromptResponse } from "cursor-hooks";
import { join } from "node:path";

const payload: BeforeSubmitPromptPayload = await Bun.stdin.json() as BeforeSubmitPromptPayload;

const cwd = payload.workspace_roots[0]!;
const fileName = payload.conversation_id + ".md";

await Bun.write(join(cwd, "tmp", fileName), payload.prompt);

const output: BeforeSubmitPromptResponse = {
    continue: true || payload.prompt.includes("go")
};


console.log(JSON.stringify(output, null, 2));

