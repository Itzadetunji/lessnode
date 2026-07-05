# lessnode

`lessnode` is a Bun + TypeScript CLI that helps you find and remove `node_modules` folders from selected root directories on your machine.

## What it does

- Detects your OS and runs the macOS cleanup flow.
- Lets you pick one or more root folders from your home directory.
- Recursively finds nested `node_modules` folders.
- Shows the results in an interactive multi-select prompt.
- Deletes only the folders you confirm.

## How it works

1. Run the CLI.
2. Select the root directories to scan.
3. Select the `node_modules` folders you want to remove.
4. Confirm deletion.
5. `lessnode` removes those folders with recursive delete.

## Run locally

```bash
npx lessnode
bunx lessnode
```
