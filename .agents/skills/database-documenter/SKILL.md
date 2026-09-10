---
name: database-documenter
description: Automatically maintains the project's database documentation. You MUST execute this skill whenever the user asks to modify the database, creates or updates `.sql` files, runs migrations, or discusses changes to the database schema. This skill ensures that `docs/DATA_BASE.md` is always up-to-date with a robust data dictionary and Entity-Relationship (ER) model.
---

# Database Documenter Skill

This skill guarantees that the database layer of the project is consistently and robustly documented in the `docs/DATA_BASE.md` file located at the docs/ directory. A robustly documented database is critical for maintaining complex entity relationships and developer onboarding.

## When to Use

ALWAYS trigger this skill proactively when you observe any of the following:
- Generation or modification of `.sql` files.
- Creation or modification of database migration scripts.
- The user explicitly asking you to design, update, or alter the database schema.
- Creating or removing database tables, columns, constraints, or triggers.

## What to Do

When triggered, your responsibility is to analyze the current state of the database schema (by reading the relevant `.sql` files or migration files) and update `docs/DATA_BASE.md`.

**Instructions for updating `docs/DATA_BASE.md`:**

1. **Locate or Create `docs/DATA_BASE.md`**: Find the file at the docs/ directory. If it doesn't exist, create it.
2. **Analyze the Schema**: Read the source `.sql` files (e.g., `schema.sql`, `migrations/*.sql`) to understand all tables, columns, types, defaults, and relationships (foreign keys).
3. **Generate/Update the Markdown Content**: The file must follow a strict and robust structure.

### Required Structure for `docs/DATA_BASE.md`

You must format the `docs/DATA_BASE.md` file exactly as follows:

```markdown
# Database Documentation

Brief summary of the database purpose and architecture (e.g., "PostgreSQL database for Saya Hub supporting SSO and RBAC").

## Schema Overview

- **Database Engine**: [e.g., Neon Serverless Postgres / PostgreSQL]
- **Primary Schema**: [e.g., `saya_hub`]

## Entity-Relationship Model

Include a `mermaid` block with the `erDiagram` syntax representing all tables and their relationships.

\`\`\`mermaid
erDiagram
    USERS ||--o{ USER_ROLES : "has"
    ROLES ||--o{ USER_ROLES : "assigned to"
    ROLES ||--o{ ROLE_APPLICATIONS : "grants access to"
    APPLICATIONS ||--o{ ROLE_APPLICATIONS : "accessed by"

    USERS {
        UUID id PK
        VARCHAR email UK
        VARCHAR password_hash
        BOOLEAN is_active
    }
    %% ... define all other entities and relationships ...
\`\`\`

## Data Dictionary

For each table in the schema, create a subsection with a markdown table detailing its columns.

### Table: `[table_name]`
**Description**: [What this table stores and its purpose in the system]

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PK | `gen_random_uuid()` | Unique identifier |
| `email` | VARCHAR(255) | UK, NOT NULL | | User's email address |

### Triggers & Functions
Document any automated database logic, such as triggers for updating `updated_at` timestamps.

| Name | Type | Target Table | Description |
| :--- | :--- | :--- | :--- |
| `update_users_updated_at` | Trigger (BEFORE UPDATE) | `users` | Calls `update_updated_at_column()` to set `updated_at` to `CURRENT_TIMESTAMP`. |
```

## Crucial Guidelines
- **Accuracy**: Ensure that the Mermaid ER diagram exactly matches the foreign key relationships defined in the SQL.
- **Completeness**: Do not skip any tables. Include intermediate join tables (like `user_roles`).
- **Idempotency**: Whenever you update the document, overwrite or intelligently update the existing sections so the file remains a single source of truth, rather than appending an endless log of changes.
