import { prompt, z, type PromptHandler } from "mcpez"

const intoMarkdownHandler: PromptHandler = async ({ url }) => {
    const response = await fetch(`https://into.md/${url}`)
    const markdown = await response.text()

    return {
        messages: [
            {
                role: "assistant",
                content: {
                    type: "text",
                    text: markdown
                }
            }
        ]
    }
}

prompt("into markdown", {
    description: "Returns a URL as markdown.",
    argsSchema: {
        url: z.string().describe("The URL to convert to markdown")
    }
}, intoMarkdownHandler)