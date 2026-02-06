import { motion } from "framer-motion";
import { useState } from "react";
import { COLORS } from "../utils/constants";

// Generate random floating items outside component to avoid re-render issues
const generateFloatingItems = () => {
  return Array.from({ length: 15 }).map((_, idx) => ({
    id: idx,
    emoji: idx % 3 === 0 ? "💰" : idx % 3 === 1 ? "🧧" : "🪙",
    initialX: Math.random() * 100,
    finalX: Math.random() * 100,
    rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
    duration: 4 + Math.random() * 3,
    delay: idx * 0.2,
  }));
};

/**
 * Component hiển thị hiệu ứng lời chúc và tiền vàng rơi xuống
 */
export const FloatingBlessing = ({ message }) => {
  // Generate random values only once when component mounts
  const [floatingItems] = useState(generateFloatingItems);

  const blessingLines = message.split("\n").map((line, idx) => ({
    id: idx,
    text: line,
    left: (idx * 17) % 100,
    delay: idx * 0.3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating blessing text - Rơi từ trên xuống */}
      {blessingLines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute w-full text-center px-4"
          initial={{ y: -100, opacity: 0, rotate: -5 }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0, 1, 1, 0.5, 0],
            rotate: ["-5deg", "5deg", "-3deg", "3deg", "0deg"],
          }}
          transition={{
            duration: 8,
            delay: line.delay,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
          style={{
            left: `${line.left}%`,
            fontSize: "14px",
            fontWeight: "bold",
            color: COLORS.primary.gold,
            textShadow: `2px 2px 4px rgba(0,0,0,0.3), 0 0 10px ${COLORS.primary.red}`,
            transform: `translateX(-50%)`,
          }}
        >
          {line.text}
        </motion.div>
      ))}

      {/* Floating gold coins and envelopes */}
      {floatingItems.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-4xl"
          initial={{
            x: `${item.initialX}%`,
            y: -50,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            y: ["0%", "120%"],
            opacity: [0, 1, 1, 0],
            rotate: [0, item.rotation],
            x: `${item.finalX}%`,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeIn",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
};
