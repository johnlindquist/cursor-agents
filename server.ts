// Simple Bun server with demo endpoint
interface DemoObject {
    [key: string]: any;
}

interface StoreItem {
    id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
    rating: number;
    addedAt: string;
}

const demoObjects: DemoObject[] = [];

// Mock store items data
const storeItems: StoreItem[] = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        category: "Electronics",
        inStock: true,
        rating: 4.5,
        addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        name: "USB-C Cable",
        price: 12.99,
        category: "Accessories",
        inStock: true,
        rating: 4.8,
        addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        name: "Phone Case",
        price: 24.99,
        category: "Accessories",
        inStock: true,
        rating: 4.3,
        addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        name: "Portable Speaker",
        price: 49.99,
        category: "Electronics",
        inStock: false,
        rating: 4.6,
        addedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 5,
        name: "Screen Protector",
        price: 9.99,
        category: "Accessories",
        inStock: true,
        rating: 4.2,
        addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

Bun.serve({
    port: 3000,
    hostname: "localhost",
    routes: {
        "/": {
            GET: () => {
                return new Response(
                    JSON.stringify({
                        message: "Welcome to the Demo API",
                        endpoints: {
                            "POST /api/demo": "Submit demo objects",
                            "GET /api/demo": "Retrieve all demo objects",
                            "GET /api/demo/:id": "Get a specific demo object",
                            "GET /api/store/latest": "Get the latest items from the store",
                        },
                    }),
                    { headers: { "Content-Type": "application/json" } }
                );
            },
        },
        "/api/demo": {
            GET: () => {
                return new Response(JSON.stringify(demoObjects, null, 2), {
                    headers: { "Content-Type": "application/json" },
                });
            },
            POST: async (req) => {
                try {
                    const body = await req.json();
                    const objectWithId = {
                        id: demoObjects.length + 1,
                        ...body,
                        timestamp: new Date().toISOString(),
                    };
                    demoObjects.push(objectWithId);
                    return new Response(JSON.stringify(objectWithId, null, 2), {
                        status: 201,
                        headers: { "Content-Type": "application/json" },
                    });
                } catch (error) {
                    return new Response(
                        JSON.stringify({ error: "Invalid JSON in request body" }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                }
            },
        },
        "/api/demo/:id": {
            GET: (req) => {
                const id = parseInt(req.params.id);
                const obj = demoObjects.find((o) => o.id === id);
                if (!obj) {
                    return new Response(JSON.stringify({ error: "Object not found" }), {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    });
                }
                return new Response(JSON.stringify(obj, null, 2), {
                    headers: { "Content-Type": "application/json" },
                });
            },
        },
        "/api/store/latest": {
            GET: (req) => {
                // Optional query parameter to limit results (default: all items)
                const url = new URL(req.url);
                const limit = parseInt(url.searchParams.get("limit") || "10");

                // Sort by most recently added and slice to limit
                const latestItems = storeItems
                    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
                    .slice(0, limit);

                return new Response(JSON.stringify({
                    total: storeItems.length,
                    retrieved: latestItems.length,
                    items: latestItems,
                }, null, 2), {
                    headers: { "Content-Type": "application/json" },
                });
            },
        },
    },
});

console.log("🚀 Server running at http://localhost:3000");
console.log("📝 POST demo objects to http://localhost:3000/api/demo");
console.log("📦 GET latest store items at http://localhost:3000/api/store/latest");
