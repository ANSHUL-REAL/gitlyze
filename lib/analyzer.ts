import js from "@eslint/js";
import { ESLint } from "eslint";

export interface RepoFile {
  path: string;
  content: string;
  size: number;
}

export interface SourceReference {
  title: string;
  url: string;
  snippet?: string;
}

export interface ReviewIssue {
  id: string;
  filePath: string;
  line: number;
  column: number;
  severity: "error" | "warning";
  ruleId: string;
  problem: string;
  query: string;
  explanation: string;
  suggestion: string;
  references: SourceReference[];
}

export interface RepoSummary {
  repo: string;
  branch: string;
  totalFiles: number;
  analyzedFiles: number;
  stack: string[];
  observations: string[];
}

export interface AnalysisResult {
  summary: RepoSummary;
  score: number;
  counts: {
    errors: number;
    warnings: number;
    issueTypes: number;
  };
  issues: ReviewIssue[];
  warnings: string[];
}

interface GitHubTreeItem {
  path: string;
  type: "blob" | "tree";
  size?: number;
  url: string;
}

const MAX_FILES = 500;
const MAX_FILE_SIZE = 180_000;
const MAX_EXA_ISSUE_TYPES = 5;
const SKIPPED_PARTS = [
  "node_modules/",
  "dist/",
  "build/",
  ".next/",
  "coverage/",
  "vendor/",
];

export function parseGitHubUrl(input: string) {
  let url: URL;

  try {
    url = new URL(input.trim());
  } catch {
    throw new Error("Enter a valid GitHub repository URL.");
  }

  if (!["github.com", "www.github.com"].includes(url.hostname.toLowerCase())) {
    throw new Error("Only github.com repository URLs are supported.");
  }

  const [owner, rawRepo] = url.pathname.split("/").filter(Boolean);
  const repo = rawRepo?.replace(/\.git$/, "");

  if (!owner || !repo) {
    throw new Error("GitHub URL must include an owner and repository name.");
  }

  return { owner, repo };
}

export async function analyzeRepository(repoUrl: string): Promise<AnalysisResult> {
  const parsed = parseGitHubUrl(repoUrl);
  const repoName = `${parsed.owner}/${parsed.repo}`;
  const warnings: string[] = [];
  const { branch, tree } = await fetchRepoTree(parsed.owner, parsed.repo);
  const jsItems = tree
    .filter((item) => item.type === "blob")
    .filter((item) => item.path.endsWith(".js") || item.path.endsWith(".jsx"))
    .filter((item) => !item.path.endsWith(".min.js"))
    .filter((item) => !SKIPPED_PARTS.some((part) => item.path.includes(part)))
    .filter((item) => (item.size ?? 0) <= MAX_FILE_SIZE)
    .slice(0, MAX_FILES);

  if (jsItems.length === 0) {
    return {
      summary: {
        repo: repoName,
        branch,
        totalFiles: tree.filter((item) => item.type === "blob").length,
        analyzedFiles: 0,
        stack: detectStack(tree.map((item) => item.path)),
        observations: ["No JavaScript files were found for the MVP analyzer."],
      },
      score: 100,
      counts: { errors: 0, warnings: 0, issueTypes: 0 },
      issues: [],
      warnings,
    };
  }

  if (tree.filter((item) => item.type === "blob").length > MAX_FILES) {
    warnings.push(`Repository has more than ${MAX_FILES} files; analyzed the first ${jsItems.length} JavaScript files.`);
  }

  const files = await fetchFiles(parsed.owner, parsed.repo, branch, jsItems);
  const lintIssues = await lintFiles(files);
  const insights = await fetchInsightsForIssues(lintIssues, warnings);
  const issues = lintIssues.map((issue, index) => {
    const insight = insights.get(issue.ruleId) ?? fallbackInsight(issue.ruleId, issue.problem);
    return {
      ...issue,
      id: `${issue.filePath}:${issue.line}:${issue.column}:${index}`,
      explanation: insight.explanation,
      suggestion: insight.suggestion,
      references: insight.references,
    };
  });

  const errors = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const issueTypes = new Set(issues.map((issue) => issue.ruleId)).size;

  return {
    summary: {
      repo: repoName,
      branch,
      totalFiles: tree.filter((item) => item.type === "blob").length,
      analyzedFiles: files.length,
      stack: detectStack(tree.map((item) => item.path)),
      observations: buildObservations(files, issues),
    },
    score: calculateScore(errors, warningCount, files.length),
    counts: { errors, warnings: warningCount, issueTypes },
    issues,
    warnings,
  };
}

