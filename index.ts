const fruits = ["apple", "banana", "cherry"]

const riddleGenerator = async (fruit: string) => {
    const prompt = ` Please write an extremely brief riddle about the following fruit: ${fruit}`
    const child = Bun.spawn(["cursor-agent", "--model", "cheetah", "--print", prompt])
    const result = await child.stdout.text()
    return result
}

const riddles = await Promise.all(fruits.map(riddleGenerator))

console.log(riddles)
