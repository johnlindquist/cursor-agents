const fileSummaryGenerator = async (file: string) => {
    const prompt = ` Please write a summary of the following file: ${file}`
    const child = Bun.spawn(["cursor-agent", "--model", "cheetah", "--print", prompt])
    const result = await child.stdout.text()
    return result
}

const files = ["index.ts", "package.json", "README.md"]

const summaries = await Promise.all(files.map(fileSummaryGenerator))
console.log(summaries)