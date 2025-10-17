import { prompt, z, type PromptHandler } from "mcpez"

const imageGeneratorHandler: PromptHandler = async ({ description }) => {
    console.error(description)
    const prompt = `/generate an image of a ${description}`
    console.error(prompt)

    try {
        const child = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", "--yolo", prompt])
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

    } catch (error) {
        console.error(error)
        return {
            messages: [
                {
                    role: "assistant",
                    content: {
                        type: "text",
                        text: "Error generating image"
                    }
                }
            ]
        }
    }


}

prompt("image generator", {
    description: "Generates an image based on a description.",
    argsSchema: {
        description: z.string().describe("The description of the image to generate")
    }
}, imageGeneratorHandler)