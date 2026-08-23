# CI workflows

The three workflow files in `ci/workflows/` belong in `.github/workflows/`. They live here because
the integration that pushed this repo has no `workflow` OAuth scope, and GitHub refuses writes to
`.github/workflows/` without it.

Install them locally:

```bash
mkdir -p .github/workflows
cp -r ci/workflows/. .github/workflows/
git add .github/workflows
git commit -m "ci: install workflows"
git push
```

Or in the GitHub web UI: Add file, Create new file, path `.github/workflows/ci.yml`, paste the
contents, commit. Repeat for `release.yml` and `pages.yml`.

## What each one does

| File | Trigger | What it gates |
| --- | --- | --- |
| `ci.yml` | push and pull request | `tokens:validate`, `tokens:build` with a stale-artifact check, `tokens:contrast`, `lint:tokens`, `typecheck`, web build, Storybook build with the a11y addon in error mode, and a changeset-present check on pull requests |
| `release.yml` | push to `main` | Changesets opens a version pull request, then publishes on merge |
| `pages.yml` | push to `main` | Builds the docs site with Storybook mounted at `/storybook/` and deploys to GitHub Pages |

All three run `bun install --frozen-lockfile`, so `bun.lock` must stay committed.

Two repository settings are needed once the workflows are in place:

1. Settings, Pages, Source: GitHub Actions.
2. Settings, Actions, General, Workflow permissions: read and write, and allow Actions to create
   pull requests. The release workflow opens the version pull request.