async function fetchRepoTree(owner: string, repo: string) {
  const headers = githubHeaders();
  const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers,
    next: { revalidate: 120 },
  });

  if (!repoResponse.ok) {
    throw new Error(repoResponse.status === 404 ? "GitHub repository was not found." : "Could not fetch repository metadata from GitHub.");
  }

  const repoJson = await repoResponse.json();
  const branch = repoJson.default_branch as string;
  const treeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    { headers, next: { revalidate: 120 } },
  );

  if (!treeResponse.ok) {
    throw new Error("Could not fetch repository files from GitHub.");
  }

  const treeJson = await treeResponse.json();
  return { branch, tree: treeJson.tree as GitHubTreeItem[] };
}

async function fetchFiles(owner: string, repo: string, branch: string, items: GitHubTreeItem[]) {
  const files = await Promise.all(
    items.map(async (item) => {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${item.path
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`;
      const response = await fetch(rawUrl, { next: { revalidate: 120 } });

      if (!response.ok) return null;
      const content = await response.text();

      return {
        path: item.path,
        content,
        size: content.length,
      };
    }),
  );

  return files.filter((file): file is RepoFile => Boolean(file));
}

async function lintFiles(files: RepoFile[]) {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      js.configs.recommended,
      {
        languageOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
          globals: {
            Buffer: "readonly",
            clearInterval: "readonly",
            clearTimeout: "readonly",
            console: "readonly",
            document: "readonly",
            exports: "writable",
            global: "readonly",
            module: "writable",
            process: "readonly",
            require: "readonly",
            setInterval: "readonly",
            setTimeout: "readonly",
            window: "readonly",
            __dirname: "readonly",
            __filename: "readonly",
            after: "readonly",
            afterEach: "readonly",
            before: "readonly",
            beforeEach: "readonly",
            describe: "readonly",
            it: "readonly",
            suite: "readonly",
            test: "readonly",
          },
        },
        rules: {
          complexity: ["warn", 8],
          "no-console": "warn",
          "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
          "no-debugger": "error",
        },
      },
    ],
  });

  const results = await Promise.all(
    files.map((file) => eslint.lintText(file.content, { filePath: file.path })),
  );

  return results.flatMap((result, fileIndex) =>
    result[0].messages.map((message) => {
      const ruleId = message.ruleId ?? "syntax-error";
      return {
        id: "",
        filePath: files[fileIndex].path,
        line: message.line ?? 1,
        column: message.column ?? 1,
        severity: message.severity === 2 ? "error" as const : "warning" as const,
        ruleId,
        problem: message.message,
        query: buildQuery(ruleId, message.message),
        explanation: "",
        suggestion: "",
        references: [],
      };
    }),
  );
}

async function fetchInsightsForIssues(
  issues: Array<Pick<ReviewIssue, "ruleId" | "problem" | "query">>,
  warnings: string[],
) {
  const uniqueIssues = Array.from(new Map(issues.map((issue) => [issue.ruleId, issue])).values()).slice(0, MAX_EXA_ISSUE_TYPES);
  const insights = new Map<string, Pick<ReviewIssue, "explanation" | "suggestion" | "references">>();

  if (uniqueIssues.length === 0) return insights;
  if (!process.env.EXA_API_KEY) {
    warnings.push("AI reference enrichment is not configured, so insights use local fallback guidance.");
    uniqueIssues.forEach((issue) => insights.set(issue.ruleId, fallbackInsight(issue.ruleId, issue.problem)));
    return insights;
  }

  await Promise.all(
    uniqueIssues.map(async (issue) => {
      try {
        const response = await fetch("https://api.exa.ai/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.EXA_API_KEY ?? "",
          },
          body: JSON.stringify({
            query: issue.query,
            type: "deep",
            numResults: 5,
            systemPrompt:
              "You are enriching ESLint findings for a coding review tool. Prefer authoritative JavaScript, ESLint, MDN, Node.js, React, and framework documentation when relevant. Keep guidance concise and directly actionable.",
            contents: {
              text: {
                maxCharacters: 20000,
                verbosity: "compact",
              },
            },
            outputSchema: {
              type: "object",
              description: "Actionable best-practice guidance for one JavaScript static-analysis issue type.",
              required: ["explanation", "suggestedFix", "codeExample"],
              properties: {
                explanation: {
                  type: "string",
                  description: "Why this issue matters in practical JavaScript projects.",
                },
                suggestedFix: {
                  type: "string",
                  description: "A concise, behavior-preserving fix strategy.",
                },
                codeExample: {
                  type: "string",
                  description: "A compact before/after style example or corrected snippet.",
                },
              },
            },
          }),
        });

        if (!response.ok) throw new Error("Exa request failed.");
        const data = await response.json();
        const output = data.output?.content;
        const grounding = data.output?.grounding ?? [];
        const citations = grounding.flatMap((entry: any) => entry.citations ?? []);
        const references: SourceReference[] = dedupeReferences([
          ...citations.map((citation: any) => ({
            title: citation.title ?? citation.url,
            url: citation.url,
          })),
          ...(data.results ?? []).map((result: any) => ({
            title: result.title ?? result.url,
            url: result.url,
            snippet: result.text?.slice(0, 180),
          })),
        ]).slice(0, 4);

        insights.set(issue.ruleId, {
          explanation:
            typeof output?.explanation === "string"
              ? output.explanation
              : buildExplanation(issue.ruleId, references),
          suggestion:
            typeof output?.suggestedFix === "string"
              ? `${output.suggestedFix}${typeof output?.codeExample === "string" ? ` Example: ${output.codeExample}` : ""}`
              : buildSuggestion(issue.ruleId, issue.problem),
          references,
        });
      } catch {
        warnings.push(`AI reference lookup failed for ${issue.ruleId}; used fallback guidance.`);
        insights.set(issue.ruleId, fallbackInsight(issue.ruleId, issue.problem));
      }
    }),
  );

  return insights;
}

function dedupeReferences(references: SourceReference[]) {
  const seen = new Set<string>();
  return references.filter((reference) => {
    if (!reference.url || seen.has(reference.url)) return false;
    seen.add(reference.url);
    return true;
  });
}

function githubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "CodeLens-AI",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

function buildQuery(ruleId: string, message: string) {
  return `JavaScript ESLint ${ruleId} best practices ${message}`;
}

function buildExplanation(ruleId: string, references: SourceReference[]) {
  if (references.length === 0) {
    return fallbackInsight(ruleId, "").explanation;
  }

  return `This ${ruleId} issue maps to common JavaScript maintainability guidance from the references below. Review the pattern, then apply the smallest local fix that preserves behavior.`;
}

function buildSuggestion(ruleId: string, problem: string) {
  if (ruleId === "no-unused-vars") return "Remove the unused binding or use it intentionally. Prefix intentionally unused arguments with an underscore.";
  if (ruleId === "no-undef") return "Declare the variable, import it, or reference it through the correct scope.";
  if (ruleId === "no-console") return "Replace console output with structured logging or remove it before production.";
  if (ruleId === "complexity") return "Split the branch-heavy function into smaller named helpers with one responsibility each.";
  if (ruleId === "syntax-error") return "Fix the syntax at the reported line before reviewing deeper quality issues.";
  return `Address the ESLint warning: ${problem}`;
}

function fallbackInsight(ruleId: string, problem: string) {
  return {
    explanation: `${ruleId} points to code that may be harder to maintain, test, or ship safely. Static analysis caught it without needing an AI model.`,
    suggestion: buildSuggestion(ruleId, problem),
    references: [],
  };
}

function calculateScore(errors: number, warnings: number, analyzedFiles: number) {
  const errorPenalty = Math.min(55, errors * 5);
  const warningPenalty = Math.min(30, warnings);
  const densityPenalty = analyzedFiles > 0 ? Math.min(15, Math.round(((errors + warnings) / analyzedFiles) * 3)) : 0;
  return Math.max(0, 100 - errorPenalty - warningPenalty - densityPenalty);
}

function detectStack(paths: string[]) {
  const stack = new Set<string>();
  if (paths.includes("package.json")) stack.add("Node.js");
  if (paths.some((path) => path.includes("next.config"))) stack.add("Next.js");
  if (paths.some((path) => path.includes("vite.config"))) stack.add("Vite");
  if (paths.some((path) => path.endsWith(".jsx"))) stack.add("React");
  if (paths.some((path) => path.includes("tailwind.config"))) stack.add("Tailwind CSS");
  return Array.from(stack);
}

function buildObservations(files: RepoFile[], issues: ReviewIssue[]) {
  const observations = [`Analyzed ${files.length} JavaScript files with ESLint.`];
  const topRule = topIssueRule(issues);

  if (topRule) observations.push(`Most frequent issue type: ${topRule}.`);
  if (issues.length === 0) observations.push("No ESLint issues were found in the analyzed files.");
  if (issues.length > 0) observations.push("AI-powered source guidance is attached by issue type to keep analysis fast.");

  return observations;
}

function topIssueRule(issues: ReviewIssue[]) {
  const counts = new Map<string, number>();
  issues.forEach((issue) => counts.set(issue.ruleId, (counts.get(issue.ruleId) ?? 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
}
