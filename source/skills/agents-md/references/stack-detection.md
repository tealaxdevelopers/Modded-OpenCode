# Stack detection — per-ecosystem manifest reads

How to fill the Project Matrix `Stack` cell per ecosystem. The binding rule lives in `SKILL.md`: the cell is fact read from the app-root manifest and lockfiles — never guessed.

- **Find the real app root** — often nested (`application/`, `app/`, `src/`); read the manifest there and note the dir.
- **PHP** — `composer.json`: version from `require.php`, frameworks from `require`; CodeIgniter version from `system/core/CodeIgniter.php` `CI_VERSION`. A Livewire app must say Livewire.
- **Frontend build** — list `Vite`/`Tailwind` only when `vite`/`laravel-vite-plugin`/`tailwindcss` are in the app's own `package.json` deps; Laravel never implies one.
- **JS / TS** — `package.json`: runtime + version; `TypeScript` when a `typescript` dep or `tsconfig.json` exists; package manager from the lockfile (`package-lock.json` → npm, `yarn.lock` → yarn, `pnpm-lock.yaml` → pnpm).
- **Python** — framework from `requirements.txt` / `pyproject.toml`; version from `Dockerfile` `FROM python:X.Y`, `.python-version`, or `requires-python`.
- **A test runner is not the stack**; name one only when there is no app framework.
- **Non-app folders** — `"type": "library"` in `composer.json` (or no app framework) means a package, noted `VCS, branch <name>` when branch-installed; raw SQL/migration folders are "<engine> / raw SQL migrations"; the `.`-path folder is a meta workspace, not a code stack.
