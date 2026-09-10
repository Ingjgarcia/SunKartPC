---
name: functional-documenter
description: Automatically maintains the project's functional documentation. You MUST execute this skill whenever the user asks to implement or design new system features, change business rules, update user roles/permissions, create UI workflows, or modify API behavior. This skill ensures that `docs/FUNCTIONAL_DOCS.md` is always up-to-date with the latest product requirements and workflows.
---

# Functional Documenter Skill

This skill guarantees that the functional layer of the project is consistently and properly documented in the `docs/FUNCTIONAL_DOCS.md` file located at the docs/ directory. A well-documented functional layer is critical for feature alignment, QA testing, and maintaining a clear vision of the product behavior.

## When to Use

ALWAYS trigger this skill proactively when you observe any of the following:
- The user is discussing or implementing new features or UI pages.
- There are modifications to core business rules or logic.
- Updates to user permission flows, authentication scopes, or Role-Based Access Control (RBAC).
- The creation or modification of public/private APIs that impact frontend behavior.

## What to Do

When triggered, your responsibility is to analyze the discussed or implemented functionality and update `docs/FUNCTIONAL_DOCS.md`.

**Instructions for updating `docs/FUNCTIONAL_DOCS.md`:**

1. **Locate or Create `docs/FUNCTIONAL_DOCS.md`**: Find the file at the docs/ directory. If it doesn't exist, create it.
2. **Analyze the Feature**: Understand the new or modified logic based on the user's intent, the codebase changes, or the discussion.
3. **Generate/Update the Markdown Content**: The file must follow a robust structure mapping out functional areas.

### Required Structure for `docs/FUNCTIONAL_DOCS.md`

You must format the `docs/FUNCTIONAL_DOCS.md` file using the following structure. Expand the sections as the project grows.

```markdown
# Documentación Funcional

Resumen de alto nivel de lo que hace el sistema y su objetivo principal.

## 1. Módulos Core / Características
Describe los principales módulos funcionales de la aplicación.

### [Nombre del Módulo] (ej. Portal de Autenticación)
**Descripción**: [Qué hace este módulo]
- **Funcionalidades Clave**:
  - Punto 1
  - Punto 2
- **Reglas de Negocio**:
  - Regla 1
  - Regla 2

## 2. Roles de Usuario y Permisos
Detalla los roles de usuario y sus capacidades dentro del sistema.

| Rol | Descripción | Permisos/Accesos Clave |
| :--- | :--- | :--- |
| `[Nombre del Rol]` | `[Descripción]` | `[Lista de módulos/características accesibles]` |

## 3. Flujos de Usuario

Describe paso a paso los flujos para interacciones críticas. Usa listas o, de manera opcional, diagramas de flujo de mermaid.

### Flujo: [Nombre del Flujo] (ej. Single Sign-On de la Aplicación)
1. El usuario navega a la URL raíz del portal.
2. El usuario introduce su correo y contraseña.
3. El sistema valida las credenciales contra la tabla `users` en la base de datos.
4. Si es exitoso, el sistema recupera los roles del usuario y las aplicaciones asignadas.
5. El usuario es redirigido a su panel personalizado que contiene solo las aplicaciones accesibles.
```

## Crucial Guidelines
- **Idioma Español**: Todo el documento `docs/FUNCTIONAL_DOCS.md`, incluyendo los títulos, descripciones y notas, **DEBE redactarse estrictamente en español**.
- **Idempotency**: Whenever you update the document, intelligently edit existing sections or add new ones to maintain a clean "source of truth". Avoid just appending an unstructured list of changes at the bottom.
- **Clarity over Technical Details**: Focus on *what* the system does and *why* (Business rule), not *how* the code executes it (Implementation details belong in technical docs or code comments).
- **Format**: Use clear headers, bullet points, and tables. Make it readable for product managers, QAs, and external stakeholders.
