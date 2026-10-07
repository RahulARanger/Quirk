# AGENTS.md

## Project context

This repository is a downstream academic and research adaptation of
[Strilanc/Quirk](https://github.com/Strilanc/Quirk). Work here is performed on
top of the existing upstream project so that it can be modified to meet the
requirements of this project.

This is not the official upstream Quirk repository. Preserve the upstream
copyright notices, attribution, Apache License, and project history when
making changes. Do not describe downstream changes as official upstream work.

This project is maintained solely for academic and research purposes. Do not
treat it as production, commercial, operational, or safety-critical software.

## Before changing code

- Read `README.md`, `CONTRIBUTING.md`, and this file before making project-wide
  changes.
- Keep changes focused on the current academic or research requirement.
- Prefer extending existing Quirk behavior and conventions over rewriting
  unrelated upstream code.
- Keep documentation and tests aligned with behavior changes.
- Do not commit credentials, private data, generated build output, or local
  machine configuration.

## Development and verification

The project uses Node.js, npm, and Grunt. From the repository root:

```bash
npm install
npm test
npm run build
npm run build:open
```

`npm run build:open` builds `out/quirk.html`, opens it in the default browser,
and exits without starting a persistent development server.

When a change affects browser behavior, also run the applicable browser test
command (`npm run test-chrome` or `npm run test-firefox`) when the required
browser is available. Confirm that the generated `out/quirk.html` opens after
building.

## GitHub workflow

- Create a focused branch for each change.
- Use a pull request for review and explain the research or academic purpose
  of the change.
- Summarize user-visible behavior changes and list the verification commands
  that were run.
- Keep the pull request limited to this downstream project; do not submit
  unrelated changes to the upstream repository.
- Retain attribution to the upstream repository in documentation and in any
  redistributed derivative work.
- Use the pull-request checklist in `.github/pull_request_template.md`.
