import { AnimatePresence, motion } from "motion/react";
import React from "react";

interface SplashScreenProps {
  onStart: () => void;
}

export function SplashScreen({ onStart }: SplashScreenProps) {
  const [showPremiumModal, setShowPremiumModal] = React.useState(false);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "oklch(0.27 0.025 255)" }}
    >
      {/* Subtle ambient layers */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Soft vertical light traces */}
        <div
          className="absolute w-px h-full opacity-8"
          style={{
            left: "20%",
            background:
              "linear-gradient(to bottom, transparent, oklch(0.76 0.07 210 / 0.3), transparent)",
          }}
        />
        <div
          className="absolute w-px h-full opacity-5"
          style={{
            left: "75%",
            background:
              "linear-gradient(to bottom, transparent, oklch(0.73 0.1 130 / 0.25), transparent)",
          }}
        />
        {/* Ambient center glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: "500px",
            height: "500px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, oklch(0.76 0.07 210 / 0.06) 0%, transparent 70%)",
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
                "drop-shadow(0 0 8px oklch(0.76 0.07 210 / 0.5)) drop-shadow(0 0 18px oklch(0.76 0.07 210 / 0.25))",
            }}
          >
            {/* Circle outline */}
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="oklch(0.76 0.07 210)"
              strokeWidth="2"
              fill="none"
            />
            {/* Horizontal arrow shaft coming from left, into the circle */}
            <line
              x1="8"
              y1="40"
              x2="56"
              y2="40"
              stroke="oklch(0.76 0.07 210)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Arrow head pointing right */}
            <polyline
              points="48,31 58,40 48,49"
              stroke="oklch(0.76 0.07 210)"
              strokeWidth="2"
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-2 px-10 py-3.5 rounded-lg font-display font-bold text-sm uppercase tracking-wider transition-shadow duration-200"
          style={{
            background: "oklch(0.76 0.07 210)",
            color: "oklch(0.20 0.02 255)",
            boxShadow:
              "0 0 16px oklch(0.76 0.07 210 / 0.4), 0 0 32px oklch(0.76 0.07 210 / 0.15)",
          }}
          data-ocid="splash.primary_button"
        >
          Play Game
        </motion.button>

        {/* Remove Ads button */}
        <motion.button
          type="button"
          onClick={() => setShowPremiumModal(true)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75, ease: "easeOut" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-2.5 rounded-lg font-display text-xs uppercase tracking-wider border transition-all duration-200"
          style={{
            borderColor: "oklch(0.76 0.07 210 / 0.5)",
            color: "oklch(0.76 0.07 210)",
            background: "oklch(0.76 0.07 210 / 0.05)",
          }}
          data-ocid="splash.secondary_button"
        >
          ✨ Remove Ads
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

      {/* Premium / Remove Ads modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "oklch(0 0 0 / 0.72)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            data-ocid="removeads.modal"
          >
            <motion.div
              className="relative w-full max-w-sm rounded-2xl border p-8 flex flex-col items-center gap-5 text-center overflow-hidden"
              style={{
                background: "oklch(0.14 0.02 255)",
                borderColor: "oklch(0.76 0.07 210 / 0.35)",
                boxShadow:
                  "0 0 40px oklch(0.76 0.07 210 / 0.10), 0 0 80px oklch(0 0 0 / 0.4)",
              }}
              initial={{ scale: 0.88, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            >
              {/* Gradient wash */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, oklch(0.76 0.07 210 / 0.06) 0%, transparent 65%)",
                }}
              />

              <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>✨</div>

              <div className="flex flex-col gap-2">
                <h2
                  className="text-xl font-display font-bold uppercase tracking-widest"
                  style={{
                    color: "oklch(0.76 0.07 210)",
                    textShadow: "0 0 12px oklch(0.76 0.07 210 / 0.35)",
                  }}
                >
                  Premium
                </h2>
                <p
                  className="text-sm font-sans leading-relaxed"
                  style={{ color: "oklch(0.58 0.03 240)" }}
                >
                  Remove Ads is coming soon. Stay tuned for the premium upgrade.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPremiumModal(false)}
                className="w-full py-3 px-6 rounded-lg font-display font-bold text-sm uppercase tracking-wider
                  transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "oklch(0.76 0.07 210)",
                  color: "oklch(0.15 0.02 255)",
                  boxShadow: "0 0 12px oklch(0.76 0.07 210 / 0.35)",
                }}
                data-ocid="removeads.confirm_button"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
