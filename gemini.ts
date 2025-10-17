const fileSummaryGenerator = async (file: string) => {
    const prompt = `Please write a summary of the following file @${file}`
    const child = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", prompt])
    const result = await child.stdout.text()

    console.log(result)
    return result
}

const files = ["index.ts", "package.json", "README.md"]

const summaries = await Promise.allSettled(files.map(fileSummaryGenerator))
for (const summary of summaries) {
    if (summary.status === "fulfilled") {
        console.log(summary.value)
    } else {
        console.log(summary.reason)
    }
}   