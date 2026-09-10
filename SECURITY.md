# Security Policy

## Supported versions

This is a template. Security fixes land on the latest release only.

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅        |
| < 1.0   | ❌        |

## Scope

`fuxsto-design-admin-demo` is a **front-end only** template. It ships no server, no database and no
real endpoints — every list and form is backed by in-repo mock data (`src/mock/data.ts`).

The realistic risk surface is therefore:

- **Committed secrets** — an `.env` file, an npm token or an API key accidentally added to the repo.
  `.gitignore` blocks `.env*`; `.env.example` is the only env file that should ever be committed.
- **Cross-site scripting** — rendering unsanitised user input with `v-html`.
  Prefer interpolation (`{{ }}`); avoid `v-html` on anything user-supplied.
- **Vulnerable dependencies** — transitive advisories in Vue / Vite / Tailwind / lucide.

Out of scope: anything requiring a compromised browser, a malicious browser extension, or
physical access to the device.

## Reporting a vulnerability

**Please do not open a public issue.**

Report privately via either:

1. GitHub's [private vulnerability reporting](https://github.com/fuxsto/fuxsto-design-admin-demo/security/advisories/new), or
2. email **fuxsto@foxmail.com**.

Please include: a description, reproduction steps, the affected route or file, and the
impact you believe it has.

## What to expect

| Stage | Target |
|-------|--------|
| Acknowledgement | within 3 business days |
| Initial assessment | within 7 business days |
| Fix or mitigation for a confirmed high-severity issue | as soon as practical |

We will credit you in the release notes unless you ask us not to.
