---
name: committer
description: Commits changes to the repository in a structured way
---

## Tools

## Commit Format

This skill enforces the use of the **Conventional Commits** standard when writing commit messages. A well-structured commit message is crucial for maintaining a clean history and generating automated changelogs.

### Structure

The commit message should be structured as follows:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Guidelines

1. **Title (First line):**
   - Must be **50 characters or less**.
   - Use the imperative, present tense: "change" not "changed" nor "changes".
   - Do not capitalize the first letter.
   - No period (.) at the end.
   - Contains the type, optional scope, and description.

   **Types include:**
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation only changes
   - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
   - `refactor`: A code change that neither fixes a bug nor adds a feature
   - `perf`: A code change that improves performance
   - `test`: Adding missing tests or correcting existing tests
   - `chore`: Changes to the build process or auxiliary tools and libraries

2. **Description (Body):**
   - Must provide an **extensive explanation** of the changes made.
   - Wrap text at 72 characters.
   - Explain **what** and **why** instead of just **how**. Provide the necessary context to understand the motivation behind the change and its impact on the project.

### Examples

**Example 1: Feature**
```text
feat(auth): add user login mechanism

Implemented the JWT-based authentication flow for the user login process.
This includes the new login endpoint, token generation, and the middleware
for verifying tokens in protected routes.
```

**Example 2: Bug Fix**
```text
fix(ui): resolve button alignment issue on mobile

The submit button on the registration form was overflowing on screens
smaller than 320px. Adjusted the flexbox properties to ensure proper
wrapping and alignment across all mobile viewports.
```
