# Security Policy

## Supported Versions

We release patches and security updates for the current active release line.

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0.0 | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability or potential supply chain attack risk in `@pratikpsl/agent-skills`, please report it responsibly:

1. **Do not open a public issue** on GitHub.
2. Submit a report via [GitHub Private Vulnerability Reporting](https://github.com/pratiksinghlad/coding-skills-ai/security/advisories/new) or contact the maintainers.
3. Please include:
   - A clear description of the vulnerability.
   - Steps or proof of concept (PoC) to reproduce the issue.
   - Any potential impact on users or downstream packages.

We will acknowledge receipt of your vulnerability report within 48 hours and provide a timeline for triage and resolution.

## Supply Chain Security Practices

- **Provenance Attestation**: Packages published to the npm registry include cryptographically verifiable build provenance generated via GitHub Actions OIDC and Sigstore.
- **Dependency Minimization**: The package minimizes runtime dependencies and audits all code paths.
- **Lockfile Integrity**: Dependency installations in CI use immutable, frozen lockfiles (`bun.lock`).
- **Least-Privilege CI/CD**: GitHub Actions workflows enforce read-only token permissions by default and grant elevated permissions only when strictly required for publishing.

