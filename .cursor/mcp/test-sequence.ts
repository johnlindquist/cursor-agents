#!/usr/bin/env bun
/**
 * Test script for the sequential agents demo
 * 
 * This demonstrates how the MCP sequential-agents prompt works:
 * 1. Takes a user topic
 * 2. Passes it to Cursor Agent (cheetah model) for creative content generation
 * 3. Passes the cheetah's output to Gemini for analysis
 * 4. Returns both outputs combined
 * 
 * Usage:
 *   bun .cursor/mcp/test-sequence.ts
 */

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║      SEQUENTIAL AGENTS DEMO - TEST SCRIPT                     ║
╚═══════════════════════════════════════════════════════════════╝

This demo shows how to chain multiple AI agents together:

1️⃣  Cursor Agent (Cheetah Model)
   - Receives the original prompt
   - Generates creative, energetic content
   - Organizes information with bullet points

2️⃣  Gemini Agent (Gemini 2.5 Flash)
   - Receives Cheetah's output
   - Analyzes the content
   - Provides summary, themes, and tone analysis

───────────────────────────────────────────────────────────────

📋 HOW TO USE IN MCP:

When using this MCP server in a client application, you can call:

  Prompt: "sequential-agents"
  Arguments: {
    userPrompt: "Your topic here"
  }

Example topics to try:
  • "artificial intelligence"
  • "quantum computing" 
  • "sustainable energy"
  • "space exploration"

───────────────────────────────────────────────────────────────

🚀 THE FLOW:

  User Input
      ↓
  [Cursor Agent: Cheetah]
      ↓
  Creative Content Generated
      ↓
  [Gemini Agent: Analysis]
      ↓
  Final Combined Output

───────────────────────────────────────────────────────────────

⚙️  MCP SERVER STATUS:

The sequential-agents prompt is now registered and available
through the MCP server defined in .cursor/mcp.json

To test manually (requires cursor-agent and gemini CLIs):
  1. Make sure cursor-agent CLI is installed
  2. Make sure gemini CLI is installed
  3. Restart the MCP server
  4. Call the "sequential-agents" prompt with a topic

═══════════════════════════════════════════════════════════════
`)

// Example of what the internal flow would look like (for demonstration)
console.log("\n💡 EXAMPLE INTERNAL FLOW:\n")

const exampleTopic = "the importance of bees in ecosystems"

console.log(`User provides topic: "${exampleTopic}"`)
console.log("\n🐆 Cheetah would generate something like:")
console.log(`"
• Bees are LIGHTNING FAST pollinators! ⚡
• They work in SPOTTED teams (hives) like a cheetah's coat!
• Without them, ecosystems would COLLAPSE at breakneck speed!
• Every flower visit = CRUCIAL mission for survival!
• Their speed and efficiency = UNMATCHED in nature!
"`)

console.log("\n🤖 Then Gemini would analyze it:")
console.log(`"
Summary: The text emphasizes bees' critical role as pollinators using
energetic language and speed metaphors.

Key Themes:
- Ecological importance of bees
- Teamwork and organization
- Speed and efficiency in nature

Tone: Enthusiastic, urgent, and educational with heavy use of emphasis
and exclamation points.
"`)

console.log("\n✅ Both outputs would be combined and returned to the user!\n")

