/* eslint-disable react-hooks/purity */

import { COLORS } from "../utils/constants";
import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * Component các decorative elements Tết
 * - Hoa mai/đào
 * - Lanterns (đèn lồng)
 * - Petals falling animation
 */

// Hoa mai SVG
const HoaMai = ({ className, size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    fill="none"
  >
    {/* 5 cánh hoa màu vàng */}
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} transform={`rotate(${i * 72} 50 50)`}>
        <ellipse
          cx="50"
          cy="30"
          rx="8"
          ry="15"
          fill="#FFD700"
          stroke="#FFA500"
          strokeWidth="1"
        />
      </g>
    ))}
    {/* Nhụy hoa */}
    <circle cx="50" cy="50" r="6" fill="#FF6347" />
    <circle cx="50" cy="50" r="3" fill="#FFD700" />
  </svg>
);

// Lantern (đèn lồng) SVG
const Lantern = ({ className, size = 60 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 140"
    className={className}
    fill="none"
  >
    {/* Dây treo */}
    <line x1="50" y1="0" x2="50" y2="15" stroke="#8B4513" strokeWidth="2" />
    {/* Nắp trên */}
    <rect x="40" y="15" width="20" height="5" rx="2" fill="#FFD700" />
    {/* Thân đèn */}
    <ellipse cx="50" cy="60" rx="30" ry="40" fill="#DC143C" opacity="0.9" />
    <ellipse cx="50" cy="60" rx="25" ry="35" fill="#FF0000" opacity="0.8" />
    {/* Họa tiết */}
    <text
      x="50"
      y="65"
      fontSize="20"
      fontWeight="bold"
      fill="#FFD700"
      textAnchor="middle"
    >
      福
    </text>
    {/* Nắp dưới */}
    <rect x="40" y="100" width="20" height="5" rx="2" fill="#FFD700" />
    {/* Tua rua */}
    <line x1="50" y1="105" x2="45" y2="130" stroke="#FFD700" strokeWidth="2" />
    <line x1="50" y1="105" x2="50" y2="135" stroke="#FFD700" strokeWidth="2" />
    <line x1="50" y1="105" x2="55" y2="130" stroke="#FFD700" strokeWidth="2" />
  </svg>
);

// Component Falling Petals - OPTIMIZED: Reduced count for performance
export const FallingPetals = () => {
  const petals = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 5,
        size: 10 + Math.random() * 12,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: -20,
          }}
          initial={{ y: -20, rotate: 0, opacity: 0.7 }}
          animate={{
            y: window.innerHeight + 50,
            rotate: 360,
            opacity: [0.7, 0.9, 0.5, 0],
            x: [0, 30, -20, 40, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <HoaMai size={petal.size} />
        </motion.div>
      ))}
    </div>
  );
};

// Component Corner Decorations
export const CornerDecorations = () => {
  return (
    <>
      {/* Top Left - Hoa mai cluster */}
      <motion.div
        className="fixed top-4 left-4 z-20"
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
      >
        <div className="relative">
          <HoaMai size={60} className="absolute top-0 left-0" />
          <HoaMai size={45} className="absolute top-8 left-10 opacity-80" />
          <HoaMai size={35} className="absolute top-16 left-5 opacity-60" />
        </div>
      </motion.div>

      {/* Top Right - Hoa mai cluster */}
      <motion.div
        className="fixed top-4 right-4 z-20"
        initial={{ opacity: 0, scale: 0, rotate: 45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
      >
        <div className="relative">
          <HoaMai size={60} className="absolute top-0 right-0" />
          <HoaMai size={45} className="absolute top-8 right-10 opacity-80" />
          <HoaMai size={35} className="absolute top-16 right-5 opacity-60" />
        </div>
      </motion.div>

      {/* Floating Lanterns - Top corners */}
      <motion.div
        className="fixed top-20 left-20 z-20"
        animate={{
          y: [0, -10, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Lantern size={50} />
      </motion.div>

      <motion.div
        className="fixed top-20 right-20 z-20"
        animate={{
          y: [0, -15, 0],
          rotate: [2, -2, 2],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Lantern size={50} />
      </motion.div>

      {/* Bottom corners - Smaller lanterns */}
      <motion.div
        className="fixed bottom-20 left-32 z-20"
        animate={{
          y: [0, -8, 0],
          rotate: [-3, 3, -3],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Lantern size={40} />
      </motion.div>

      <motion.div
        className="fixed bottom-20 right-32 z-20"
        animate={{
          y: [0, -12, 0],
          rotate: [3, -3, 3],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <Lantern size={40} />
      </motion.div>
    </>
  );
};

// Component họa tiết giấy dó (cloud pattern)
export const CloudPattern = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="cloud-pattern"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            {/* Họa tiết mây */}
            <path
              d="M50,50 Q30,30 50,10 Q70,30 50,50 Z"
              fill={COLORS.primary.gold}
              opacity="0.3"
            />
            <path
              d="M150,150 Q130,130 150,110 Q170,130 150,150 Z"
              fill={COLORS.primary.gold}
              opacity="0.2"
            />
            <circle
              cx="100"
              cy="100"
              r="15"
              fill={COLORS.primary.gold}
              opacity="0.15"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cloud-pattern)" />
      </svg>
    </div>
  );
};
