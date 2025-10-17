import { prompt, z, type PromptHandler } from "mcpez"

const describeCheetahAgentHandler: PromptHandler = async ({ prompt }) => {
    if (!prompt) {
        return {
            messages: [
                {
                    role: "assistant",
                    content: {
                        type: "text",
                        text: "No prompt provided"
                    }
                }
            ]
        }
    }
    const env = {
        ...process.env,
        CURSOR_AGENT: undefined,
        CURSOR_CLI: undefined,
    }


    const cheetahPrompt = `Describe the following prompt as if you were a cheetah. Organizing all your points quickly and with spots: ${prompt.trim()}`
    const child = Bun.spawn(["cursor-agent", "--model", "cheetah", "--print", cheetahPrompt], {
        env
    })
    const result = await child.stdout.text()
    console.error(result)
    return {
        messages: [
            {
                role: "assistant",
                content: {
                    type: "text",
                    text: result
                }
            }
        ]
    }
}

prompt("cheetah agent", {
    description: "Describes a cheetah",
    argsSchema: {
        prompt: z.string().describe("The prompt to run the cheetaify")
    }
}, describeCheetahAgentHandler)