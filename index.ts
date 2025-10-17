const child = Bun.spawn(["cursor-agent", "--model", "cheetah", "--print", " Please write or read me and fill it with some generic details."])

const result = await child.stdout.text()

console.log(result)