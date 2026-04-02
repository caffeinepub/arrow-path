import { motion } from "motion/react";

interface SplashScreenProps {
  onStart: () => void;
}

export function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, oklch(0.12 0.04 260) 0%, oklch(0.07 0.02 260) 60%, oklch(0.06 0.01 250) 100%)",
      }}
    >
      {/* Background streaks */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute w-px h-full opacity-10"
          style={{
            left: "20%",
            background:
              "linear-gradient(to bottom, transparent, oklch(0.78 0.18 192), transparent)",
          }}
        />
        <div
          className="absolute w-px h-full opacity-5"
          style={{
            left: "70%",
            background:
              "linear-gradient(to bottom, transparent, oklch(0.82 0.22 130), transparent)",
          }}
        />
        <div
          className="absolute h-px w-full opacity-5"
          style={{
            top: "40%",
            background:
              "linear-gradient(to right, transparent, oklch(0.78 0.18 192), transparent)",
          }}
        />
        {/* Extra ambient glow orbs */}
        <div
          className="absolute rounded-full opacity-5"
          style={{
            width: "600px",
            height: "600px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, oklch(0.78 0.18 192 / 0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        {/* Icon: arrow pointing into circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Arrow pointing into circle"
            role="img"
            style={{
              filter:
                "drop-shadow(0 0 10px oklch(0.78 0.18 192 / 0.7)) drop-shadow(0 0 24px oklch(0.78 0.18 192 / 0.4))",
            }}
          >
            {/* Circle outline */}
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="oklch(0.78 0.18 192)"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Horizontal arrow shaft coming from left, into the circle */}
            <line
              x1="8"
              y1="40"
              x2="56"
              y2="40"
              stroke="oklch(0.78 0.18 192)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Arrow head pointing right */}
            <polyline
              points="48,31 58,40 48,49"
              stroke="oklch(0.78 0.18 192)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="font-display font-black uppercase tracking-widest neon-text-cyan"
          style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", lineHeight: 1.1 }}
        >
          Waymark
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="text-sm uppercase tracking-widest text-muted-foreground font-sans"
          style={{ letterSpacing: "0.3em" }}
        >
          Find the Path
        </motion.p>

        {/* Start button */}
        <motion.button
          type="button"
          onClick={onStart}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="mt-2 px-10 py-3.5 rounded-lg font-display font-bold text-sm uppercase tracking-wider transition-shadow duration-200"
          style={{
            background: "oklch(0.78 0.18 192)",
            color: "oklch(0.09 0.02 260)",
            boxShadow:
              "0 0 18px oklch(0.78 0.18 192 / 0.55), 0 0 36px oklch(0.78 0.18 192 / 0.25)",
          }}
          data-ocid="splash.primary_button"
        >
          Play Game
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center z-10">
        <p className="text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
