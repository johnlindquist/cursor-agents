import { tool, z, log, startServer } from "mcpez"
import { readdir, readFile, stat } from "fs/promises"
import { join } from "path"
import { homedir } from "os"

// Get the Downloads folder path
const downloadsPath = join(homedir(), "Downloads")

tool(
    "read-downloads-folder",
    {
        description: "Read all files in the Downloads folder and return their contents",
        inputSchema: {
            includeHidden: z.boolean().optional().default(false),
            maxFileSize: z.number().optional().default(1024 * 1024), // 1MB default
            fileExtensions: z.array(z.string()).optional(),
        },
    },
    async ({ includeHidden = false, maxFileSize = 1024 * 1024, fileExtensions }) => {
        try {
            log.info(`Reading files from Downloads folder: ${downloadsPath}`)

            // Read directory contents
            const files = await readdir(downloadsPath)

            const results = []
            const errors = []

            for (const fileName of files) {
                // Skip hidden files if not included
                if (!includeHidden && fileName.startsWith('.')) {
                    continue
                }

                // Filter by file extensions if specified
                if (fileExtensions && fileExtensions.length > 0) {
                    const ext = fileName.split('.').pop()?.toLowerCase()
                    if (!ext || !fileExtensions.includes(ext)) {
                        continue
                    }
                }

                const filePath = join(downloadsPath, fileName)

                try {
                    // Get file stats
                    const fileStats = await stat(filePath)

                    // Skip directories
                    if (fileStats.isDirectory()) {
                        log.debug(`Skipping directory: ${fileName}`)
                        continue
                    }

                    // Check file size
                    if (fileStats.size > maxFileSize) {
                        log.warning(`File ${fileName} is too large (${fileStats.size} bytes), skipping`)
                        results.push({
                            fileName,
                            status: "skipped",
                            reason: `File too large (${fileStats.size} bytes)`,
                            size: fileStats.size,
                        })
                        continue
                    }

                    // Read file content
                    const content = await readFile(filePath, 'utf-8')

                    results.push({
                        fileName,
                        status: "success",
                        content,
                        size: fileStats.size,
                        lastModified: fileStats.mtime.toISOString(),
                    })

                    log.debug(`Successfully read file: ${fileName}`)

                } catch (fileError) {
                    const errorMsg = `Failed to read ${fileName}: ${fileError instanceof Error ? fileError.message : String(fileError)}`
                    log.error(errorMsg)
                    errors.push({
                        fileName,
                        error: errorMsg,
                    })
                }
            }

            const summary = {
                totalFiles: files.length,
                processedFiles: results.length,
                errors: errors.length,
                skippedFiles: results.filter(r => r.status === "skipped").length,
            }

            log.info(`Processing complete: ${summary.processedFiles} files read, ${summary.errors} errors, ${summary.skippedFiles} skipped`)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            summary,
                            files: results,
                            errors: errors.length > 0 ? errors : undefined,
                        }, null, 2),
                    },
                ],
            }

        } catch (error) {
            const errorMsg = `Failed to read Downloads folder: ${error instanceof Error ? error.message : String(error)}`
            log.error(errorMsg)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: errorMsg,
                            downloadsPath,
                        }, null, 2),
                    },
                ],
            }
        }
    },
)

tool(
    "list-downloads-folder",
    {
        description: "List all files in the Downloads folder without reading their contents",
        inputSchema: {
            includeHidden: z.boolean().optional().default(false),
            includeDirectories: z.boolean().optional().default(true),
        },
    },
    async ({ includeHidden = false, includeDirectories = true }) => {
        try {
            log.info(`Listing files in Downloads folder: ${downloadsPath}`)

            const files = await readdir(downloadsPath)
            const results = []

            for (const fileName of files) {
                // Skip hidden files if not included
                if (!includeHidden && fileName.startsWith('.')) {
                    continue
                }

                const filePath = join(downloadsPath, fileName)

                try {
                    const fileStats = await stat(filePath)

                    // Skip directories if not included
                    if (!includeDirectories && fileStats.isDirectory()) {
                        continue
                    }

                    results.push({
                        fileName,
                        isDirectory: fileStats.isDirectory(),
                        size: fileStats.size,
                        lastModified: fileStats.mtime.toISOString(),
                        created: fileStats.birthtime.toISOString(),
                    })

                } catch (fileError) {
                    log.warning(`Failed to get stats for ${fileName}: ${fileError instanceof Error ? fileError.message : String(fileError)}`)
                }
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            downloadsPath,
                            totalItems: results.length,
                            files: results,
                        }, null, 2),
                    },
                ],
            }

        } catch (error) {
            const errorMsg = `Failed to list Downloads folder: ${error instanceof Error ? error.message : String(error)}`
            log.error(errorMsg)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: errorMsg,
                            downloadsPath,
                        }, null, 2),
                    },
                ],
            }
        }
    },
)

// Start the server
await startServer("download-reader", { version: "1.0.0" })
