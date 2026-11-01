# Contributing

This is a private, proprietary project. Repository access and permission to contribute are limited to people explicitly authorized by the project owner. These guidelines do not grant repository access or any license beyond [LICENSE.md](./LICENSE.md). Do not send source code, screenshots containing private information, credentials, or unpublished project details to unauthorized people or services.

## Before you begin

1. Confirm that your GitHub account has been granted repository access.
2. For work that is not already assigned, discuss the proposed change with the project owner before starting.
3. Check the existing implementation and documentation so changes follow established behavior and avoid unnecessary duplication.

## Development workflow

1. Create a focused branch from the current target branch. Use a descriptive name, for example `fix/workshop-empty-state` or `docs/setup-guide`.
2. Install dependencies from the repository root with `npm ci`.
3. Run the website locally with `npm run dev`.
4. Keep each change focused on its intended behavior. Preserve the existing React, TypeScript, and Vite conventions.
5. Before requesting review, run:

   ```sh
   npm run lint
   npm run build
   ```

6. Manually check the affected page or interaction in a browser. Include responsive behavior and browser-console/network errors where relevant.
7. Open a pull request against the agreed target branch and describe the change, how it was validated, and any relevant limitations or follow-up work.

Do not deploy as part of routine development. Deployment requires separate authorization.

## Code and content expectations

- Use TypeScript types and existing shared components or helpers where practical.
- Keep changes accessible and responsive; respect reduced-motion preferences when changing animation behavior.
- Keep links, external assets, product details, prices, and other public-facing content accurate and approved.
- Handle loading, empty, and error states deliberately when changing data-backed UI.
- Avoid adding dependencies unless they are needed and approved; update the lockfile when dependencies change.
- Never commit credentials, private keys, tokens, database exports, personal data, build output, or local environment files.
- Treat all client-side configuration as public: values used by the browser must not include privileged credentials.
- Do not add third-party content or assets unless their rights and applicable terms have been checked.

## Pull request checklist

- [ ] The change is focused and its behavior is described.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Affected behavior was checked in a browser where applicable.
- [ ] No secrets, private data, or unapproved content were added.
- [ ] Documentation was updated when setup, behavior, or maintenance guidance changed.
- [ ] Deployment has not been triggered without explicit authorization.

The root-level npm scripts apply to the Vite website. Work in `ctf/ai-ctf/` is a separate component and must follow its own documentation and authorization requirements.
