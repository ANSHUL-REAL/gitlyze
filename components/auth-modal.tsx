"use client";

import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  forwardRef,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { User } from "@supabase/supabase-js";
import { Eye, EyeOff, Lock, LogOut, Mail, UserPlus, X } from "lucide-react";
import {
  motion,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValue,
} from "motion/react";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

const Input = memo(
  forwardRef(function Input(
    { className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) {
    const radius = 120;
    const [visible, setVisible] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({
      currentTarget,
      clientX,
      clientY,
    }: React.MouseEvent<HTMLDivElement>) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
              hsl(var(--accent) / 0.85),
              transparent 80%
            )
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-xl p-[1px] transition duration-300"
      >
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }),
);

Input.displayName = "Input";

function BoxReveal({
  children,
  width = "fit-content",
  boxColor = "hsl(var(--accent))",
  duration = 0.4,
  className,
}: {
  children: ReactNode;
  width?: string;
  boxColor?: string;
  duration?: number;
  className?: string;
}) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    slideControls.start("visible");
    mainControls.start("visible");
  }, [isInView, mainControls, slideControls]);

  return (
    <section ref={ref} style={{ position: "relative", width, overflow: "hidden" }} className={className}>
      <motion.div
        variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay: 0.16 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: "100%" } }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration, ease: "easeIn" }}
        style={{
          position: "absolute",
          top: 3,
          bottom: 3,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor,
          borderRadius: 6,
        }}
      />
    </section>
  );
}

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return user;
}

export function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");

    const supabase = createClient();
    if (!supabase) {
      setError("Sign in is not available yet. Please try again later.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setStatus("Account created. Check your inbox if email confirmation is enabled.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        setStatus("Signed in successfully.");
      }
      setTimeout(onClose, 700);
    } catch (caught) {
      setError(caught instanceof Error ? friendlySupabaseError(caught.message) : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[920px] overflow-hidden rounded-3xl border border-border bg-panel shadow-[0_0_100px_rgba(45,225,160,0.14)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid lg:grid-cols-[1fr_1.05fr]">
          <section className="relative hidden min-h-[540px] overflow-hidden border-r border-border bg-background/70 lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.16),transparent_36rem)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              {Array.from({ length: 8 }).map((_, index) => (
                <span
                  key={index}
                  className="absolute rounded-full border border-accent/20"
                  style={{
                    width: 160 + index * 70,
                    height: 160 + index * 70,
                    opacity: 0.28 - index * 0.025,
                  }}
                />
              ))}
            </div>
            <div className="relative z-10 flex h-full flex-col justify-between p-8">
              <div>
                <p className="text-sm font-semibold uppercase text-accent">Gitlyze account</p>
                <h3 className="mt-3 max-w-sm text-4xl font-black leading-tight tracking-normal">
                  Save reviews and build a cleaner code history.
                </h3>
              </div>
              <div className="rounded-3xl border border-border bg-panel/80 p-5 backdrop-blur">
                <p className="text-sm leading-6 text-muted-foreground">
                  Sign in to get full access to saved reviews, cleaner history, and a smoother Gitlyze workflow.
                </p>
              </div>
            </div>
          </section>

          <section className="relative p-6 sm:p-8">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
              aria-label="Close auth modal"
            >
              <X className="size-4" />
            </button>

            <div className="pr-10">
              <BoxReveal>
                <h2 id="auth-title" className="text-3xl font-black tracking-normal">
                  {mode === "signin" ? "Sign in" : "Create account"}
                </h2>
              </BoxReveal>
              <BoxReveal width="100%" className="mt-3">
                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                  {mode === "signin"
                    ? "Access your Gitlyze workspace."
                    : "Start reviewing repositories with a Gitlyze account."}
                </p>
              </BoxReveal>
            </div>

            <div className="mt-7 grid grid-cols-2 rounded-2xl border border-border bg-background/70 p-1">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-semibold transition",
                  mode === "signin" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-semibold transition",
                  mode === "signup" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={submit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="auth-email" className="text-sm font-semibold text-foreground">
                  Email
                </label>
                <div className="mt-2">
                  <Input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auth-password" className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <div className="relative mt-2">
                  <Input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {!isSupabaseConfigured && (
                <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
                  Account access is being set up. Please try again later.
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-100">
                  {error}
                </div>
              )}
              {status && (
                <div className="rounded-2xl border border-accent/25 bg-accent/10 p-4 text-sm text-accent">
                  {status}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group/btn relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent text-sm font-bold text-accent-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mode === "signin" ? <Lock className="size-4" /> : <UserPlus className="size-4" />}
                {isSubmitting ? "Working..." : mode === "signin" ? "Sign in" : "Create account"}
                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 transition group-hover/btn:opacity-100" />
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="w-full text-center text-sm font-semibold text-muted-foreground transition hover:text-foreground"
              >
                {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export async function signOutCurrentUser() {
  const supabase = createClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export function AuthStatusButton({
  user,
  onOpen,
}: {
  user: User | null;
  onOpen: () => void;
}) {
  if (user) {
    return (
      <button
        type="button"
        onClick={() => signOutCurrentUser()}
        className="hidden items-center gap-2 rounded-full border border-border bg-panel/80 px-4 py-2 text-sm text-muted-foreground transition hover:border-accent/50 hover:text-foreground sm:inline-flex"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-panel/80 px-4 py-2 text-sm text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
    >
      <Lock className="size-4" />
      Sign in
    </button>
  );
}

function friendlySupabaseError(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) return "Invalid email or password.";
  if (message.toLowerCase().includes("already registered")) return "That email already has an account.";
  if (message.toLowerCase().includes("password")) return "Password must be at least 6 characters.";
  if (message.toLowerCase().includes("email not confirmed")) return "Please confirm your email before signing in.";
  return message;
}
