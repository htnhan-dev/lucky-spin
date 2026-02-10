import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { COLORS } from "../utils/constants";
import { X } from "lucide-react";
import blx1 from "../assets/blx1.png";
import blx2 from "../assets/blx2.png";
import blx3 from "../assets/blx3.png";
import blx4 from "../assets/blx4.png";
import confetti from "canvas-confetti";

// Mảng background cho 4 bao lì xì
const envelopeBackgrounds = [blx1, blx2, blx3, blx4];

export const RedEnvelope = ({
  index,
  user,
  prize, // Giải thưởng của user này
  isSelected,
  isHighlighted,
  canClick,
  canReveal, // Có thể mở bao (shake state)
  isRevealing, // Đang mở bao (paper scroll ra)
  isRevealed, // Đã mở xong
  onClick,
  onReveal, // Callback khi click để mở bao
  onRemove, // Callback để xóa user khỏi envelope
  luckyStarUser, // User đã trúng ngôi sao hi vọng
  isDisabled, // Bao này bị disable (vì lượt cuối chỉ N người)
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDisabledTooltip, setShowDisabledTooltip] = useState(false);

  useEffect(() => {
    if (showDisabledTooltip) {
      const timer = setTimeout(() => setShowDisabledTooltip(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showDisabledTooltip]);

  useEffect(() => {
    if (isRevealed && !showConfetti) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`envelope-${index}`);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        confetti({
          particleCount: 50,
          spread: 60,
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
  }, [isRevealed, showConfetti, index]);

  const handleClick = () => {
    // Nếu bao này bị disable, show tooltip
    if (isDisabled) {
      setShowDisabledTooltip(true);
      return;
    }

    if (canClick && onClick) {
      onClick();
    } else if (canReveal && !isRevealed && onReveal) {
      onReveal();
    }
  };

  return (
    <motion.div
      id={`envelope-${index}`}
      initial={{ y: 60, opacity: 0, scale: 0.8 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: canReveal && !isRevealed ? [1, 1.05, 1] : 1, // Shake effect
      }}
      transition={{
        delay: 0.6 + index * 0.15,
        type: "spring",
        stiffness: 100,
        scale: {
          duration: 0.5,
          repeat: canReveal && !isRevealed ? Infinity : 0, // Lắc liên tục khi có thể mở
        },
      }}
      whileHover={
        (canClick || canReveal) && !isRevealed && !isDisabled
          ? { scale: 1.08 }
          : {}
      }
      onClick={handleClick}
      className={`relative text-center ${
        isDisabled
          ? "cursor-not-allowed opacity-60"
          : (canClick || canReveal) && !isRevealed
            ? "cursor-pointer"
            : ""
      }`}
    >
      {/* Envelope container */}
      <motion.div className="relative">
        {/* Outer glow khi revealed */}
        {isRevealed && prize && (
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
            // Logic đơn giản - CHỈ DÙNG backgroundImage:
            // 1. Đã mở (isRevealed + prize) -> bg vàng gradient
            // 2. Đã có user nhưng chưa mở -> bg đỏ gradient
            // 3. Chưa có user -> bg blx1-4 (hình nền)
            backgroundImage:
              isRevealed && prize
                ? `linear-gradient(135deg, ${COLORS.primary.gold} 0%, ${COLORS.primary.lightGold || "#DAA520"} 100%)`
                : user && !isRevealed
                  ? `linear-gradient(135deg, ${COLORS.primary.red} 0%, #B91C1C 100%)`
                  : `url(${envelopeBackgrounds[index % 4]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            boxShadow: isRevealed
              ? `0 0 40px ${COLORS.primary.gold}A0,
                 inset 0 0 20px rgba(255,255,255,0.2),
                 0 10px 30px rgba(0,0,0,0.3)`
              : canReveal
                ? `0 0 20px ${COLORS.accent.amber}80,
                   0 12px 24px rgba(0,0,0,0.3),
                   inset 0 1px 0 rgba(255,255,255,0.1)`
                : `0 12px 24px rgba(0,0,0,0.3),
                   inset 0 1px 0 rgba(255,255,255,0.1)`,
            border: isRevealed
              ? `3px solid ${COLORS.primary.gold}`
              : canReveal
                ? `2px solid ${COLORS.accent.amber}`
                : "none",
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
                {/* Lucky Star Badge - CHỈ HIỆN KHI ĐÃ MỞ BAO LÌ XÌ */}
                {isRevealed &&
                  luckyStarUser &&
                  user.id === luckyStarUser.id && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="absolute -top-2 -right-2 z-20"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))",
                      }}
                    >
                      <span className="text-4xl">⭐</span>
                    </motion.div>
                  )}
                {/* Emoji bao lì xì */}
                <motion.div
                  className="mb-2 text-3xl"
                  animate={{
                    rotate: canReveal && !isRevealed ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: canReveal && !isRevealed ? Infinity : 0,
                  }}
                >
                  🧧
                </motion.div>

                {/* Tên người */}
                <div
                  className="text-xs mt-2! font-bold leading-tight px-2 wrap-break-word"
                  style={{
                    color: isRevealed
                      ? COLORS.primary.darkRed
                      : COLORS.primary.gold,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    hyphens: "auto",
                  }}
                >
                  {user.name}
                </div>

                {/* Hiển thị giá trị giải khi đã mở */}
                {isRevealed && prize && (
                  <motion.div
                    className="text-[10px] font-black mt-1! leading-tight px-1"
                    style={{ color: COLORS.primary.darkRed }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    {prize.displayValue || prize.description}
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

      {/* Paper scroll animation khi mở bao */}
      <AnimatePresence>
        {isRevealing && prize && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: -60, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 bg-yellow-50 rounded-lg shadow-2xl p-3 border-2 border-yellow-600 z-50"
          >
            <div className="text-center">
              <div className="text-lg font-black text-red-600 mb-1">
                {prize.name}
              </div>
              <div className="text-xs text-gray-700 font-semibold">
                {prize.description}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip khi bao bị disable (lượt cuối, không đủ người) */}
      <AnimatePresence>
        {showDisabledTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-yellow-600 text-white text-xs font-semibold px-3! py-1! rounded-lg whitespace-nowrap shadow-lg z-50 pointer-events-none"
          >
            ⚠️ Đã hết lượt phân phát cho bao lì xì này
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút xóa user - Hiện khi đã selected và chưa spin */}
      {isSelected && !canReveal && !isRevealed && onRemove && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => {
            e.stopPropagation(); // Không trigger onClick của envelope
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg z-50 hover:bg-red-600 transition-colors"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}

      {/* {isSelected && (
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
      )} */}
    </motion.div>
  );
};
