import { readdir, readFile, stat } from "fs/promises"
import { join } from "path"
import { homedir } from "os"

// Get the Downloads folder path
const downloadsPath = join(homedir(), "Downloads")

async function testFileReading() {
    console.log(`Testing file reading from: ${downloadsPath}`)

    try {
        // Read directory contents
        const files = await readdir(downloadsPath)
        console.log(`Found ${files.length} items in Downloads folder`)

        const results = []
        const maxFileSize = 1024 // 1KB for testing

        for (const fileName of files.slice(0, 5)) { // Only test first 5 files
            if (fileName.startsWith('.')) continue // Skip hidden files

            const filePath = join(downloadsPath, fileName)

            try {
                const fileStats = await stat(filePath)

                if (fileStats.isDirectory()) {
                    console.log(`Skipping directory: ${fileName}`)
                    continue
                }

                if (fileStats.size > maxFileSize) {
                    console.log(`Skipping large file: ${fileName} (${fileStats.size} bytes)`)
                    continue
                }

                const content = await readFile(filePath, 'utf-8')

                results.push({
                    fileName,
                    size: fileStats.size,
                    contentLength: content.length,
                    lastModified: fileStats.mtime.toISOString(),
                })

                console.log(`✓ Read file: ${fileName} (${fileStats.size} bytes)`)

            } catch (fileError) {
                console.log(`✗ Failed to read ${fileName}: ${fileError}`)
            }
        }

        console.log(`\nSuccessfully read ${results.length} files:`)
        console.log(JSON.stringify(results, null, 2))

    } catch (error) {
        console.error(`Failed to read Downloads folder: ${error}`)
    }
}

testFileReading()
