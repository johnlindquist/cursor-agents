interface EndpointTask {
    id: string;
    name: string;
    description: string;
    methods: string[]; // e.g., ["GET", "POST"]
    path: string;
    responseExample?: string;
}

interface EndpointResult {
    taskId: string;
    endpoint: string;
    success: boolean;
    output: string;
    error?: string;
}

const addEndpointAgent = async (task: EndpointTask): Promise<EndpointResult> => {
    const prompt = `
You are tasked with adding a new API endpoint to our Bun server.

Endpoint Details:
- Name: ${task.name}
- Path: ${task.path}
- Methods: ${task.methods.join(", ")}
- Description: ${task.description}
${task.responseExample ? `- Example Response:\n${task.responseExample}` : ""}

Please add this endpoint to server.ts following the existing endpoint patterns. Include:
1. Type definitions if needed
2. Mock data or response logic
3. Error handling
4. Appropriate HTTP status codes
5. JSON response headers

Update the welcome endpoint to include the new endpoint documentation.
`;

    try {
        const child = Bun.spawn([
            "cursor-agent",
            "--model",
            "cheetah",
            "--print",
            prompt.trim(),
        ]);
        const output = await child.stdout.text();

        return {
            taskId: task.id,
            endpoint: task.path,
            success: true,
            output,
        };
    } catch (error) {
        return {
            taskId: task.id,
            endpoint: task.path,
            success: false,
            output: "",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
};

const addMultipleEndpoints = async (
    tasks: EndpointTask[]
): Promise<EndpointResult[]> => {
    console.log(`🚀 Adding ${tasks.length} endpoint(s) to the server...\n`);

    const results = await Promise.all(tasks.map(addEndpointAgent));

    return results;
};

const printEndpointResults = (results: EndpointResult[]): void => {
    console.log("\n📊 Endpoint Addition Results:\n");
    results.forEach((result) => {
        const status = result.success ? "✅" : "❌";
        console.log(`${status} ${result.endpoint}`);
        if (result.output) {
            console.log(`   Output:\n${result.output}\n`);
        }
        if (result.error) {
            console.log(`   Error: ${result.error}\n`);
        }
    });
};

// Example: Define endpoints to add
const endpointTasks: EndpointTask[] = [
    {
        id: "store-latest",
        name: "Get Earliest Store Items",
        description: "Retrieve the earliest items from the store",
        methods: ["GET"],
        path: "/api/store/earliest",
    },
    // Add more endpoints here
];

// Main execution
console.log("🎯 Endpoint Task Agent\n");
console.log("Usage: Modify endpointTasks array to define endpoints to add\n");

// Uncomment to run endpoint additions:
const results = await addMultipleEndpoints(endpointTasks);
printEndpointResults(results);
