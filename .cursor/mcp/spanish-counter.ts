import { prompt, z, type PromptHandler } from "mcpez"

const helloHandler: PromptHandler = async ({ countTo }) => {

    return {
        messages: [
            {
                role: "assistant",
                content: {
                    type: "text",
                    text: `Please count to ${countTo} in Spanish.`
                }
            }
        ]
    }
}

prompt("Spanish Counter", {
    description: "Just return hello world",
    argsSchema: {
        countTo: z.string().describe("The number to count to")
    }
}, helloHandler)