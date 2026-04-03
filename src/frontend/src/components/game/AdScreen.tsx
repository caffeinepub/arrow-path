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
      <div className="flex flex-col items-center gap-4 w-full max-w-sm px-4">
        {/* Top label */}
        <p
          className="text-xs font-display uppercase tracking-widest"
          style={{ color: "oklch(0.42 0.03 240)" }}
        >
          Advertisement
        </p>

        {/* Ad card */}
        <motion.div
          className="relative w-full rounded-xl overflow-hidden border flex flex-col"
          style={{
            background: "oklch(0.10 0.02 240)",
            borderColor: `${accentColor.replace(")", " / 0.3)")}`,
            boxShadow: `0 0 32px ${accentColor.replace(")", " / 0.10)")}, inset 0 0 60px oklch(0.08 0.01 255 / 0.5)`,
          }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
        >
          {/* Countdown badge — top right */}
          <div className="absolute top-3 right-3 z-10">
            <AnimatePresence mode="wait">
              {!canClose ? (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-display"
                  style={{
                    background: "oklch(0.08 0.01 255 / 0.80)",
                    color: "oklch(0.65 0.03 240)",
                    border: "1px solid oklch(0.25 0.02 240 / 0.5)",
                  }}
                  data-ocid="ad.loading_state"
                >
                  {countdown}
                </motion.div>
              ) : (
                <motion.button
                  key="close"
                  type="button"
                  onClick={onClose}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "oklch(0.20 0.02 240 / 0.90)",
                    color: "oklch(0.75 0.03 240)",
                    border: "1px solid oklch(0.35 0.03 240 / 0.6)",
                  }}
                  data-ocid="ad.close_button"
                >
                  ✕
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Sponsored label inside card */}
          <div
            className="px-4 pt-4 pb-2"
            style={{ background: "oklch(0.10 0.02 240)" }}
          >
            <p
              className="text-xs font-display font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.60 0.10 240)" }}
            >
              SPONSORED: Bright Smile Daily
            </p>
          </div>

          {/* Full-bleed product image */}
          <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
            <img
              src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800"
              alt="Bright Smile Daily product"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtle bottom gradient to blend into CTA area */}
            <div
              className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, oklch(0.10 0.02 240))",
              }}
            />
          </div>

          {/* CTA area */}
          <div
            className="flex flex-col items-center gap-3 px-6 py-5"
            style={{ background: "oklch(0.10 0.02 240)" }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.20 250), oklch(0.45 0.22 265))",
                boxShadow:
                  "0 4px 20px oklch(0.50 0.20 255 / 0.40), 0 1px 4px oklch(0.30 0.15 255 / 0.30)",
              }}
            >
              SHOP NOW
            </motion.button>
          </div>
        </motion.div>

        {/* Skip row below the card when timer is still running */}
        <AnimatePresence>
          {!canClose && (
            <motion.p
              key="skip-note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-display uppercase tracking-widest"
              style={{ color: "oklch(0.28 0.02 240)" }}
            >
              Ad closes in {countdown}s
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
