import { z, prompt } from "mcpez"

interface GitHubUser {
    login: string
}

interface GitHubLabel {
    name: string
}

interface GitHubMilestone {
    title: string
}

interface GitHubIssue {
    number: number
    title: string
    state: string
    body: string
    author: GitHubUser
    createdAt: string
    updatedAt: string
    assignees: GitHubUser[]
    labels: GitHubLabel[]
    milestone: GitHubMilestone | null
    comments: number
}

prompt(
    "pull-issue",
    {
        description: "Pull and review GitHub issue content using gh CLI",
        argsSchema: {
            issueNumber: z.string().describe("The number of the issue to pull"),
        },
    },
    async ({ issueNumber }) => {
        try {
            // Use Bun.$ to invoke gh CLI to get full issue details as JSON
            const { stdout } = await Bun.$`gh issue view ${issueNumber} --json title,number,state,body,labels,assignees,milestone,comments,createdAt,updatedAt,author`

            const issueData: GitHubIssue = JSON.parse(stdout.toString().trim())

            // Format the issue content with all fields
            let formattedContent = `# Issue #${issueData.number}: ${issueData.title}

**Status:** ${issueData.state}
**Author:** ${issueData.author?.login || 'Unknown'}
**Created:** ${issueData.createdAt}
**Updated:** ${issueData.updatedAt}
`

            if (issueData.assignees && issueData.assignees.length > 0) {
                formattedContent += `**Assignees:** ${issueData.assignees.map((assignee: GitHubUser) => assignee.login).join(', ')}\n`
            }

            if (issueData.labels && issueData.labels.length > 0) {
                formattedContent += `**Labels:** ${issueData.labels.map((label: GitHubLabel) => label.name).join(', ')}\n`
            }

            if (issueData.milestone) {
                formattedContent += `**Milestone:** ${issueData.milestone.title}\n`
            }

            formattedContent += `
## Description

${issueData.body || '(No description provided)'}

---
`

            // Infer branch name from issue number and title
            const slugifiedTitle = issueData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .slice(0, 50) // Limit length

            const branchName = `issue-${issueData.number}-${slugifiedTitle}`

            // Create branch using Bun.spawn (similar to cursor.ts pattern)
            try {
                const gitProcess = Bun.spawn(
                    ['git', 'checkout', '-b', branchName],
                    {
                        env: {
                            ...process.env,
                        },
                        stdout: 'pipe',
                        stderr: 'pipe',
                    }
                )

                const exitCode = await gitProcess.exited
                const stderr = await gitProcess.stderr.text()

                if (exitCode === 0) {
                    formattedContent += `
✅ **Branch Created:** \`${branchName}\`

---

**Please begin work on this issue**
`
                } else {
                    formattedContent += `
⚠️ **Branch Creation Note:** Could not create branch \`${branchName}\`
${stderr ? `Error: ${stderr.trim()}` : ''}

You can create it manually with:
\`\`\`bash
git checkout -b ${branchName}
\`\`\`
`
                }
            } catch (branchError) {
                const branchErrorMsg = branchError instanceof Error ? branchError.message : String(branchError)
                formattedContent += `
⚠️ **Branch Creation Note:** Could not create branch \`${branchName}\`
Error: ${branchErrorMsg}

You can create it manually with:
\`\`\`bash
git checkout -b ${branchName}
\`\`\`
`
            }

            return {
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: formattedContent,
                        },
                    },
                ],
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            return {
                messages: [
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: `Error fetching issue #${issueNumber}: ${errorMessage}`,
                        },
                    },
                ],
            }
        }
    },
)

prompt(
    "open-pr",
    {
        description: "Open a GitHub pull request using gh CLI based on current branch work",
        argsSchema: {
            title: z.string().optional().describe("The title of the pull request (defaults to branch name or first commit)"),
            body: z.string().optional().describe("The body/description of the pull request (defaults to commit messages)"),
            draft: z.boolean().optional().describe("Create as draft pull request"),
            base: z.string().optional().describe("The base branch to merge into (defaults to main/master)"),
        },
    },
    async ({ title, body, draft, base }) => {
        try {
            // Get current branch name
            const { stdout: branchStdout } = await Bun.$`git branch --show-current`
            const currentBranch = branchStdout.toString().trim()

            if (!currentBranch) {
                return {
                    messages: [
                        {
                            role: "assistant",
                            content: {
                                type: "text",
                                text: "❌ Error: Not currently on a branch (detached HEAD state)",
                            },
                        },
                    ],
                }
            }

            // Check if there are commits to push
            const { stdout: statusStdout } = await Bun.$`git status --porcelain --branch`
            const statusText = statusStdout.toString()

            // Build gh pr create command arguments
            const args = ['pr', 'create']

            if (title) {
                args.push('--title', title)
            }

            if (body) {
                args.push('--body', body)
            } else {
                args.push('--fill') // Use commit info to fill in title and body
            }

            if (draft) {
                args.push('--draft')
            }

            if (base) {
                args.push('--base', base)
            }

            // Create the PR using gh CLI
            const prProcess = Bun.spawn(
                ['gh', ...args],
                {
                    env: {
                        ...process.env,
                    },
                    stdout: 'pipe',
                    stderr: 'pipe',
                }
            )

            const exitCode = await prProcess.exited
            const stdout = await prProcess.stdout.text()
            const stderr = await prProcess.stderr.text()

            if (exitCode === 0) {
                // Extract PR URL from output (gh pr create returns the URL)
                const prUrl = stdout.trim()

                let formattedContent = `# Pull Request Created Successfully! 🎉

**Branch:** \`${currentBranch}\`
**PR URL:** ${prUrl}

---

${stdout}
`
                if (draft) {
                    formattedContent += `\n📝 *This PR was created as a draft*`
                }

                return {
                    messages: [
                        {
                            role: "assistant",
                            content: {
                                type: "text",
                                text: formattedContent,
                            },
                        },
                    ],
                }
            } else {
                return {
                    messages: [
                        {
                            role: "assistant",
                            content: {
                                type: "text",
                                text: `❌ Error creating pull request:

**Branch:** \`${currentBranch}\`

**Error:**
${stderr || stdout}

**Possible issues:**
- Branch may not be pushed to remote yet (try: \`git push -u origin ${currentBranch}\`)
- No commits on this branch
- PR may already exist for this branch
- Not authenticated with GitHub CLI (try: \`gh auth login\`)
`,
                            },
                        },
                    ],
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            return {
                messages: [
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: `❌ Error opening pull request: ${errorMessage}`,
                        },
                    },
                ],
            }
        }
    },
)