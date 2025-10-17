import { prompt, z, type PromptHandler } from "mcpez"

const url3PointsSummaryHandler: PromptHandler = async ({ url }) => {
    const response = await fetch(`https://into.md/${url}`)

    const markdown = await response.text()

    const prompt = `List the 3 most important points from the following webpage: ${markdown}`
    const child = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", prompt])
    const result = await child.stdout.text()

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

prompt("url 3 points summary", {
    description: "Returns the 3 most important points from a URL.",
    argsSchema: {
        url: z.string().describe("The URL to get the 3 most important points from")
    }
}, url3PointsSummaryHandler)