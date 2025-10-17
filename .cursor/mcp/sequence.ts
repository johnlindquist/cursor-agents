import { prompt, z, type PromptHandler } from "mcpez"

/**
 * Sequential agent demo that chains Cursor and Gemini agents.
 * 
 * Flow:
 * 1. User provides a topic
 * 2. Cursor agent (cheetah model) generates creative content about the topic
 * 3. Gemini agent analyzes and summarizes the cheetah's output
 */

const sequentialAgentHandler: PromptHandler = async ({ userPrompt }) => {
    if (!userPrompt) {
        return {
            messages: [
                {
                    role: "assistant",
                    content: {
                        type: "text",
                        text: "No prompt provided. Please provide a topic for the sequential agent demo."
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

    try {
        // Step 1: Call Cursor Agent (Cheetah model)
        console.error(`🐆 Step 1: Calling Cursor Agent (Cheetah) with topic: "${userPrompt}"`)

        const cheetahPrompt = `Write a creative and energetic description about: ${userPrompt.trim()}. Use bullet points and be enthusiastic!`
        const cursorChild = Bun.spawn(
            ["cursor-agent", "--model", "cheetah", "--print", cheetahPrompt],
            { env }
        )
        const cursorResult = await cursorChild.stdout.text()
        console.error("📝 Cheetah output received:")
        console.error(cursorResult.substring(0, 200) + "...")

        // Step 2: Call Gemini Agent with Cursor's output
        console.error("\n🤖 Step 2: Calling Gemini Agent to analyze Cheetah's output")

        const geminiPrompt = `Analyze the following text and provide:
1. A brief summary (2-3 sentences)
2. Key themes identified
3. The overall tone and style

Text to analyze:
${cursorResult}`

        const geminiChild = Bun.spawn(
            ["gemini", "--model", "gemini-2.5-flash", "--yolo", geminiPrompt],
            { env }
        )
        const geminiResult = await geminiChild.stdout.text()
        console.error("📊 Gemini analysis received")

        // Combine results
        const finalOutput = `
═══════════════════════════════════════════════════════════════
🔄 SEQUENTIAL AGENT DEMO RESULTS
═══════════════════════════════════════════════════════════════

📥 ORIGINAL TOPIC:
${userPrompt}

───────────────────────────────────────────────────────────────
🐆 STEP 1: CURSOR AGENT (CHEETAH MODEL) OUTPUT
───────────────────────────────────────────────────────────────
${cursorResult}

───────────────────────────────────────────────────────────────
🤖 STEP 2: GEMINI AGENT ANALYSIS
───────────────────────────────────────────────────────────────
${geminiResult}

═══════════════════════════════════════════════════════════════
✅ Sequential processing complete!
═══════════════════════════════════════════════════════════════
`.trim()

        return {
            messages: [
                {
                    role: "assistant",
                    content: {
                        type: "text",
                        text: finalOutput
                    }
                }
            ]
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        return {
            messages: [
                {
                    role: "assistant",
                    content: {
                        type: "text",
                        text: `❌ Error in sequential agent execution: ${errorMessage}`
                    }
                }
            ]
        }
    }
}

// Register the prompt
prompt("sequential-agents", {
    description: "Demo of calling multiple agents in sequence: Cursor (cheetah) → Gemini. First agent generates content, second agent analyzes it.",
    argsSchema: {
        userPrompt: z.string().describe("The topic or prompt to process through both agents sequentially")
    }
}, sequentialAgentHandler)

