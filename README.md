# Cursor Agents

A TypeScript project for managing and interacting with AI agents using Cursor's agent system. This project demonstrates how to spawn and communicate with cursor agents programmatically.

## Features

- **Agent Management**: Spawn and control cursor agents from TypeScript
- **Model Selection**: Choose from different AI models (e.g., cheetah)
- **Async Communication**: Handle agent responses asynchronously
- **TypeScript Support**: Full type safety and IntelliSense support

## Installation

Install dependencies using Bun:

```bash
bun install
```

## Usage

### Basic Agent Spawning

```typescript
import { spawn } from "bun";

const child = Bun.spawn([
  "cursor-agent", 
  "--model", "cheetah", 
  "--print", "Your message here"
]);

const result = await child.stdout.text();
console.log(result);
```

### Running the Example

Execute the main example:

```bash
bun run index.ts
```

Or run directly:

```bash
bun index.ts
```

## Project Structure

```
cursor-agents/
├── index.ts          # Main entry point with agent example
├── package.json      # Project configuration and dependencies
├── tsconfig.json     # TypeScript configuration
├── README.md         # This file
└── node_modules/     # Dependencies (auto-generated)
```

## Development

This project uses:
- **Bun**: Fast JavaScript runtime and package manager
- **TypeScript**: Type-safe JavaScript development
- **Cursor Agents**: AI agent integration

## Requirements

- Bun v1.3.0 or later
- TypeScript ^5
- Cursor IDE with agent support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `bun test`
5. Submit a pull request

## License

This project is private and proprietary.

---

Built with ❤️ using [Bun](https://bun.com) - the fast all-in-one JavaScript runtime.
