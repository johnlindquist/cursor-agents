## Shortcut to commit and push changes to GitHub.

```json
  {
    "key": "ctrl+cmd+s",
    "command": "runCommands",
    "args": {
      "commands": [
        {
          "command": "git.stageAll"
        },
        {
          "command": "cursor.generateGitCommitMessage"
        },
        {
          "command": "git.commitAll"
        },
        {
          "command": "git.sync"
        }
      ]
    }
  },
```