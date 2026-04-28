# Gitlyze

Gitlyze is a web app that reviews public GitHub repositories and turns the results into a cleaner report.

I built it to answer a simple question: "Can I paste a repo URL and get useful code quality feedback without setting up a full local toolchain first?"

The current version focuses on JavaScript repositories. It pulls the repo tree from GitHub, downloads supported source files, runs ESLint-based checks, scores the results, and adds source-backed explanations for common issues.

## What it does

- accepts a public GitHub repository URL
- fetches the repository tree and supported source files
- analyzes JavaScript, JSX, MJS, and CJS files
- groups lint findings into a readable review
- calculates a simple quality score from errors, warnings, and issue density
- adds external references for repeated issue types
- includes Supabase auth flow for sign in and sign up

## Why it feels useful

Most code quality tools are either too raw or too noisy for a quick first pass. Gitlyze tries to sit in the middle:

- more structured than raw lint output
- lighter than a full hosted code review platform
- easier to demo on a public repo URL

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- ESLint
- Exa Search API
- Supabase Auth

## How it works

1. Parse the GitHub repository URL
2. Read the repository metadata and file tree from GitHub
3. Filter to supported source files
4. Run ESLint against downloaded file contents
5. Normalize issues into a review-friendly structure
6. Deduplicate recurring issue types
7. Fetch supporting references for common problems
8. Return a summary, score, warnings, and issue list

## Current scope

This project is intentionally narrow right now.

- JavaScript-first analysis
- public GitHub repositories only
- no local repo upload flow
- no saved review history yet

TypeScript files are detected, but they are currently reported as out of scope instead of being fully analyzed.

## Environment variables

Create a `.env.local` file in the project root:

```env
EXA_API_KEY=your_exa_api_key
GITHUB_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Notes:

- `EXA_API_KEY` powers the source-backed explanation layer
- `GITHUB_TOKEN` is optional, but helps with rate limits
- Supabase keys are required for auth

## Local development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

Build for production:

```bash
npm run build
npm run start
```

## Project structure

```text
app/
  api/analyze/route.ts      Repository analysis API route
  page.tsx                  Main interface
components/
  auth-modal.tsx            Sign in and sign up UI
  glow-card.tsx             Interactive card surface
  gitlyze-logo.tsx          Branding component
lib/
  analyzer.ts               GitHub fetch, linting, scoring, and insights
utils/supabase/
  client.ts                 Browser client
  server.ts                 Server client
middleware.ts               Session refresh
```

## What I would improve next

- TypeScript-aware analysis
- support for more languages
- pull request review mode
- saved reports
- comparison between repo revisions

## Author

Built by [ANSHUL-REAL](https://github.com/ANSHUL-REAL)
