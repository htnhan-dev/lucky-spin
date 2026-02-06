import { AnimatePresence, motion } from "framer-motion";

import { COLORS } from "../utils/constants";
import { useEffect } from "react";

const COUPLET_HEIGHT = 450;
const COUPLET_WIDTH = 120;
const CENTER_WIDTH = 360;

export const BlessingCouplet = ({
  isVisible,
  message,
  userName,
  prizeName,
  onClose,
}) => {
  const [leftLine = "", rightLine = ""] = message
    ? message.split("\n").map((s) => s.trim())
    : [];

  const leftWords = leftLine.split(" ").filter(Boolean);
  const rightWords = rightLine.split(" ").filter(Boolean);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => onClose?.(), 500);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  const renderSide = (words, side) => (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -60 : 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: side === "left" ? -60 : 60 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl flex items-center justify-center"
      style={{
        width: COUPLET_WIDTH,
        height: COUPLET_HEIGHT,
        padding: "24px 12px",
        background: `linear-gradient(180deg, ${COLORS.primary.red}, ${COLORS.primary.darkRed})`,
        border: `2px solid ${COLORS.primary.gold}`,
        boxShadow: "0 20px 50px rgba(0,0,0,.35)",
      }}
    >
      {/* shimmer */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: ["-120%", "220%"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(255,255,255,.18), transparent)",
        }}
      />

      {/* chữ dọc */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        {words.map((word, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="text-3xl font-black text-center"
            style={{
              color: COLORS.primary.gold,
              textShadow: "2px 2px 4px rgba(0,0,0,.45)",
              fontFamily: "'Noto Serif', 'Playfair Display', serif",
              wordBreak: "break-word",
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Layout */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none">
            <div className="flex items-start gap-10">
              {renderSide(leftWords, "left")}

              {/* CENTER */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 140 }}
                className="rounded-3xl text-center flex flex-col items-center justify-center gap-4"
                style={{
                  width: CENTER_WIDTH,
                  padding: "32px",
                  background: `linear-gradient(135deg, ${COLORS.primary.red}, ${COLORS.primary.darkRed})`,
                  border: `3px solid ${COLORS.primary.gold}`,
                  boxShadow: "0 25px 60px rgba(0,0,0,.4)",
                }}
              >
                <div
                  className="text-sm uppercase tracking-widest"
                  style={{ color: COLORS.primary.gold }}
                >
                  Chúc mừng
                </div>

                <div
                  className="text-2xl font-black"
                  style={{
                    color: COLORS.primary.gold,
                    textShadow: "0 0 10px rgba(250,204,21,.6)",
                  }}
                >
                  {userName}
                </div>

                <div className="text-white text-base leading-relaxed">
                  Đã trúng bao lì xì:{" "}
                  <span className="font-semibold text-yellow-300">
                    {prizeName}
                  </span>
                </div>
              </motion.div>

              {renderSide(rightWords, "right")}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
