import { cn } from "@/lib/utils";

export function GitlyzeLogo({
  className,
  markClassName,
  showWordmark = false,
}: {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <div aria-label="gitlyze" className={cn("flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 120 120"
        role="img"
        aria-label="Gitlyze logo"
        className={cn("h-11 w-11 drop-shadow-[0_0_18px_rgba(45,225,160,0.36)]", markClassName)}
      >
        <defs>
          <linearGradient id="gitlyze-mark" x1="18" y1="10" x2="102" y2="112" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#45f4b0" />
            <stop offset="0.52" stopColor="#24d99a" />
            <stop offset="1" stopColor="#17b884" />
          </linearGradient>
        </defs>
        <path
          fill="url(#gitlyze-mark)"
          d="M41 17h55c5 0 8.2 5.6 5.6 9.9L88 49.6H52.5c-13.4 0-23.7 9.8-23.7 22.2 0 7.7 4.8 13.7 12.1 13.7h30.8c7.6 0 13.9-3.4 18.1-10l18.7-29.4h-1.3L88.8 86c-7 15.2-20.7 22.7-38.7 22.7H12l13.2-21.9h10.1c-12.8-3.3-20.7-13.6-20.7-28.4C14.6 35.1 25.9 17 41 17Z"
        />
        <path fill="url(#gitlyze-mark)" d="M80.2 91h27.9l-13.2 21.8H67.1L80.2 91Z" />
      </svg>

      {showWordmark && (
        <svg
          viewBox="0 0 360 88"
          role="img"
          aria-label="gitlyze"
          className="h-10 w-[164px] drop-shadow-[0_0_18px_rgba(45,225,160,0.22)]"
        >
          <defs>
            <linearGradient id="gitlyze-word" x1="0" y1="0" x2="360" y2="88" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.42" stopColor="#ffffff" />
              <stop offset="0.56" stopColor="#38edaf" />
              <stop offset="1" stopColor="#21d498" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="67"
            fill="url(#gitlyze-word)"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
            fontSize="80"
            fontWeight="800"
            letterSpacing="2"
          >
            gitlyze
          </text>
        </svg>
      )}
    </div>
  );
}
