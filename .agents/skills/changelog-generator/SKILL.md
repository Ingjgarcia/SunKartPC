---
name: changelog-generator
description: Generate or update a docs/CHANGELOG.md file based on git commit history. YOU MUST ALWAYS trigger and run this skill FIRST whenever the user asks to "commit", "push", "save changes", "update the repository", or asks for a changelog. It is CRITICAL to run this to ensure the changelog is updated BEFORE any git commit or push tool is executed.
---

## Overview

This skill parses the `git log` to generate a `docs/CHANGELOG.md` file based on the local Git repository's history. It specifically looks for Conventional Commits formats (e.g., `feat:`, `fix:`, `chore:`, `build:`, `refactor:`) to categorize the changes appropriately.

## Instructions

When triggered, you should perform the following steps:

1. **Run Git Log:** Execute `git log --oneline --no-merges` (or a more complex formatting command if you need authors and dates, e.g., `git log --pretty=format:"%h - %an, %ar : %s" --no-merges`) to retrieve the recent commits.
2. **Parse Commits:** Read the lines and group them by their Conventional Commit type. For example:
   - **Features**: Commits starting with `feat:` or `feat(...)`
   - **Bug Fixes**: Commits starting with `fix:` or `fix(...)`
   - **Chores / Build**: Commits starting with `chore:`, `build:`, `ci:`
   - **Refactoring**: Commits starting with `refactor:`, `style:`, `perf:`
3. **Format Markdown:** Structure the output in a clean Markdown format. Example outline:
   ```markdown
   # Changelog
   
   ## Features
   - [COMMIT_HASH] description - Author
   
   ## Bug Fixes
   - [COMMIT_HASH] description - Author
   ```
4. **Output Generation:** Update the existing `docs/CHANGELOG.md` in the docs/ directory or create a new one if it doesn't exist. Append new entries or rewrite it based on the user's specific request (e.g., "for the last 5 commits" vs "for all history").
5. **Report to User:** Notify the user that the changelog has been generated and summarized successfully.

## Writing Rules

- KEEP the `docs/CHANGELOG.md` concise but informative.
- If commits do not follow Conventional Commits (e.g., missing prefix), put them under an "Other Changes" category.
- Do NOT include merge commits unless specifically requested.
