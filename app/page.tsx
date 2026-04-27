"use client";

import { FormEvent, useRef, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Github, Linkedin, Loader2, Mail, Sparkles, X } from "lucide-react";
import { AuthModal, AuthStatusButton, useAuthUser } from "@/components/auth-modal";
import { ContainerScroll } from "@/components/container-scroll";
import DotPattern from "@/components/dot-pattern";
import { Footer } from "@/components/footer";
import { GitlyzeLogo } from "@/components/gitlyze-logo";
import { GlowCard } from "@/components/glow-card";
import TextCursorProximity from "@/components/text-cursor-proximity";

interface SourceReference {
  title: string;
  url: string;
  snippet?: string;
}

interface ReviewIssue {
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

interface AnalysisResult {
  summary: {
    repo: string;
    branch: string;
    totalFiles: number;
    analyzedFiles: number;
    stack: string[];
    observations: string[];
  };
  score: number;
  counts: {
    errors: number;
    warnings: number;
    issueTypes: number;
  };
  issues: ReviewIssue[];
  warnings: string[];
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const user = useAuthUser();

  const analyze = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Analysis failed.");
      }

      setResult(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section ref={heroRef} className="relative isolate min-h-[92vh] px-4 py-6 sm:px-6 lg:px-8">
        <DotPattern className="opacity-25 [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
          <GitlyzeLogo showWordmark />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent/50 hover:bg-accent/15"
            >
              Contact
            </button>
            <AuthStatusButton user={user} onOpen={() => setIsAuthOpen(true)} />
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-panel/80 px-4 py-2 text-sm text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
            >
              <Github className="size-4" />
              Public repos
            </a>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 pt-20 lg:grid-cols-[1fr_440px] lg:pt-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm text-accent">
              <Sparkles className="size-4" />
              Static analysis + real-world insights (no expensive AI required)
            </div>
            <h1 className="max-w-5xl text-balance text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
              <TextCursorProximity
                label="Review code like a senior engineer - instantly."
                containerRef={heroRef}
                radius={160}
                falloff="gaussian"
                className="inline"
                styles={{
                  color: { from: "hsl(var(--foreground))", to: "hsl(var(--accent))" },
                  scale: { from: 1, to: 1.08 },
                  fontWeight: { from: 850, to: 950 },
                }}
              />
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Paste any public GitHub repo and get a structured review: issues, risks, quality score, and real-world best practices.
            </p>

            <form
              onSubmit={analyze}
              className="mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-panel/80 p-3 shadow-glow backdrop-blur sm:flex-row"
            >
              <label className="sr-only" htmlFor="repo-url">
                GitHub repository URL
              </label>
              <input
                id="repo-url"
                value={repoUrl}
                onChange={(event) => setRepoUrl(event.target.value)}
                placeholder="https://github.com/username/repository"
                className="min-h-12 flex-1 rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-bold text-accent-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
                Analyze Repository
                {!isLoading ? <ArrowRight className="size-4" /> : null}
              </button>
            </form>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              No API keys. No setup. Just paste and analyze.
            </p>

            {error && (
              <div className="mt-4 flex max-w-3xl items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                <AlertCircle className="size-4" />
                {error}
              </div>
            )}
          </div>

          <GlowCard customSize glowColor="green" className="rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Live Analysis Preview</span>
              <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                Live
              </span>
            </div>
            <div className="mt-7 grid grid-cols-3 gap-3">
              <Metric label="Quality Score" value={result ? `${result.score}` : "--"} />
              <Metric label="Critical Issues" value={result ? `${result.counts.errors}` : "--"} />
              <Metric label="Warnings" value={result ? `${result.counts.warnings}` : "--"} />
            </div>
            <div className="mt-6 space-y-3">
              {[
                "Fetch repository structure",
                "Analyze code patterns (ESLint)",
                "Attach best-practice insights",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-border bg-background/70 p-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </section>

      <ContainerScroll
        titleComponent={
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="mt-3 text-balance text-4xl font-black tracking-normal text-foreground md:text-6xl">
              See your code through a reviewer&apos;s lens.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every issue is explained, prioritized, and paired with actionable fixes - not just warnings.
            </p>
          </div>
        }
      >
        <div className="grid h-full gap-4 overflow-auto p-4 md:grid-cols-[280px_1fr]">
          <div className="space-y-4">
            <GlowCard customSize glowColor="blue" className="min-h-40 rounded-2xl">
              <p className="text-xs font-bold uppercase text-accent">Score</p>
              <div className="mt-4 text-6xl font-black">{result ? result.score : "--"}</div>
              <p className="mt-2 text-sm text-muted-foreground">Quality score updates after analysis.</p>
            </GlowCard>
            <GlowCard customSize glowColor="purple" className="min-h-40 rounded-2xl">
              <p className="text-xs font-bold uppercase text-accent">Signals</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <span className="rounded-xl bg-background/70 p-3">{result ? result.counts.errors : "--"} errors</span>
                <span className="rounded-xl bg-background/70 p-3">{result ? result.counts.warnings : "--"} warnings</span>
              </div>
            </GlowCard>
          </div>
          <GlowCard customSize glowColor="green" className="min-h-full rounded-2xl">
            <p className="text-xs font-bold uppercase text-accent">Finding preview</p>
            <div className="mt-5 space-y-4">
              {!result && (
                <div className="rounded-2xl border border-border bg-background/65 p-5">
                  <h3 className="font-bold">Run an analysis to preview findings.</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    This panel will show real issues from the repository you submit.
                  </p>
                </div>
              )}

              {result?.issues.slice(0, 4).map((issue) => (
                <div key={issue.id} className="rounded-2xl border border-border bg-background/65 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-100">
                      {issue.severity}
                    </span>
                    <span className="text-xs text-muted-foreground">{issue.ruleId}</span>
                  </div>
                  <h3 className="mt-3 font-bold">{issue.problem}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {issue.filePath}:{issue.line}:{issue.column}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{issue.suggestion}</p>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </ContainerScroll>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        {result ? <Results result={result} /> : <EmptyState />}
      </section>

      <Footer
        brandName="gitlyze"
        brandDescription="Hybrid code review powered by static analysis and real-world developer knowledge. Built for developers who care about clean, production-ready code."
        brandIcon={<GitlyzeLogo markClassName="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16" />}
        navLinks={[
          { label: "Analyzer", href: "#results" },
          { label: "GitHub", href: "https://github.com/ANSHUL-REAL" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/anshul-nautiyal-42760236b/" },
        ]}
      />

      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
          onClick={() => setIsContactOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-border bg-panel p-6 shadow-[0_0_90px_rgba(45,225,160,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="contact-title" className="text-2xl font-black tracking-normal text-foreground">
                  Get in touch
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Open to feedback, collaborations, or opportunities.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsContactOpen(false)}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
                aria-label="Close contact modal"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-3">
              <a
                href="mailto:anshulnautiyal51@gmail.com"
                className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-4 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:bg-accent/10"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Mail className="size-5" />
                </span>
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/anshul-nautiyal-42760236b/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-4 text-sm font-semibold text-foreground transition hover:border-accent/50 hover:bg-accent/10"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Linkedin className="size-5" />
                </span>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <div className="text-2xl font-black text-foreground">{value}</div>
      <div className="mt-1 text-xs font-semibold text-muted-foreground">{label}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <GlowCard customSize glowColor="purple" className="rounded-3xl p-8 text-center">
      <div id="results">
      <p className="text-sm font-semibold uppercase text-accent">Ready when you are</p>
      <h2 className="mt-3 text-3xl font-black tracking-normal">Your full code review - structured and actionable.</h2>
      <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
        Clear signals, grouped issues, suggested fixes, and trusted references - all in one place.
      </p>
      </div>
    </GlowCard>
  );
}

function Results({ result }: { result: AnalysisResult }) {
  return (
    <div id="results" className="space-y-5">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase text-accent">Output</p>
        <h2 className="mt-2 text-3xl font-black tracking-normal md:text-4xl">
          Your full code review - structured and actionable.
        </h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Clear signals, grouped issues, suggested fixes, and trusted references - all in one place.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <GlowCard customSize glowColor="blue" className="rounded-3xl p-6">
          <p className="text-sm font-semibold uppercase text-accent">{result.summary.repo}</p>
          <h2 className="mt-3 text-5xl font-black tracking-normal">{result.score}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Quality Score</p>
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p>Branch: {result.summary.branch}</p>
            <p>Total files: {result.summary.totalFiles}</p>
            <p>Analyzed JS files: {result.summary.analyzedFiles}</p>
            <p>Issue types: {result.counts.issueTypes}</p>
          </div>
          {result.summary.stack.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {result.summary.stack.map((item) => (
                <span key={item} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          )}
        </GlowCard>

        <GlowCard customSize glowColor="green" className="rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase text-accent">Issues</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal">
                {result.issues.length === 0 ? "No lint issues found" : `${result.issues.length} findings`}
              </h2>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-100">{result.counts.errors} errors</span>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-100">{result.counts.warnings} warnings</span>
            </div>
          </div>

          {result.warnings.length > 0 && (
            <div className="mt-5 rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4 text-sm text-amber-100">
              {result.warnings.join(" ")}
            </div>
          )}

          <div className="mt-5 space-y-4">
            {result.issues.slice(0, 20).map((issue) => (
              <article key={issue.id} className="rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        issue.severity === "error" ? "bg-red-500/15 text-red-100" : "bg-amber-500/15 text-amber-100"
                      }`}
                    >
                      {issue.severity}
                    </span>
                    <h3 className="mt-3 font-bold text-foreground">{issue.problem}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {issue.filePath}:{issue.line}:{issue.column} - {issue.ruleId}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{issue.explanation}</p>
                <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-3 text-sm text-foreground">
                  {issue.suggestion}
                </div>
                {issue.references.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {issue.references.map((reference) => (
                      <a
                        key={reference.url}
                        href={reference.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
                      >
                        {reference.title}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
