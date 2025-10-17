import { spawn } from "child_process"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

async function testDownloadReader() {
    console.log("Starting download reader MCP server...")

    // Start the MCP server
    const serverProcess = spawn("bun", ["run", "download-reader.ts"], {
        stdio: ["pipe", "pipe", "pipe"],
        cwd: "/Users/johnlindquist/dev/cursor-agents"
    })

    // Create MCP client
    const transport = new StdioClientTransport({
        reader: serverProcess.stdout,
        writer: serverProcess.stdin,
    })

    const client = new Client(
        {
            name: "test-client",
            version: "1.0.0",
        },
        {
            capabilities: {
                tools: {},
            },
        }
    )

    try {
        // Connect to the server
        await client.connect(transport)
        console.log("Connected to MCP server")

        // List available tools
        const tools = await client.listTools()
        console.log("Available tools:", tools.tools.map(t => t.name))

        // Test the list-downloads-folder tool
        console.log("\nTesting list-downloads-folder tool...")
        const listResult = await client.callTool({
            name: "list-downloads-folder",
            arguments: {
                includeHidden: false,
                includeDirectories: true
            }
        })

        console.log("List result:", JSON.stringify(listResult, null, 2))

        // Test the read-downloads-folder tool with limited scope
        console.log("\nTesting read-downloads-folder tool...")
        const readResult = await client.callTool({
            name: "read-downloads-folder",
            arguments: {
                includeHidden: false,
                maxFileSize: 1024, // Only read files smaller than 1KB
                fileExtensions: ["txt", "md", "json"] // Only read text-based files
            }
        })

        console.log("Read result:", JSON.stringify(readResult, null, 2))

    } catch (error) {
        console.error("Error:", error)
    } finally {
        // Clean up
        serverProcess.kill()
        await client.close()
        console.log("Test completed")
    }
}

testDownloadReader().catch(console.error)
