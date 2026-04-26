# Gitlyze

Gitlyze is a web-based code review tool for public GitHub repositories. It combines static analysis, quality scoring, and source-backed best-practice insights to help developers understand code quality quickly.

## Overview

Paste a public GitHub repository URL and Gitlyze will fetch the repository structure, analyze JavaScript files, surface issues, and present a structured review with actionable suggestions.

The goal is simple: make code review feedback feel clear, practical, and senior-engineer level without requiring expensive AI model APIs.

## Features

- Public GitHub repository input
- JavaScript and JSX file analysis
- ESLint-powered static analysis
- Quality score from errors, warnings, and issue density
- Repo summary with file counts, branch, stack hints, and observations
- Issue cards with severity, file location, explanation, suggested fix, and references
- Source-backed insight enrichment using Exa
- Supabase-ready sign in and sign up modal
- Premium interactive UI with cursor effects, glow cards, and scroll preview
- Contact modal with email and LinkedIn links

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- ESLint
- Exa Search API
- Supabase Auth
- Motion
- Lucide React

## How It Works

1. User enters a public GitHub repository URL.
2. Gitlyze parses the owner and repository name.
3. The backend fetches the repository tree from GitHub.
4. JavaScript and JSX files are downloaded and filtered.
5. ESLint runs against the fetched source code.
6. Issues are normalized by file, line, severity, and rule.
7. Repeated issue types are deduplicated for insight lookup.
8. Exa enriches issue types with best-practice explanations and references.
9. Gitlyze returns a quality score, repo summary, and structured issue list.

## Environment Variables

Create a `.env.local` file in the project root.

```env
EXA_API_KEY=your_exa_api_key
GITHUB_TOKEN=

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### Notes

- `EXA_API_KEY` is used for source-backed insight enrichment.
- `GITHUB_TOKEN` is optional, but it can improve GitHub API rate limits.
- Supabase values are required for sign in and sign up.
- `.env.local` is ignored by Git and should not be committed.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://127.0.0.1:3000
```

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

## Supabase Setup

1. Create a Supabase project.
2. Enable Email/Password authentication.
3. Copy the project URL and publishable key.
4. Add them to `.env.local`.
5. Restart the dev server.

The app uses Supabase SSR helpers and middleware to keep sessions refreshed.

## Project Structure

```text
app/
  api/analyze/route.ts      API route for repository analysis
  page.tsx                  Main Gitlyze interface
components/
  auth-modal.tsx            Sign in and sign up modal
  glow-card.tsx             Interactive glow card surface
  footer.tsx                Footer and social links
  gitlyze-logo.tsx          Custom Gitlyze logo and wordmark
lib/
  analyzer.ts               GitHub fetch, ESLint, scoring, and insight logic
utils/supabase/
  client.ts                 Browser Supabase client
  server.ts                 Server Supabase client
  middleware.ts             Session refresh helper
middleware.ts               Next.js middleware for Supabase sessions
```

## Current Scope

Gitlyze currently focuses on JavaScript and JSX repositories. It is designed as an MVP and can be extended later with:

- TypeScript analysis
- Multi-language support
- Pull request comments
- Saved review history
- Team workspaces
- Exportable reports
- More advanced rule configuration

## Author

Built by [ANSHUL-REAL](https://github.com/ANSHUL-REAL).
