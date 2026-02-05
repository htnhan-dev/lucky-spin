import { useEffect, useState } from "react";

import { COLORS } from "../utils/constants";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export const RedEnvelope = ({
  index,
  user,
  isWinner,
  isSelected,
  isHighlighted,
  canClick,
  onClick,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isWinner && !showConfetti) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`envelope-${index}`);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
          colors: [COLORS.primary.gold, COLORS.primary.red, "#FFD700"],
        });

        setShowConfetti(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isWinner, showConfetti, index]);

  const handleClick = () => {
    if (canClick && onClick) onClick();
  };

  return (
    <motion.div
      id={`envelope-${index}`}
      initial={{ y: 60, opacity: 0, scale: 0.8 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: isWinner ? [1, 1.2, 1] : 1,
      }}
      transition={{
        delay: 0.6 + index * 0.15,
        type: "spring",
        stiffness: 100,
        scale: { duration: 0.8, repeat: isWinner ? 2 : 0 },
      }}
      whileHover={canClick ? { scale: 1.08 } : {}}
      onClick={handleClick}
      className={`text-center ${canClick ? "cursor-pointer" : ""}`}
    >
      <motion.div className="relative">
        {/* Outer glow for winner */}
        {isWinner && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `radial-gradient(circle, ${COLORS.primary.gold}80 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}

        {/* Envelope */}
        <div
          className="relative w-28 h-40 rounded-xl flex flex-col items-center justify-center overflow-hidden shadow-xl"
          style={{
            background: isWinner
              ? `linear-gradient(135deg, ${COLORS.primary.gold} 0%, ${COLORS.primary.lightGold || "#DAA520"} 100%)`
              : `linear-gradient(135deg, ${COLORS.primary.red} 0%, ${COLORS.primary.darkRed} 100%)`,
            boxShadow: isWinner
              ? `0 0 40px ${COLORS.primary.gold}A0,
                 inset 0 0 20px rgba(255,255,255,0.2),
                 0 10px 30px rgba(0,0,0,0.3)`
              : `0 12px 24px rgba(0,0,0,0.3),
                 inset 0 1px 0 rgba(255,255,255,0.1)`,
            border: isWinner ? `3px solid ${COLORS.primary.gold}` : "none",
          }}
        >
          {/* Shine */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          {/* Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)",
            }}
          />

          {/* Content */}
          <motion.div
            animate={{
              scale: isSelected ? 1 : 0.9,
              opacity: isSelected ? 1 : 0.7,
            }}
            className="relative z-10 text-center"
          >
            {user ? (
              <>
                <motion.div
                  className="mb-2 text-3xl"
                  animate={{
                    rotate: isWinner ? [0, 10, -10, 0] : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: isWinner ? 2 : 0,
                  }}
                >
                  🧧
                </motion.div>

                <div
                  className="text-xs font-bold leading-tight truncate px-1"
                  style={{
                    color: isWinner
                      ? COLORS.primary.darkRed
                      : COLORS.primary.gold,
                  }}
                >
                  {user.name}
                </div>

                {isWinner && (
                  <motion.div
                    className="text-xl mt-1"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    ⭐
                  </motion.div>
                )}
              </>
            ) : (
              <div
                className="text-4xl opacity-50"
                style={{ color: COLORS.primary.gold }}
              >
                ?
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2"
        >
          <div
            className="text-xs font-semibold"
            style={{ color: COLORS.primary.red }}
          >
            Selected
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
