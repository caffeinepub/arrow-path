import { AnimatePresence, motion } from "motion/react";
import React from "react";

interface AdScreenProps {
  onClose: () => void;
  accentColor?: string;
}

export function AdScreen({
  onClose,
  accentColor = "oklch(0.76 0.07 210)",
}: AdScreenProps) {
  const [countdown, setCountdown] = React.useState(5);
  const canClose = countdown <= 0;

  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: "oklch(0.08 0.01 255 / 0.97)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      data-ocid="ad.modal"
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
        {/* Label */}
        <p
          className="text-xs font-display uppercase tracking-widest"
          style={{ color: "oklch(0.42 0.03 240)" }}
        >
          Advertisement
        </p>

        {/* Mock ad box */}
        <motion.div
          className="relative w-full rounded-xl overflow-hidden border flex flex-col items-center justify-center gap-4 py-14 px-8"
          style={{
            background: "oklch(0.14 0.02 255)",
            borderColor: `${accentColor.replace(")", " / 0.3)")}`,
            boxShadow: `0 0 32px ${accentColor.replace(")", " / 0.08)")}, inset 0 0 60px oklch(0.10 0.01 255 / 0.5)`,
          }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
        >
          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, oklch(0.76 0.07 210 / 0.04) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "adShimmer 2.5s infinite linear",
            }}
          />

          {/* TV / Film icon */}
          <div
            style={{
              color: `${accentColor.replace(")", " / 0.35)")}`,
              filter: `drop-shadow(0 0 12px ${accentColor.replace(")", " / 0.2)")})`,
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="14"
                width="56"
                height="36"
                rx="5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="20"
                y1="50"
                x2="12"
                y2="58"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="44"
                y1="50"
                x2="52"
                y2="58"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="32"
                cy="32"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <polygon
                points="28,27 28,37 40,32"
                fill="currentColor"
                opacity="0.6"
              />
              {/* Antennae */}
              <line
                x1="28"
                y1="14"
                x2="20"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="36"
                y1="14"
                x2="44"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="text-center">
            <p
              className="text-lg font-display font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.38 0.03 240)" }}
            >
              Ad Placeholder
            </p>
            <p
              className="text-xs font-sans mt-1"
              style={{ color: "oklch(0.30 0.02 240)" }}
            >
              Your ad could be here
            </p>
          </div>

          {/* Corner brackets for premium frame feel */}
          <div
            className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2"
            style={{ borderColor: `${accentColor.replace(")", " / 0.25)")}` }}
          />
          <div
            className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2"
            style={{ borderColor: `${accentColor.replace(")", " / 0.25)")}` }}
          />
          <div
            className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2"
            style={{ borderColor: `${accentColor.replace(")", " / 0.25)")}` }}
          />
          <div
            className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2"
            style={{ borderColor: `${accentColor.replace(")", " / 0.25)")}` }}
          />
        </motion.div>

        {/* Countdown + Close button row */}
        <div className="flex flex-col items-center gap-3 w-full">
          <AnimatePresence mode="wait">
            {!canClose ? (
              <motion.p
                key="countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-display uppercase tracking-widest"
                style={{ color: "oklch(0.38 0.03 240)" }}
                data-ocid="ad.loading_state"
              >
                Skip in {countdown}...
              </motion.p>
            ) : (
              <motion.div
                key="closeable"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center"
                data-ocid="ad.success_state"
              >
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-2.5 rounded-full font-display font-bold text-sm uppercase tracking-wider border transition-colors duration-200"
                  style={{
                    borderColor: accentColor,
                    color: accentColor,
                    background: `${accentColor.replace(")", " / 0.08)")}`,
                  }}
                  data-ocid="ad.close_button"
                >
                  ✕ Close
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes adShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </motion.div>
  );
}
