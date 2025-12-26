# Contributing to Night City OS

We love your input! We want to make contributing to Night City OS as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Use [Github Flow](https://guides.github.com/introduction/flow/), So All Code Changes Happen Through Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License
In short, when you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project.

## Development workflow
- **Tooling**: Use Node.js 20+. Install dependencies with `npm install`.
- **Quality gates**: Run `npm run lint`, `npm run test -- --run`, and `npm run build` before submitting a PR.
- **Formatting**: Prettier enforces spacing and style; run `npm run format` for quick cleanups.
- **Security**: Never commit API keys or secrets. Validate new inputs through `src/utils/validation.js` and add tests under `tests/unit/`.
- **Audio**: `useSound` is covered by `tests/unit/useSound.test.js`; keep gesture unlock logic intact and add tones via the hook rather than ad-hoc oscillators.
- **Docs**: Every feature change should update README, ARCHITECTURE, SECURITY, and the engineering notes in Agent.md.

## Report bugs using Github's [issues](https://github.com/Raoof128/night_city_os/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](); it's that easy!

## Write bug reports with detail, background, and sample code
**Great Bug Reports** tend to has:
- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happened
- Notes (possibly including why you think this eventually happened, or logging)

## License
By contributing, you agree that your contributions will be licensed under its MIT License.
