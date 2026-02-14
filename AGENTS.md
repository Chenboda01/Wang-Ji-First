# AGENTS.md

Repository scope: `/home/bodachen/Wang-Ji-First/Wang-Ji-First`

Purpose: guidance for coding agents working in this repository.

## 1) Current Repository Facts

- The repo currently contains only `README.md` plus git metadata.
- No `package.json`, `pyproject.toml`, `Makefile`, CI config, or test directories were found.
- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` files were found.
- The project description in the parent README indicates a TODO list web app (HTML/CSS/JS).

## 2) Build, Lint, and Test Commands

Because no tooling files exist yet, there are no project-native commands to run.

### 2.1 Build

- Build command: not configured.
- Production bundling: not configured.
- Dev server: not configured.

If the project stays static HTML/CSS/JS, use a simple local server:

- `python3 -m http.server 8000`
- Open `http://localhost:8000` in a browser.

### 2.2 Lint / Format

- Lint command: not configured.
- Formatter command: not configured.

Recommended future defaults (once Node tooling is added):

- Lint all: `npm run lint`
- Format all: `npm run format`
- Check format only: `npm run format:check`

### 2.3 Test

- Test suite command: not configured.
- Single test command: unavailable (no test runner configured).

Recommended future defaults (if using Vitest):

- Run all tests: `npm test`
- Run watch mode: `npm test -- --watch`
- Run a single file: `npm test -- tests/todo.spec.js`
- Run a single test name: `npm test -- -t "adds new item"`

Recommended future defaults (if using Jest):

- Run all tests: `npm test`
- Run a single file: `npm test -- tests/todo.spec.js`
- Run a single test name: `npm test -- -t "adds new item"`

### 2.4 Agent behavior when commands are missing

- Do not invent a passing CI status.
- State clearly when a command cannot run because tooling is absent.
- Prefer adding minimal scripts in `package.json` when introducing tooling.
- Document any new command in `README.md` and this file.

## 3) Source Layout Conventions (Expected)

Until structure exists, prefer this simple layout:

- `index.html` as entrypoint.
- `styles/` for CSS (e.g., `styles/main.css`).
- `scripts/` for JS modules (e.g., `scripts/app.js`).
- `assets/` for images/icons/backgrounds.
- `tests/` for unit/integration tests once added.

## 4) Code Style Guidelines

These conventions should be followed for all future code.

### 4.1 General

- Keep code readable over clever.
- Prefer small, single-purpose functions.
- Avoid global mutable state when possible.
- Remove dead code rather than commenting it out.
- Keep files focused; split when a file grows too large.

### 4.2 JavaScript

- Use modern ES modules (`import` / `export`).
- Prefer `const`; use `let` only when reassignment is required.
- Avoid `var`.
- Use strict equality (`===`, `!==`).
- Use early returns to reduce nesting.
- Handle null/undefined explicitly.
- Prefer array iteration methods (`map`, `filter`, `find`) when clearer.
- Keep DOM selectors centralized to avoid duplication.

### 4.3 Types

- If TypeScript is introduced, enable strict mode.
- Do not use `any` unless justified with a comment.
- Model TODO items with explicit types/interfaces.
- Keep function input/output types explicit at boundaries.

### 4.4 Imports

- Order imports: built-ins, third-party, internal, then relative.
- Group each category with one blank line between groups.
- Avoid deep relative paths when aliases can be configured.
- Remove unused imports.

### 4.5 Naming

- Variables/functions: `camelCase`.
- Classes/types: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- File names: use one convention consistently (`kebab-case` preferred).
- Event handler names should describe intent (`handleAddItemClick`).

### 4.6 Formatting

- Use 2-space indentation in HTML/CSS/JS.
- Use semicolons consistently (prefer enabled).
- Prefer single quotes in JS unless escaping is worse.
- Keep max line length around 100 chars.
- Ensure trailing newline at end of files.

### 4.7 HTML

- Use semantic elements (`main`, `section`, `button`, `label`).
- Ensure form controls have associated labels.
- Use `button` elements for actions (not clickable `div`).
- Keep ARIA usage minimal and correct; prefer native semantics first.

### 4.8 CSS

- Use CSS custom properties for theme tokens.
- Prefer class selectors over IDs for styling.
- Keep specificity low and predictable.
- Co-locate related rules and avoid duplicates.
- Design for responsive behavior from the start.

### 4.9 Error Handling

- Never silently swallow errors.
- Catch only where recovery or user feedback is possible.
- Show user-friendly UI messages for recoverable failures.
- Log technical details to console in development.
- Validate user input before state updates.

### 4.10 Testing Guidelines (when added)

- Test behavior, not implementation details.
- One assertion theme per test case.
- Use descriptive test names (`it('marks item complete')`).
- Cover core TODO flows: add, complete, delete, persistence.
- Add regression tests for bug fixes.

## 5) Git and PR Conventions

- Make focused commits with a single concern.
- Use imperative commit subjects (e.g., `Add item completion toggle`).
- Include why in commit body when non-obvious.
- Do not commit secrets or local environment artifacts.
- Update docs when behavior or commands change.

## 6) Cursor/Copilot Rule Status

Checked locations and status:

- `.cursor/rules/`: not present.
- `.cursorrules`: not present.
- `.github/copilot-instructions.md`: not present.

If these files are added later, agents must merge their instructions into this guide and treat them as higher-priority repo policy.

## 7) Minimal Setup Recommendation

When initializing tooling, prefer:

- `npm init -y`
- Add scripts: `lint`, `format`, `test`, `test:watch`.
- Add ESLint + Prettier.
- Add Vitest + jsdom for DOM tests.
- Add CI to run lint + test on pull requests.

Keep this document updated whenever tooling or conventions change.
