# Gamkers Website

The Gamkers website is a React and TypeScript single-page application built with Vite. It presents Gamkers' cybersecurity community, courses, workshops, leadership, and product pages for GhostChip and Phantom32.

> **Private project:** This repository is not open source. Access to the source is restricted by the repository's GitHub settings and the terms in [LICENSE.md](./LICENSE.md). Do not publish, mirror, or share the source without written authorization.

## Contents

- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Local setup](#local-setup)
- [Available commands](#available-commands)
- [Application configuration](#application-configuration)
- [Making changes](#making-changes)
- [Build and deployment](#build-and-deployment)
- [Troubleshooting](#troubleshooting)
- [Related guidance](#related-guidance)

## Project structure

The repository root is the website project:

```text
.
├── public/                 # Static files copied into the production build
├── src/
│   ├── components/         # Page sections, product pages, and UI components
│   ├── data/               # Static content such as course entries
│   ├── hooks/              # Shared React hooks
│   ├── lib/                # Integrations and utilities (including Supabase)
│   ├── types/              # TypeScript types
│   ├── App.tsx             # Page composition and hash-based navigation
│   ├── index.css           # Global styles
│   └── main.tsx            # Browser entry point
├── ctf/ai-ctf/              # Separate CTF application; see its own README
├── index.html              # HTML shell and external animation scripts
├── package.json            # Dependencies and npm scripts
└── vite.config.ts          # Vite configuration and build output settings
```

The website's root-level development and build commands do not start or configure the separate application under `ctf/ai-ctf/`.

## Requirements

- Node.js 18 or newer (Node.js 20 LTS is recommended)
- npm, included with Node.js
- Git, if cloning the private repository

Check your installed versions:

```sh
node --version
npm --version
```

## Local setup

1. Make sure your GitHub account has been granted access to the private repository.
2. Clone the repository using the approved GitHub URL and enter its root directory:

   ```sh
   git clone <approved-repository-url>
   cd gamkers_website
   ```

3. Install the exact dependency versions recorded in the lockfile:

   ```sh
   npm ci
   ```

4. Start the Vite development server:

   ```sh
   npm run dev
   ```

5. Open the local URL printed by Vite in your browser (usually `http://localhost:5173`).

Vite serves the app with hot module replacement, so most source changes appear in the browser as you save them. Stop the server with `Ctrl+C`.

## Available commands

Run these commands from the repository root:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite development server. |
| `npm run build` | Run the TypeScript project build and create the production site in `build/`. |
| `npm run preview` | Serve the most recently built site locally for production-build checks. Run `npm run build` first. |
| `npm run lint` | Run ESLint across the project. |
| `npm run deploy` | Build and publish the `build/` directory to the configured `gh-pages` branch. Use only with deployment authorization and the intended repository configuration. |

Before handing off a change, run:

```sh
npm run lint
npm run build
```

The Vite application uses `npm run dev`; `npm start` is not the documented development command.

## Application configuration

### Supabase and workshops

The Workshops section uses Supabase to read active and completed workshop records and to submit registrations and feedback. The client is configured in [`src/lib/supabase.ts`](./src/lib/supabase.ts), and the UI uses the `completed_workshops`, `upcoming_workshops`, `workshop_registrations`, and `workshop_feedback` tables.

To work with live workshop data, use an authorized Supabase project and ensure its schema and Row Level Security (RLS) policies support the operations the site needs. The current website client configuration is in source code; coordinate any configuration changes with the project owner. Never put a Supabase `service_role` key, database password, or other privileged secret in browser code. A Vite client variable (one prefixed with `VITE_`) is bundled into public browser assets and must not be treated as secret. Do not commit credentials or production data.

The website can be developed independently of the CTF application's backend. The CTF has separate setup and configuration requirements; follow its own [README](./ctf/ai-ctf/README.md) only if you are authorized to work on that component.

### External assets and scripts

The HTML shell loads third-party scripts from CDNs, and the site also references external image and service URLs. A working network connection may be needed for those resources. Review external dependencies and their applicable terms before changing or redistributing them.

## Making changes

- Page sections and product details live primarily in `src/components/`.
- Static course information is in `src/data/courses.ts`.
- Shared visual styles are in `src/index.css` and `src/App.css`; Tailwind is configured at the repository root.
- The Vite alias `@/` points to `src/`.
- Product subpages are selected using URL hashes (`#ghostchip` and `#phantom32`).
- Keep content, links, and claims accurate. Do not add credentials, private user data, or unapproved third-party material.

For contribution requirements, validation, and review expectations, read [CONTRIBUTING.md](./CONTRIBUTING.md).

## Build and deployment

Create and locally inspect a production build:

```sh
npm run build
npm run preview
```

The production files are written to `build/` (not Vite's default `dist/`). The current Vite `base` is `/`, so the build is configured for deployment at a domain root. Hosting under a URL subpath requires an intentional `base` configuration change and a fresh build.

The optional `npm run deploy` command publishes through `gh-pages`. Do not run it unless you are authorized to deploy, have verified the selected Git remote and target branch, and intend to publish the built site. A private source repository does not make a deployed website private; configure hosting access separately if the site itself must be restricted.

## Troubleshooting

- **`npm ci` fails:** Confirm Node.js is version 18 or newer, use the repository's `package-lock.json`, and check that your network and package registry access are available.
- **Vite command is missing:** Run `npm ci` from the repository root, then retry `npm run dev`.
- **TypeScript or build errors:** Run `npm run build` and address the first reported error before deploying.
- **Workshop data is empty or submissions fail:** Check browser developer tools for network errors, confirm Supabase connectivity and table access, and have an authorized project maintainer verify the schema and RLS policies.
- **CDN visuals are missing:** Check network access to the external script and asset hosts; the page may render without those third-party resources.
- **Deep links fail after deployment:** Configure the static host to serve `index.html` for the app's client-side routes, and confirm the deployment path matches Vite's `base` setting.

## Related guidance

- [Contribution guidelines](./CONTRIBUTING.md)
- [Private project license](./LICENSE.md)
- [CTF application README](./ctf/ai-ctf/README.md)
